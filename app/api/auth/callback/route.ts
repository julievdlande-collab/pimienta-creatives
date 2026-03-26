import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ensureCreditsRow } from "@/lib/credits";

// Handles Supabase Auth callback (magic link + OAuth)
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/create";

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Ensure user has a credits row (5 free on first login)
      await ensureCreditsRow(data.user.id);

      // Set auth cookies
      const response = NextResponse.redirect(`${origin}${next}`);
      response.cookies.set("sb-access-token", data.session.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: data.session.expires_in,
        path: "/",
      });
      response.cookies.set("sb-refresh-token", data.session.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      return response;
    }
  }

  // Auth failed — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
