import { NextResponse } from "next/server";
import Stripe from "stripe";
import { STRIPE_PRODUCTS } from "@/config/stripe";

export async function GET() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Missing STRIPE_SECRET_KEY");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-01-27.acacia",
    });

    // Test Stripe connection
    const balance = await stripe.balance.retrieve();

    // Test price IDs
    const prices = await Promise.all(
      Object.values(STRIPE_PRODUCTS.trucker).map(async (product) => {
        try {
          return await stripe.prices.retrieve(product.priceId);
        } catch (error) {
          return {
            id: product.priceId,
            error: error instanceof Error ? error.message : "Invalid price ID",
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      balance,
      prices,
      config: {
        hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
        hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
        hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      },
    });
  } catch (error) {
    console.error("Stripe Test Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Stripe test failed",
      },
      { status: 500 }
    );
  }
}
