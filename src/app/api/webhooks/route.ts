import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("Missing Stripe signature");
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET ?? ""
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    try {
      switch (event.type) {
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;

          // Update subscription status in database
          const { error: dbError } = await supabase
            .from("profiles")
            .update({
              membership_status: subscription.status,
              subscription_end_date: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            })
            .eq("stripe_customer_id", customerId);

          if (dbError) {
            console.error("Database error:", dbError);
            throw new Error(`Database error: ${dbError.message}`);
          }

          return NextResponse.json({ success: true });
        }

        default:
          // Just acknowledge other events
          return NextResponse.json({ received: true });
      }
    } catch (error) {
      console.error("Webhook Error:", error);
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Webhook processing failed",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}

// Prevent other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
