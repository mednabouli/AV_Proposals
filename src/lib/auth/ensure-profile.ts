"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

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

  const { data: newProfile, error } = await supabase
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
  const { data: freePlan } = await supabase
    .from("billing_plans")
    .select("id")
    .eq("name", "Free")
    .single();

  if (freePlan && newProfile) {
    await supabase.from("user_subscriptions").insert({
      profile_id: newProfile.id,
      plan_id: freePlan.id,
      status: "active",
    });
  }

  return newProfile;
}
