import { NextResponse } from "next/server";
import Stripe from "stripe";
import { STRIPE_PRODUCTS } from "@/config/stripe";
import { headers } from "next/headers";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-01-27.acacia",
});

// Helper to get the base URL
function getBaseUrl() {
  // First try environment variables
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Fallback to request origin
  const protocol = "http"; // Default to http for local development
  const host = "localhost:3000"; // Default for local development
  return `${protocol}://${host}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role, tier, password, username, full_name, phone } = body;

    console.log("Checkout request:", { email, role, tier }); // Debug log

    // Validate required fields
    if (!email || !role || !tier || !password || !username || !full_name) {
      console.log("Missing required fields:", { email, role, tier }); // Debug log
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a customer in Stripe
    console.log("Creating Stripe customer..."); // Debug log
    const customer = await stripe.customers.create({
      email,
      metadata: {
        role,
        tier,
        username,
        full_name,
        phone: phone || "",
        password, // Note: This is temporary and will be hashed during actual signup
      },
    });
    console.log("Stripe customer created:", customer.id); // Debug log

    // Define product prices from STRIPE_PRODUCTS config
    const priceIdMap: Record<string, string> = {
      starter: STRIPE_PRODUCTS.trucker.starter.priceId,
      professional: STRIPE_PRODUCTS.trucker.professional.priceId,
      enterprise: STRIPE_PRODUCTS.trucker.enterprise.priceId,
    };

    // Validate tier
    if (!priceIdMap[tier]) {
      console.log("Invalid tier selected:", tier); // Debug log
      return NextResponse.json(
        { error: "Invalid subscription tier selected" },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl();
    console.log("Using base URL:", baseUrl);

    console.log("Creating checkout session...");
    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceIdMap[tier],
          quantity: 1,
        },
      ],
      metadata: {
        role,
        tier,
        customer_id: customer.id,
      },
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment/canceled`,
      automatic_tax: { enabled: false },
      customer_update: {
        address: "auto",
        name: "auto",
      },
      billing_address_collection: "required",
      payment_method_collection: "if_required",
    });

    console.log("Checkout session created:", session.id); // Debug log
    return NextResponse.json({ sessionUrl: session.url });
  } catch (error) {
    // Detailed error logging
    console.error("Stripe Checkout Error:", {
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
              name: error.name,
            }
          : error,
    });

    // Check for specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create checkout session" },
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
