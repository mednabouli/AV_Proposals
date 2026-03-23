"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

interface ProposalInput {
  client_name: string;
  client_company: string;
  project_type: string;
  budget: string;
  location: string;
  date_duration: string;
  language: "fr" | "en";
  raw_brief: string;
}

interface CreateProposalResult {
  success?: boolean;
  error?: string;
  proposal?: {
    id: string;
  };
}

export async function createProposal(input: ProposalInput): Promise<CreateProposalResult> {
  try {
    // Validate input
    if (!input.client_name?.trim()) {
      return { error: "Le nom du client est requis" };
    }
    if (!input.project_type?.trim()) {
      return { error: "Le type de projet est requis" };
    }
    if (!input.budget?.trim()) {
      return { error: "Le budget est requis" };
    }
    if (!input.location?.trim()) {
      return { error: "La localisation est requise" };
    }
    if (!input.date_duration?.trim()) {
      return { error: "La date/durée est requise" };
    }
    if (!input.raw_brief?.trim() || input.raw_brief.trim().length < 10) {
      return { error: "Le brief doit contenir au moins 10 caractères" };
    }

    const { userId } = await auth();
    if (!userId) {
      return { error: "Non authentifié" };
    }

    // Get Supabase client
    const supabase = await createClient();

    // Get user's profile ID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error: profileError } = await (supabase as any)
      .from("profiles")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (profileError || !profile) {
      return { error: "Profil non trouvé" };
    }

    // Create proposal in database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error: insertError } = await (supabase as any)
      .from("proposals")
      .insert({
        owner_profile_id: (profile as Record<string, string>).id,
        client_name: input.client_name.trim(),
        client_company: input.client_company?.trim() || null,
        project_type: input.project_type.trim(),
        budget_range: input.budget.trim(),
        location: input.location.trim(),
        language: input.language,
        raw_brief: input.raw_brief.trim(),
        status: "draft" as const,
      })
      .select()
      .single();

    if (insertError || !data) {
      console.error("Insert error:", insertError);
      return { error: "Erreur lors de la création du devis" };
    }

    return { success: true, proposal: { id: (data as Record<string, string>).id } };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Une erreur est survenue" };
  }
}
