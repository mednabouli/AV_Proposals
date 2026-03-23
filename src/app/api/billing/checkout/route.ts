import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";
import { NextResponse } from "next/server";

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeInstance = new Stripe(apiKey);
  }
  return stripeInstance;
}

/**
 * POST /api/billing/checkout
 * Create a Stripe checkout session for upgrading to Pro plan.
 */
export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get Supabase client
    const supabase = await createClient();

    // Get user profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error: profileError } = await (supabase as any)
      .from("profiles")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const profileId = (profile as Record<string, string>).id;

    // Get or create Stripe customer
    let customerId: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: subscription } = await (supabase as any)
      .from("user_subscriptions")
      .select("stripe_customer_id")
      .eq("profile_id", profileId)
      .single();

    if (subscription && (subscription as Record<string, string>).stripe_customer_id) {
      customerId = (subscription as Record<string, string>).stripe_customer_id;
    } else {
      // Create new customer
      const stripe = getStripe();
      const customer = await stripe.customers.create({
        email: userId + "@clerk.avproposal.ai", // Placeholder
        metadata: {
          clerk_user_id: userId,
          profile_id: profileId,
        },
      });
      customerId = customer.id;
    }

    // Get Pro plan price ID from env
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO;
    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price not configured" },
        { status: 500 }
      );
    }

    // Create checkout session
    const stripeForSession = getStripe();
    const session = await stripeForSession.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/app/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/app/billing`,
      metadata: {
        profile_id: profileId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
