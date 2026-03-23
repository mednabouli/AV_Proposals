import { Pinecone } from "@pinecone-database/pinecone";

/**
 * Initialize Pinecone client with API key.
 */
export function getPineconeClient() {
  const apiKey = process.env.PINECONE_API_KEY;
  const environment = process.env.PINECONE_ENVIRONMENT;

  if (!apiKey || !environment) {
    throw new Error("PINECONE_API_KEY or PINECONE_ENVIRONMENT not set");
  }

  return new Pinecone({
    apiKey,
  });
}

export const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX || "av-proposals";

/**
 * Sample proposal templates to seed into Pinecone.
 * These are dummy examples for context.
 */
export const SAMPLE_TEMPLATES = [
  {
    id: "template-promo-video",
    name: "Promotional Video",
    description: "Standard structure for promotional video projects",
    sections: [
      "Project Overview & Understanding",
      "Creative Approach & Concept",
      "Deliverables",
      "Timeline & Process",
      "Team & Expertise",
      "Pricing",
      "Terms & Conditions",
    ],
    use_cases: ["promotional video", "brand video", "marketing"],
  },
  {
    id: "template-event-coverage",
    name: "Event Coverage",
    description: "Structure for live events and coverage projects",
    sections: [
      "Event Brief",
      "Coverage Plan",
      "Technical Setup",
      "Deliverables",
      "Timeline",
      "Equipment & Crew",
      "Pricing",
      "Terms",
    ],
    use_cases: ["event coverage", "live event", "conference"],
  },
  {
    id: "template-corporate",
    name: "Corporate Video",
    description: "Professional corporate video structure",
    sections: [
      "Company Overview Understanding",
      "Video Objectives & Messaging",
      "Production Approach",
      "Deliverables & Formats",
      "Production Schedule",
      "Team & Equipment",
      "Investment",
      "Next Steps",
    ],
    use_cases: ["corporate video", "company profile", "training video"],
  },
];

/**
 * Upsert template vectors to Pinecone.
 * NOTE: In production, you'd embed these templates with an embedding model.
 * For now, this is a placeholder.
 */
export async function upsertTemplateVectors() {
  // Placeholder: In a real scenario, you would:
  // 1. Generate embeddings for each template using an embedding model
  // 2. Upsert to Pinecone with metadata
  // 3. This would be called during initialization or scheduled job

  console.log(
    "Template vector seeding would happen here with real embeddings."
  );
  // Example implementation (commented):
  // const client = getPineconeClient();
  // const index = client.index(PINECONE_INDEX_NAME);
  // const vectors = SAMPLE_TEMPLATES.map((t, i) => ({
  //   id: t.id,
  //   values: Array(1536).fill(0).map(() => Math.random()), // Placeholder
  //   metadata: { name: t.name, type: "template" }
  // }));
  // await index.upsert(vectors);
}

/**
 * Query templates for a proposal context.
 * NOTE: Placeholder for future AI-powered retrieval.
 */
export async function queryTemplatesForProposal(
  projectType: string
) {
  // For now, return templates matching project type
  return SAMPLE_TEMPLATES.filter((t) =>
    t.use_cases.some(
      (uc) => uc.toLowerCase().includes(projectType.toLowerCase())
    )
  );
}
