// src/config/stripe.ts
export const STRIPE_PRODUCTS = {
  trucker: {
    starter: {
      name: "Trucker Starter",
      priceId: "price_1Qnva4DnagR2A4PMl1BKuF3L", // Free tier
    },
    professional: {
      name: "Trucker Professional",
      priceId: "price_1QnvcMDnagR2A4PMAEnk1qCf", // $149/month
    },
    enterprise: {
      name: "Trucker Enterprise",
      priceId: "price_1QnvcfDnagR2A4PMvFyMZcgB", // $299/month
    },
  },
  broker: {
    starter: {
      name: "Broker Starter",
      priceId: "price_1Qnve9DnagR2A4PMkt0JtNo8", // Free tier
    },
    professional: {
      name: "Broker Professional",
      priceId: "price_1QnvegDnagR2A4PMhWCD7Mi7", // $299/month
    },
    enterprise: {
      name: "Broker Enterprise",
      priceId: "price_1QnvfFDnagR2A4PMDm4kpEz2", // $599/month
    },
  },
} as const;
