"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { user_type, services, language, daily_rate } = body;

    const supabase = await createClient();

    // Update profile with onboarding data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("profiles")
      .update({
        role: user_type,
        services: services,
        default_language: language,
        daily_rate: daily_rate,
        is_onboarded: true,
      })
      .eq("clerk_user_id", userId);

    if (error) {
      console.error("Onboarding update error:", error);
      return NextResponse.json(
        { error: "Failed to save onboarding data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Server error during onboarding" },
      { status: 500 }
    );
  }
}
