import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { refreshAccessToken } from "@/lib/canva-auth";

// Canva Connect API - Import design from image URL
const CANVA_API_BASE = "https://api.canva.com/rest/v1";

async function getCanvaToken(): Promise<string | null> {
  const cookieStore = await cookies();

  // First try cookie (user-authenticated)
  let token = cookieStore.get("canva_access_token")?.value;
  if (token) return token;

  // Try refreshing
  const refreshToken = cookieStore.get("canva_refresh_token")?.value;
  if (refreshToken) {
    try {
      const tokens = await refreshAccessToken(refreshToken);
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
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      return tokens.access_token;
    } catch {
      // Refresh failed — user needs to re-auth
    }
  }

  // Fallback: env var (for server-level token)
  return process.env.CANVA_ACCESS_TOKEN || null;
}

export async function POST(request: NextRequest) {
  const canvaToken = await getCanvaToken();

  if (!canvaToken) {
    return NextResponse.json({
      method: "connect",
      authUrl: "/api/canva/auth",
      message: "Connect your Canva account first.",
    }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { imageUrl, title = "Ad Creative" } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    // Step 1: Upload the image as an asset
    const uploadRes = await fetch(`${CANVA_API_BASE}/asset-uploads`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${canvaToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: imageUrl,
        name: title,
      }),
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      console.error("Canva upload failed:", err);

      // If token expired, prompt re-auth
      if (uploadRes.status === 401) {
        return NextResponse.json({
          method: "connect",
          authUrl: "/api/canva/auth",
          message: "Canva session expired. Please reconnect.",
        }, { status: 401 });
      }

      return NextResponse.json(
        { error: "Failed to upload to Canva", details: err },
        { status: uploadRes.status }
      );
    }

    const uploadData = await uploadRes.json();

    // Step 2: Create a design with the uploaded asset
    const designRes = await fetch(`${CANVA_API_BASE}/designs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${canvaToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        design_type: { type: "preset", name: "custom" },
        title,
        asset_id: uploadData.asset?.id,
      }),
    });

    if (designRes.ok) {
      const designData = await designRes.json();
      return NextResponse.json({
        method: "api",
        designId: designData.design?.id,
        editUrl: designData.design?.urls?.edit_url,
        viewUrl: designData.design?.urls?.view_url,
      });
    }

    // If design creation fails, still return the asset — user can use it in Canva
    return NextResponse.json({
      method: "asset",
      assetId: uploadData.asset?.id,
      editUrl: "https://www.canva.com",
      message: "Image uploaded to your Canva account. Open Canva to use it.",
    });
  } catch (error) {
    console.error("Canva import error:", error);
    return NextResponse.json(
      { error: "Canva import failed" },
      { status: 500 }
    );
  }
}
