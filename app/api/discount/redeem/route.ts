import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServiceSupabase } from "@/lib/supabase";
import { addCredits } from "@/lib/credits";

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
    const code = (body.code as string)?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const db = createServiceSupabase();

    // Check code exists and is active
    const { data: discount } = await db
      .from("discount_codes")
      .select("*")
      .eq("code", code)
      .eq("active", true)
      .single();

    if (!discount) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 404 });
    }

    // Check max uses
    if (discount.max_uses && discount.current_uses >= discount.max_uses) {
      return NextResponse.json({ error: "Code has been fully redeemed" }, { status: 410 });
    }

    // Check if user already used this code
    const { data: existing } = await db
      .from("credit_transactions")
      .select("id")
      .eq("user_id", user.id)
      .eq("discount_code", code)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "You already used this code" }, { status: 409 });
    }

    // Grant credits
    const success = await addCredits(
      user.id,
      discount.credits_to_grant,
      "discount_code",
      { discountCode: code }
    );

    if (!success) {
      return NextResponse.json({ error: "Failed to add credits" }, { status: 500 });
    }

    // Increment usage counter
    await db
      .from("discount_codes")
      .update({ current_uses: discount.current_uses + 1 })
      .eq("code", code);

    return NextResponse.json({
      credits: discount.credits_to_grant,
      message: `${discount.credits_to_grant} credits added!`,
    });
  } catch (error) {
    console.error("Discount redeem error:", error);
    return NextResponse.json(
      { error: "Failed to redeem code" },
      { status: 500 }
    );
  }
}
