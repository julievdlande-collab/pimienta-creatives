import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getBalance } from "@/lib/credits";

// GET /api/credits — returns current user's credit balance
export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("sb-access-token")?.value;
  if (!accessToken) {
    return NextResponse.json({ balance: 0, authenticated: false });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user } } = await supabase.auth.getUser(accessToken);

  if (!user) {
    return NextResponse.json({ balance: 0, authenticated: false });
  }

  const balance = await getBalance(user.id);
  return NextResponse.json({ balance, authenticated: true, email: user.email });
}
