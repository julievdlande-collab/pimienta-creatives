import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { generatePKCE, getAuthorizationURL } from "@/lib/canva-auth";

// GET /api/canva/auth — Initiates Canva OAuth flow
export async function GET() {
  const { verifier, challenge } = generatePKCE();
  const state = randomBytes(16).toString("hex");

  const cookieStore = await cookies();

  // Store verifier + state in httpOnly cookies (needed for callback)
  cookieStore.set("canva_code_verifier", verifier, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });
  cookieStore.set("canva_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  const authURL = getAuthorizationURL(challenge, state);
  return NextResponse.redirect(authURL);
}
