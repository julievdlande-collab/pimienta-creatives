// ─────────────────────────────────────────────────
// Consolidated prompt system for ad creative generation
// Architecture: Base rules + Style module + Creative angle
// ─────────────────────────────────────────────────

export type CreativeStyle = "ugc" | "clean" | "influencer";
export type CreativeAngle = "benefit" | "social-proof" | "urgency";
export type AdFormat = "1:1" | "4:5" | "9:16";

export interface GenerateInput {
  productName: string;
  productBenefit?: string;
  productContext?: string;
  brandColor: string;
  tone: string;
  style: CreativeStyle;
  format: AdFormat;
  language: string;
  // UGC options
  ugcGender?: string;
  ugcAge?: string;
  ugcSetting?: string;
  // Clean options
  cleanBackground?: string;
  cleanProductSize?: string;
  // Influencer options
  influencerModelType?: string;
  influencerAge?: string;
  influencerSetting?: string;
}

// ── Format specs ──────────────────────────────────

const FORMAT_SPECS: Record<
  AdFormat,
  { width: number; height: number; label: string; textZone: string }
> = {
  "1:1": {
    width: 1080,
    height: 1080,
    label: "square feed ad",
    textZone:
      "Leave the top 25% and bottom 20% relatively clean and uncluttered for text overlay.",
  },
  "4:5": {
    width: 1080,
    height: 1350,
    label: "portrait feed ad",
    textZone:
      "Leave the top 20% clean for headline and bottom 15% clean for CTA overlay.",
  },
  "9:16": {
    width: 1080,
    height: 1920,
    label: "vertical story/reel ad",
    textZone:
      "Leave the top 15% and bottom 25% clean. Product sits in the center 60% of the frame.",
  },
};

// ── Base system rules (shared across ALL generations) ──

function buildBaseRules(input: GenerateInput): string {
  const fmt = FORMAT_SPECS[input.format];

  return `You are a performance marketing photographer. Generate a paid social ad photo for an ecommerce product.

PRODUCT: "${input.productName}"
${input.productBenefit ? `BENEFIT: ${input.productBenefit}` : ""}
${input.productContext ? `CONTEXT: ${input.productContext}` : ""}

PRODUCT FIDELITY (critical):
- The uploaded product photo is the absolute reference. Do not modify, redesign, or reinterpret it.
- Preserve exact: label text, logo, colors, packaging shape, proportions, materials, and finish.
- If the product has a specific cap, lid, nozzle, or closure — replicate it exactly.
- The product must be clearly recognizable as the same item from the reference photo.

BRAND COLOR: Use ${input.brandColor} as an accent in the scene — through props, background tones, or lighting color temperature. Do not paint the product itself in this color.

TONE: ${input.tone}

NO TEXT, NO LOGOS:
- Generate ONLY the photographic scene. Zero text, zero typography, zero watermarks.
- No headlines, no CTAs, no price tags, no brand marks anywhere in the image.
- Text will be composited programmatically afterward.

TEXT OVERLAY ZONES:
- ${fmt.textZone}
- These areas should have low visual complexity (soft focus, solid color, or gentle gradient) so overlaid text remains legible.

FORMAT: ${fmt.label} (${fmt.width}x${fmt.height})
- Compose specifically for ${input.format}. Do not crop a wider shot — design the composition natively for this ratio.

CAMERA & LIGHTING:
- Shot on a 35mm or 50mm lens equivalent. Shallow depth of field (f/2.8–f/4).
- Natural color grading — no heavy filters, no HDR look, no AI glow effects.
- Realistic shadows with a single dominant light source.
- No lens flare, no sparkles, no ethereal fog unless the style specifically calls for it.

ANTI-AI CHECKLIST:
- No unnaturally smooth skin or plastic-looking surfaces.
- No impossible reflections or physics-defying shadows.
- No duplicated or morphed text on product labels.
- Hands (if present) must have correct anatomy — 5 fingers, natural proportions.`;
}

// ── Style modules ──────────────────────────────────

