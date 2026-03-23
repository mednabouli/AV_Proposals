import { PostHog } from "posthog-node";

let posthog: PostHog | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPostHog(): any {
  if (!posthog) {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_API_KEY;

    if (!apiKey) {
      console.warn("PostHog API key not configured");
      // Return a no-op client
      return {
        capture: async () => {},
        identify: async () => {},
        flush: async () => {},
      };
    }

    posthog = new PostHog(apiKey);
  }

  return posthog;
}

export async function trackUserSignUp(userId: string, email: string) {
  try {
    const ph = getPostHog();
    await ph.capture({
      distinctId: userId,
      event: "user_signed_up",
      properties: {
        email,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error tracking user signup:", error);
  }
}

export async function trackFirstProposalGenerated(
  userId: string,
  proposalId: string,
  projectType: string
) {
  try {
    const ph = getPostHog();
    await ph.capture({
      distinctId: userId,
      event: "first_proposal_generated",
      properties: {
        proposal_id: proposalId,
        project_type: projectType,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error tracking first proposal generation:", error);
  }
}

export async function trackPlanUpgraded(userId: string, plan: string) {
  try {
    const ph = getPostHog();
    await ph.capture({
      distinctId: userId,
      event: "plan_upgraded",
      properties: {
        plan,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error tracking plan upgrade:", error);
  }
}

export async function trackProposalGenerated(userId: string, projectType: string) {
  try {
    const ph = getPostHog();
    await ph.capture({
      distinctId: userId,
      event: "proposal_generated",
      properties: {
        project_type: projectType,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error tracking proposal generation:", error);
  }
}
