"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";
import { sendWelcomeEmail } from "@/lib/email/resend";
import { trackUserSignUp } from "@/lib/analytics/posthog";

/**
 * Ensure a Supabase profile exists for the current Clerk user.
 * Called on first visit to /app after sign-in.
 * Uses the admin client (service role) to bypass RLS for insert.
 */
export async function ensureProfile(): Promise<Profile | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createAdminClient();

  // Check if profile already exists
  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  if (existing) return existing;

  // Get Clerk user details for initial profile data
  const user = await currentUser();
  if (!user) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: newProfile, error } = await (supabase as any)
    .from("profiles")
    .insert({
      clerk_user_id: userId,
      name: [user.firstName, user.lastName].filter(Boolean).join(" ") || null,
      default_language: "fr",
      currency: "CAD",
      timezone: "America/Montreal",
      role: "freelance",
      is_onboarded: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to create profile:", error.message);
    return null;
  }

  // Assign Free plan by default
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: freePlan } = await (supabase as any)
    .from("billing_plans")
    .select("id")
    .eq("name", "Free")
    .single();

  if (freePlan && newProfile) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("user_subscriptions").insert({
      profile_id: (newProfile as Record<string, string>).id,
      plan_id: (freePlan as Record<string, string>).id,
      status: "active",
    });

    // Send welcome email
    if (user.emailAddresses?.[0]?.emailAddress) {
      try {
        await sendWelcomeEmail(
          user.emailAddresses[0].emailAddress,
          (newProfile as Record<string, string>).name || "User"
        );
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }
    }

    // Track user signup
    try {
      await trackUserSignUp(
        userId,
        user.emailAddresses?.[0]?.emailAddress || userId
      );
    } catch (error) {
      console.error("Failed to track user signup:", error);
    }
  }

  return newProfile;
}