function buildStyleModule(input: GenerateInput): string {
  switch (input.style) {
    case "ugc":
      return `STYLE: UGC (User Generated Content)
- Shot on a smartphone camera — slight grain, natural white balance.
- Casual, unposed composition. The product appears in a real moment, not arranged.
${input.ugcSetting ? `- Setting: ${input.ugcSetting}` : "- Setting: kitchen counter, desk with laptop, bathroom shelf, or outdoor cafe table."}
${input.ugcGender ? `- Person in frame: ${input.ugcGender}, age ${input.ugcAge || "25-35"}, holding or using the product naturally.` : "- No person required — product in its natural habitat."}
- Warm ambient lighting. Slight overexposure is fine.
- Depth of field from a phone camera (moderate bokeh, not cinematic).
- Reference: top-performing TikTok Shop or Instagram Story stills.`;

    case "clean":
      return `STYLE: Clean E-Commerce
- Studio product photography with controlled lighting.
- Minimal composition — product is the only subject.
${input.cleanBackground ? `- Background: ${input.cleanBackground}` : "- Background: single-color sweep or soft gradient. No patterns, no textures."}
${input.cleanProductSize ? `- Product prominence: ${input.cleanProductSize}` : "- Product fills 40-60% of the frame, centered or slightly off-center."}
- Two-point lighting setup: key light at 45° plus soft fill.
- Crisp reflections on glossy surfaces, matte diffusion on matte surfaces.
- Zero clutter. Breathing room on all sides.
- Reference: Apple product page, Aesop, or Glossier ad.`;

    case "influencer":
      return `STYLE: Influencer / Creator
- A person holding or presenting the product to camera.
${input.influencerModelType ? `- Person: ${input.influencerModelType}` : "- Person: approachable, everyday appearance. Not a supermodel."}
${input.influencerAge ? `- Age: ${input.influencerAge}` : "- Age: 25-35."}
${input.influencerSetting ? `- Setting: ${input.influencerSetting}` : "- Setting: well-lit apartment, cafe, or urban street."}
- Camera at eye level or slight low angle (empowering, not clinical).
- Person holds product near face/chest level, angled toward camera.
- Natural expression: genuine smile or focused "showing you something cool" look.
- Clothing: casual/smart-casual, solid colors that don't compete with the product.
- Hands and fingers must be anatomically correct and naturally posed.
- Reference: Instagram creator partnership post or YouTube thumbnail still.`;
  }
}

// ── Creative angles (what makes each variant different) ──

function buildAngleInstruction(
  angle: CreativeAngle,
  input: GenerateInput,
): string {
  switch (angle) {
    case "benefit":
      return `CREATIVE ANGLE: Benefit-First
- The scene visually demonstrates what the product does or how it improves life.
${input.productBenefit ? `- Show the outcome of: "${input.productBenefit}"` : "- Show the product in active use or in its ideal context."}
- Include contextual props that reinforce the benefit (e.g., fresh ingredients near a supplement, clean skin near a serum).
- Warm, inviting color palette. The viewer should think: "I want that result."
- Camera framed to show both the product and its context/environment.`;

    case "social-proof":
      return `CREATIVE ANGLE: Social Proof / Popularity
- The scene implies this product is widely used and trusted.
- Visual cues: multiple units of the product, an "unboxing" moment, product on a shared table, or a flat-lay with daily essentials.
- Lived-in, authentic setting — this product fits into an existing routine.
- Neutral-warm color palette. Grounded, trustworthy atmosphere.
- Slightly pulled-back camera angle to show environment context.`;

    case "urgency":
      return `CREATIVE ANGLE: Scroll-Stopper / High Impact
- Bold, high-contrast composition that demands attention in a feed.
- Product is the dominant visual element — 50-70% of the frame.
- Dramatic lighting: strong key light with deep shadows for dimension.
- Vibrant color accent from brand color in background or props.
- Dynamic angle: slight dutch tilt (5-10°) or dramatic low angle.
- The bottom third must be especially clean — this variant will carry a prominent offer/discount overlay.`;
  }
}

// ── Main prompt builder ──────────────────────────────────

const ANGLES: CreativeAngle[] = ["benefit", "social-proof", "urgency"];

export function buildPrompts(input: GenerateInput): string[] {
  const base = buildBaseRules(input);
  const style = buildStyleModule(input);

  return ANGLES.map((angle) => {
    const angleInstruction = buildAngleInstruction(angle, input);
    return `${base}\n\n${style}\n\n${angleInstruction}`;
  });
}

export { ANGLES, FORMAT_SPECS };
