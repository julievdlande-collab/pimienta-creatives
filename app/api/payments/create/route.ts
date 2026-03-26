import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getMollieClient, CREDIT_PACKS, type PackId } from "@/lib/mollie";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://pimienta-creatives.vercel.app";

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const accessToken = request.cookies.get("sb-access-token")?.value;
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const packId = body.packId as PackId;

    if (!packId || !CREDIT_PACKS[packId]) {
      return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
    }

    const pack = CREDIT_PACKS[packId];

    // Create Mollie payment
    const payment = await getMollieClient().payments.create({
      amount: {
        value: pack.price,
        currency: pack.currency,
      },
      description: pack.description,
      redirectUrl: `${APP_URL}/order/success?pack=${packId}`,
      webhookUrl: `${APP_URL}/api/webhooks/mollie`,
      metadata: {
        userId: user.id,
        packId,
        credits: pack.credits,
      },
    });

    const checkoutUrl = payment.getCheckoutUrl();

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
