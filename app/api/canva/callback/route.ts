import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForTokens } from "@/lib/canva-auth";

// GET /api/canva/callback — Handles Canva OAuth callback
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/create?canva_error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/create?canva_error=missing_params", request.url)
    );
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get("canva_oauth_state")?.value;
  const codeVerifier = cookieStore.get("canva_code_verifier")?.value;

  // Verify state to prevent CSRF
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(
      new URL("/create?canva_error=invalid_state", request.url)
    );
  }

  if (!codeVerifier) {
    return NextResponse.redirect(
      new URL("/create?canva_error=missing_verifier", request.url)
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code, codeVerifier);

    // Store tokens in httpOnly cookies
    cookieStore.set("canva_access_token", tokens.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: tokens.expires_in,
      path: "/",
    });
    cookieStore.set("canva_refresh_token", tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Clean up PKCE cookies
    cookieStore.delete("canva_code_verifier");
    cookieStore.delete("canva_oauth_state");

    // Redirect back to create page with success
    return NextResponse.redirect(
      new URL("/create?canva_connected=true", request.url)
    );
  } catch (err) {
    console.error("Canva token exchange failed:", err);
    return NextResponse.redirect(
      new URL("/create?canva_error=token_exchange_failed", request.url)
    );
  }
}
