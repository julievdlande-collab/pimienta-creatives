import createMollieClient from "@mollie/api-client";

export function getMollieClient() {
  return createMollieClient({
    apiKey: process.env.MOLLIE_API_KEY!,
  });
}

export const CREDIT_PACKS = {
  creator: {
    name: "Creator",
    credits: 25,
    price: "19.00",
    currency: "EUR",
    description: "Pimienta Creatives — 25 credits",
  },
  growth: {
    name: "Growth",
    credits: 100,
    price: "49.00",
    currency: "EUR",
    description: "Pimienta Creatives — 100 credits",
  },
} as const;

export type PackId = keyof typeof CREDIT_PACKS;
