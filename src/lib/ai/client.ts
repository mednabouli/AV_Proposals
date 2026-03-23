import Anthropic from "@anthropic-ai/sdk";

/**
 * Anthropic Claude API client for proposal generation.
 * Uses API key from ANTHROPIC_API_KEY env var.
 */
export function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not set");
  }

  return new Anthropic({
    apiKey,
  });
}

export type AnthropicClient = ReturnType<typeof getAnthropicClient>;
