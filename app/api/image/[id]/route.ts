import { NextRequest, NextResponse } from "next/server";

// In-memory store for generated images (replace with Supabase later)
// This is shared with the generate route via a module-level Map
import { imageStore } from "@/lib/image-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const base64 = imageStore.get(id);

  if (!base64) {
    return NextResponse.json({ error: "Image not found or expired" }, { status: 404 });
  }

  const buffer = Buffer.from(base64, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
