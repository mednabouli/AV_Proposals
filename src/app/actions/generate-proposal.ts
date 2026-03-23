"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/ai/client";
import { getSystemPrompt, buildProposalPrompt, type GeneratedProposal } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/rate-limit";
import { queryTemplatesForProposal } from "@/lib/ai/pinecone";

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
