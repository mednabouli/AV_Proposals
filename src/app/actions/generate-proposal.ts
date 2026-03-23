"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/ai/client";
import { getSystemPrompt, buildProposalPrompt, type GeneratedProposal } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/rate-limit";
import { queryTemplatesForProposal } from "@/lib/ai/pinecone";
import { trackProposalGenerated, trackFirstProposalGenerated } from "@/lib/analytics/posthog";

interface GenerateProposalInput {
  proposalId: string;
}

interface GenerateProposalResult {
  success?: boolean;
  error?: string;
  proposal?: {
    id: string;
    generated_content: GeneratedProposal;
  };
}

export async function generateProposal(
  input: GenerateProposalInput
): Promise<GenerateProposalResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: "Non authentifié" };
    }

    // Get Supabase client
    const supabase = await createClient();

    // Get user's profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error: profileError } = await (supabase as any)
      .from("profiles")
      .select("*")
      .eq("clerk_user_id", userId)
      .single();

    if (profileError || !profile) {
      return { error: "Profil non trouvé" };
    }

    const profileId = (profile as Record<string, string>).id;

    // Check rate limit
    const rateLimitCheck = await checkRateLimit(profileId, "proposal_generation");
    if (!rateLimitCheck.allowed) {
      return {
        error: `Limite de générations atteinte. Réessai à ${rateLimitCheck.resetAt.toLocaleTimeString()}`,
      };
    }

    // Check plan limits
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: subscription } = await (supabase as any)
      .from("user_subscriptions")
      .select("plan_id, status")
      .eq("profile_id", profileId)
      .single();

    if (!subscription) {
      return { error: "Abonnement non trouvé" };
    }

    // Get plan details
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: plan } = await (supabase as any)
      .from("billing_plans")
      .select("name, max_generations_per_month")
      .eq("id", (subscription as Record<string, string>).plan_id)
      .single();

    if (!plan) {
      return { error: "Plan non trouvé" };
    }

    const planName = (plan as Record<string, string>).name;
    const maxGenerations = (plan as Record<string, number>).max_generations_per_month;

    // If Free plan, check monthly usage
    if (planName === "Free" && maxGenerations > 0) {
      // Get current month's generation count
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count: generationCount } = await (supabase as any)
        .from("proposals")
        .select("id", { count: "exact" })
        .eq("owner_profile_id", profileId)
        .neq("generated_content", null)
        .gte("created_at", monthStart.toISOString())
        .lte("created_at", monthEnd.toISOString());

      if (generationCount !== null && generationCount >= maxGenerations) {
        return {
          error: `Vous avez atteint votre limite de ${maxGenerations} générations pour ce mois. Passer à Pro pour générations illimitées.`,
          proposal: undefined,
        };
      }
    }

    // Get the proposal from DB
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: proposal, error: proposalError } = await (supabase as any)
      .from("proposals")
      .select("*")
      .eq("id", input.proposalId)
      .eq("owner_profile_id", profileId)
      .single();

    if (proposalError || !proposal) {
      return { error: "Devis non trouvé" };
    }

    // Query templates for context (for future RAG enhancement)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const templates = await queryTemplatesForProposal(
      (proposal as Record<string, string>).project_type
    );

    // Build prompt
    const systemPrompt = getSystemPrompt((proposal as Record<string, string>).language as "fr" | "en");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userPrompt = buildProposalPrompt({
      client_name: (proposal as Record<string, string>).client_name,
      client_company: (proposal as Record<string, string>).client_company,
      project_type: (proposal as Record<string, string>).project_type,
      budget_range: (proposal as Record<string, string>).budget_range,
      location: (proposal as Record<string, string>).location,
      date_duration: "",
      raw_brief: (proposal as Record<string, string>).raw_brief,
      language: (proposal as Record<string, string>).language as "fr" | "en",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      profile: profile as any,
    });

    // Call Claude to generate proposal
    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    // Extract and parse the generated content
    const content = response.content[0];
    if (content.type !== "text") {
      return { error: "Réponse invalide du modèle" };
    }

    let generatedContent: GeneratedProposal;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      generatedContent = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return { error: "Erreur lors du parsing de la réponse IA" };
    }

    // Update proposal with generated content
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: updated, error: updateError } = await (supabase as any)
      .from("proposals")
      .update({
        generated_content: generatedContent,
        status: "draft",
      })
      .eq("id", input.proposalId)
      .select()
      .single();

    if (updateError || !updated) {
      console.error("Update error:", updateError);
      return { error: "Erreur lors de la sauvegarde du devis généré" };
    }

    // Track proposal generation
    try {
      const projectType = (proposal as Record<string, string>).project_type;
      
      // Check if this is the first proposal
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count: totalProposals } = await (supabase as any)
        .from("proposals")
        .select("id", { count: "exact" })
        .eq("owner_profile_id", profileId)
        .neq("generated_content", null);

      const isFirstProposal = (totalProposals || 0) === 1;

      if (isFirstProposal) {
        await trackFirstProposalGenerated(userId, input.proposalId, projectType);
        
        // Send first proposal email
        try {
          const { sendFirstProposalEmail } = await import("@/lib/email/resend");
          if ((profile as Record<string, string>).email) {
            await sendFirstProposalEmail(
              (profile as Record<string, string>).email,
              (profile as Record<string, string>).name || "User",
              input.proposalId
            );
          }
        } catch (emailError) {
          console.error("Failed to send first proposal email:", emailError);
        }
      } else {
        await trackProposalGenerated(userId, projectType);
      }
    } catch (trackingError) {
      console.error("Failed to track proposal generation:", trackingError);
    }

    return {
      success: true,
      proposal: {
        id: (updated as Record<string, string>).id,
        generated_content: generatedContent,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Une erreur est survenue lors de la génération" };
  }
}
