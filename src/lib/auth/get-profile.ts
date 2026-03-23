"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export async function getProfileWithOnboarding() {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  return profile;
}
