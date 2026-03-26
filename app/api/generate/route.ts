import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { randomUUID } from "crypto";
import { buildPrompts, FORMAT_SPECS, type GenerateInput, type AdFormat } from "@/lib/prompts";
import { imageStore } from "@/lib/image-store";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Aspect ratio mapping for Gemini API
const ASPECT_RATIOS: Record<AdFormat, string> = {
  "1:1": "1:1",
  "4:5": "4:5",
  "9:16": "9:16",
};

async function generateSingleImage(
  ai: GoogleGenAI,
  prompt: string,
  productImageBase64: string | null,
  format: AdFormat
): Promise<string | null> {
  const contents: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

  // Add product image if provided
  if (productImageBase64) {
    contents.push({
      inlineData: {
        mimeType: "image/png",
        data: productImageBase64,
      },
    });
  }

  contents.push({ text: prompt });

  const maxRetries = 2;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents,
        config: {
          responseModalities: ["TEXT", "IMAGE"],
          imageConfig: {
            aspectRatio: ASPECT_RATIOS[format],
          },
        },
      });

      // Extract image from response
      const parts = response.candidates?.[0]?.content?.parts;
      if (!parts) return null;

      for (const part of parts) {
        if ("inlineData" in part && part.inlineData?.data) {
          return part.inlineData.data; // base64 image
        }
      }

      return null;
    } catch (error: unknown) {
      const isLastAttempt = attempt === maxRetries;
      if (isLastAttempt) {
        console.error(`Generation failed after ${maxRetries + 1} attempts:`, error);
        return null;
      }
      // Exponential backoff
      const delay = (attempt + 1) * 500 + Math.random() * 200;
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      productName,
      productBenefit,
      productContext,
      brandColor = "#7c3aed",
      tone = "Confident and direct",
      style = "clean",
      format = "1:1",
      language = "en",
      productImageBase64,
      // Style-specific options
      ugcGender,
      ugcAge,
      ugcSetting,
      cleanBackground,
      cleanProductSize,
      influencerModelType,
      influencerAge,
      influencerSetting,
    } = body;

    if (!productName) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    const input: GenerateInput = {
      productName,
      productBenefit,
      productContext,
      brandColor,
      tone,
      style,
      format,
      language,
      ugcGender,
      ugcAge,
      ugcSetting,
      cleanBackground,
      cleanProductSize,
      influencerModelType,
      influencerAge,
      influencerSetting,
    };

    // Build 3 prompts (one per creative angle)
    const prompts = buildPrompts(input);

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // Generate 3 variants in parallel
    const results = await Promise.allSettled(
      prompts.map((prompt) =>
        generateSingleImage(ai, prompt, productImageBase64 || null, format)
      )
    );

    const images: (string | null)[] = results.map((r) =>
      r.status === "fulfilled" ? r.value : null
    );

    const successCount = images.filter(Boolean).length;

    if (successCount === 0) {
      return NextResponse.json(
        { error: "All generation attempts failed. Please try again." },
        { status: 500 }
      );
    }

    // Store images and generate public URLs
    const origin = request.nextUrl.origin;
    const imageEntries = images.map((img) => {
      if (!img) return null;
      const id = randomUUID();
      imageStore.set(id, img);
      return { id, url: `${origin}/api/image/${id}` };
    });

    return NextResponse.json({
      images, // base64 strings (for inline preview)
      imageUrls: imageEntries, // public URLs (for Canva import, sharing)
      format,
      style,
      angles: ["benefit", "social-proof", "urgency"],
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Generation failed. Please try again." },
      { status: 500 }
    );
  }
}
