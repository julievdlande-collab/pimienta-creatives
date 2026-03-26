import { randomBytes, createHash } from "crypto";

// Canva OAuth 2.0 with PKCE
// Docs: https://www.canva.dev/docs/connect/authentication/

const CANVA_CLIENT_ID = process.env.CANVA_CLIENT_ID!;
const CANVA_CLIENT_SECRET = process.env.CANVA_CLIENT_SECRET!;
const CANVA_REDIRECT_URI = process.env.CANVA_REDIRECT_URI || "https://pimienta-creatives.vercel.app/api/canva/callback";

const CANVA_AUTH_URL = "https://www.canva.com/api/oauth/authorize";
const CANVA_TOKEN_URL = "https://www.canva.com/api/oauth/token";

const SCOPES = [
  "design:meta:read",
  "design:content:read",
  "design:content:write",
  "asset:read",
  "asset:write",
];

// Generate PKCE code verifier + challenge
export function generatePKCE() {
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

// Build the authorization URL
export function getAuthorizationURL(codeChallenge: string, state: string) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: CANVA_CLIENT_ID,
    redirect_uri: CANVA_REDIRECT_URI,
    scope: SCOPES.join(" "),
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    state,
  });

  return `${CANVA_AUTH_URL}?${params.toString()}`;
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(code: string, codeVerifier: string) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: CANVA_REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  const res = await fetch(CANVA_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${CANVA_CLIENT_ID}:${CANVA_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token exchange failed: ${err}`);
  }

  return res.json() as Promise<{
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  }>;
}

// Refresh an expired access token
export async function refreshAccessToken(refreshToken: string) {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const res = await fetch(CANVA_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${CANVA_CLIENT_ID}:${CANVA_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token refresh failed: ${err}`);
  }

  return res.json() as Promise<{
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  }>;
}
