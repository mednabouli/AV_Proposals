"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export interface UserPlanData {
  name: string;
  status: string;
  monthlyGenerations: number;
  features: string[];
}

export async function getUserPlan(): Promise<UserPlanData | null> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return null;
    }

    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (!profile) {
      return null;
    }

    // Get user subscription
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: subscription } = await (supabase as any)
      .from("user_subscriptions")
      .select("plan_id, status")
      .eq("profile_id", (profile as Record<string, string>).id)
      .single();

    if (subscription) {
      // Get plan details
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: planData } = await (supabase as any)
        .from("billing_plans")
        .select("name, max_generations_per_month")
        .eq("id", (subscription as Record<string, string>).plan_id)
        .single();

      if (planData) {
        const planName = (planData as Record<string, string>).name;
        return {
          name: planName,
          status: (subscription as Record<string, string>).status,
          monthlyGenerations: (planData as Record<string, number>).max_generations_per_month,
          features:
            planName === "Pro"
              ? ["Générations illimitées", "Export PDF", "Support prioritaire"]
              : ["5 générations/mois", "Pas d'export PDF"],
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching plan:", error);
    return null;
  }
}
