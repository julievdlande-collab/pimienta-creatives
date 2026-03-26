import { NextRequest, NextResponse } from "next/server";
import { getMollieClient } from "@/lib/mollie";
import { addCredits } from "@/lib/credits";

// Mollie webhook — called when payment status changes
// IMPORTANT: Always return 200, even on errors (prevents retry spam)
export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    const paymentId = body.get("id") as string;

    if (!paymentId) {
      return NextResponse.json({ ok: true });
    }

    // Always verify by fetching from Mollie (don't trust webhook body)
    const payment = await getMollieClient().payments.get(paymentId);

    if (payment.status === "paid") {
      const metadata = payment.metadata as {
        userId: string;
        packId: string;
        credits: number;
      };

      if (metadata?.userId && metadata?.credits) {
        await addCredits(
          metadata.userId,
          metadata.credits,
          "purchase",
          { molliePaymentId: paymentId }
        );
        console.log(
          `Payment ${paymentId}: added ${metadata.credits} credits to user ${metadata.userId}`
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Mollie webhook error:", error);
    // Still return 200 to prevent retry loops
    return NextResponse.json({ ok: true });
  }
}
