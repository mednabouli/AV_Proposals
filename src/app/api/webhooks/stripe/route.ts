import { createAdminClient } from "@/lib/supabase/server";
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

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

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

/**
 * POST /api/webhooks/stripe
 * Stripe webhook handler for subscription events.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    const supabase = createAdminClient();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (!session.customer || !session.metadata?.profile_id) {
          break;
        }

        const customerId = session.customer as string;
        const profileId = session.metadata.profile_id;

        // Get or create subscription record
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: existingSub } = await (supabase as any)
          .from("user_subscriptions")
          .select("id")
          .eq("profile_id", profileId)
          .single();

        // Get Pro plan ID
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: proPlan } = await (supabase as any)
          .from("billing_plans")
          .select("id")
          .eq("name", "Pro")
          .single();

        if (!proPlan) {
          console.error("Pro plan not found");
          break;
        }

        if (existingSub) {
          // Update existing subscription
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any)
            .from("user_subscriptions")
            .update({
              stripe_customer_id: customerId,
              stripe_subscription_id: session.subscription,
              plan_id: (proPlan as Record<string, string>).id,
              status: "active",
            })
            .eq("profile_id", profileId);
        } else {
          // Create new subscription
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any)
            .from("user_subscriptions")
            .insert({
              profile_id: profileId,
              stripe_customer_id: customerId,
              stripe_subscription_id: session.subscription,
              plan_id: (proPlan as Record<string, string>).id,
              status: "active",
            });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        if (!subscription.id) {
          break;
        }

        const status = subscription.status === "active" ? "active" : subscription.status;

        // Update subscription in DB
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from("user_subscriptions")
          .update({
            status,
          })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        if (!subscription.id) {
          break;
        }

        // Mark subscription as canceled
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from("user_subscriptions")
          .update({
            status: "canceled",
          })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
