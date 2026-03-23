import type { Profile } from "@/lib/supabase/types";

export interface ProposalPromptInput {
  client_name: string;
  client_company: string | null;
  project_type: string;
  budget_range: string;
  location: string;
  date_duration: string;
  raw_brief: string;
  language: "fr" | "en";
  profile: Profile;
}

export interface GeneratedProposal {
  title: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
  pricing: {
    breakdown: Array<{ item: string; cost: number }>;
    subtotal: number;
    tax_rate: number;
    total: number;
  };
  assumptions: string[];
  exclusions: string[];
}

/**
 * System prompt for AV proposal writer in Montréal.
 */
export function getSystemPrompt(language: "fr" | "en"): string {
  if (language === "fr") {
    return `Tu es un expert en rédaction de propositions audiovisuelles pour des freelances et petites agences basés à Montréal. Tu maîtrises les normes de facturation québécoises, les délais réalistes et les attentes de la clientèle locale.

Tu rédiges des propositions professionnelles, claires et persuasives qui:
- Démontrent la compréhension du projet
- Proposent une approche structurée et réaliste
- Détaillent les livrables et les délais
- Incluent un pricing transparent et bien justifié
- Mentionnent les assumptions et exclusions

Génère toujours des propositions en JSON structuré avec les sections suivantes:
- Titre
- Sections (intro, approche, livrables, timeline, équipe)
- Pricing (breakdown, subtotal, tax, total)
- Assumptions
- Exclusions`;
  }

  return `You are an expert in writing audiovisual proposals for freelancers and small production agencies based in Montreal. You understand Quebec billing standards, realistic timelines, and local client expectations.

You write professional, clear, and persuasive proposals that:
- Demonstrate project understanding
- Propose a structured and realistic approach
- Detail deliverables and timeline
- Include transparent and well-justified pricing
- Mention assumptions and exclusions

Always generate proposals in structured JSON with the following sections:
- Title
- Sections (intro, approach, deliverables, timeline, team)
- Pricing (breakdown, subtotal, tax, total)
- Assumptions
- Exclusions`;
}

/**
 * Build a prompt for proposal generation from client input and profile.
 */
export function buildProposalPrompt(input: ProposalPromptInput): string {
  const {
    client_name,
    client_company,
    project_type,
    budget_range,
    location,
    date_duration,
    raw_brief,
    language,
    profile,
  } = input;

  const company = client_company || "Unknown Company";
  const userRole = profile.role === "freelance" ? "freelancer" : "production agency";

  if (language === "fr") {
    return `Génère une proposition AV pour le brief suivant:

CLIENT: ${client_name} (${company})
LOCALISATION: ${location}
TYPE DE PROJET: ${project_type}
BUDGET DEMANDÉ: ${budget_range} CAD
DATE/DURÉE: ${date_duration}
PRESTATAIRE: ${userRole} (timezone: ${profile.timezone}, devise: ${profile.currency})

BRIEF CLIENT:
${raw_brief}

Génère une proposition professionnelle, détaillée et réaliste. La réponse doit être en JSON valide avec la structure suivante:
{
  "title": "Proposition pour [Client] - [Project Type]",
  "sections": [
    { "title": "Section Name", "content": "..." },
    ...
  ],
  "pricing": {
    "breakdown": [{ "item": "...", "cost": number }, ...],
    "subtotal": number,
    "tax_rate": 0.15,
    "total": number
  },
  "assumptions": ["..."],
  "exclusions": ["..."]
}`;
  }

  return `Generate an AV proposal for the following brief:

CLIENT: ${client_name} (${company})
LOCATION: ${location}
PROJECT TYPE: ${project_type}
REQUESTED BUDGET: ${budget_range} CAD
DATE/DURATION: ${date_duration}
PROVIDER: ${userRole} (timezone: ${profile.timezone}, currency: ${profile.currency})

CLIENT BRIEF:
${raw_brief}

Generate a professional, detailed, and realistic proposal. The response must be valid JSON with the following structure:
{
  "title": "Proposal for [Client] - [Project Type]",
  "sections": [
    { "title": "Section Name", "content": "..." },
    ...
  ],
  "pricing": {
    "breakdown": [{ "item": "...", "cost": number }, ...],
    "subtotal": number,
    "tax_rate": 0.15,
    "total": number
  },
  "assumptions": ["..."],
  "exclusions": ["..."]
}`;
}
