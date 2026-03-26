import { NextRequest, NextResponse } from "next/server";

// Canva Connect API - Import design from image URL
// Docs: https://www.canva.dev/docs/connect/

const CANVA_API_BASE = "https://api.canva.com/rest/v1";

export async function POST(request: NextRequest) {
  const canvaToken = process.env.CANVA_ACCESS_TOKEN;

  if (!canvaToken) {
    // If no Canva token configured, return a Canva deep link instead
    // Users can manually import via Canva's upload
    const body = await request.json();
    const { imageUrl, title } = body;

    return NextResponse.json({
      method: "deeplink",
      editUrl: `https://www.canva.com/design/new?imageUrl=${encodeURIComponent(imageUrl)}`,
      message: "Canva API not configured. Use the link to open in Canva manually.",
    });
  }

  try {
    const body = await request.json();
    const { imageUrl, title = "Ad Creative" } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    // Step 1: Create an import job
    const importRes = await fetch(`${CANVA_API_BASE}/imports`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${canvaToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        import_type: "url",
        url: imageUrl,
        title,
      }),
    });

    if (!importRes.ok) {
      const err = await importRes.text();
      console.error("Canva import failed:", err);
      return NextResponse.json(
        { error: "Failed to import to Canva", details: err },
        { status: importRes.status }
      );
    }

    const importData = await importRes.json();

    return NextResponse.json({
      method: "api",
      designId: importData.design?.id,
      editUrl: importData.design?.urls?.edit_url,
      viewUrl: importData.design?.urls?.view_url,
    });
  } catch (error) {
    console.error("Canva import error:", error);
    return NextResponse.json(
      { error: "Canva import failed" },
      { status: 500 }
    );
  }
}
