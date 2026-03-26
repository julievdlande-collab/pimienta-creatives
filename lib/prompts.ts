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

const FORMAT_SPECS: Record<AdFormat, { width: number; height: number; label: string }> = {
  "1:1": { width: 1080, height: 1080, label: "square feed ad" },
  "4:5": { width: 1080, height: 1350, label: "portrait feed ad" },
  "9:16": { width: 1080, height: 1920, label: "vertical story/reel ad" },
};

// ── Base system rules (shared across ALL generations) ──

function buildBaseRules(input: GenerateInput): string {
  const fmt = FORMAT_SPECS[input.format];

  return `You are generating a high-quality paid social ad image for an ecommerce product.
The output must look like a real ad made by a performance marketer — not AI art.

PRODUCT: "${input.productName}"
${input.productBenefit ? `KEY BENEFIT: ${input.productBenefit}` : ""}
${input.productContext ? `CONTEXT: ${input.productContext}` : ""}
BRAND COLOR: ${input.brandColor}
TONE: ${input.tone}

PRODUCT IMAGE RULES:
- The uploaded product photo is the single source of truth.
- Keep the product's label, logo, colors, packaging, and shape exactly as provided.
- The product must be clearly visible and prominent in the composition.
- Build the scene around the product, not the other way around.

OUTPUT RULES:
- Generate the image WITHOUT any text overlays, headlines, CTAs, or typography.
- Generate the image WITHOUT any logo or brand mark.
- The image should be a clean visual scene with product placement only.
- Text and logos will be added programmatically afterward.
- Leave clear visual space where text could be placed (top or bottom third).

FORMAT: ${fmt.label} (${fmt.width}x${fmt.height})
- Optimize composition specifically for ${input.format} ratio.
- Adapt layout and visual hierarchy for this format — do not simply crop.

QUALITY:
- Photorealistic lighting and shadows.
- High resolution, sharp details.
- Platform-native feel (Meta / TikTok / Instagram).`;
}

// ── Style modules ──────────────────────────────────

function buildStyleModule(input: GenerateInput): string {
  switch (input.style) {
    case "ugc":
      return `STYLE: UGC (User Generated Content)
- Natural, real-life lighting. No studio lighting.
- Casual, authentic composition — lifestyle feel.
- Product shown in a realistic, relatable environment.
${input.ugcSetting ? `- Setting: ${input.ugcSetting}` : "- Setting: everyday home interior, kitchen, desk, or outdoor terrace."}
${input.ugcGender ? `- If a person is shown: ${input.ugcGender}, ${input.ugcAge || "25-35"}` : ""}
- Must look like a real person took the photo, not a designer.
- Warm, slightly imperfect lighting. Slight depth of field.
- Think: Instagram story or TikTok still frame.`;

    case "clean":
      return `STYLE: Clean E-Commerce
- Premium, minimal, polished look.
- Plenty of breathing room — do not clutter.
- High-end DTC brand aesthetic.
${input.cleanBackground ? `- Background: ${input.cleanBackground}` : "- Background: soft gradient or solid neutral tone."}
${input.cleanProductSize ? `- Product prominence: ${input.cleanProductSize}` : "- Product takes up 40-60% of the frame."}
- Studio-quality lighting with soft shadows.
- No lifestyle elements, no people, no messy compositions.
- Think: Apple product page or Glossier ad.`;

    case "influencer":
      return `STYLE: Influencer / Creator
- Feature an AI-generated person holding and presenting the product.
- The person should have a creator/influencer vibe — confident, relatable.
${input.influencerModelType ? `- Model type: ${input.influencerModelType}` : "- Model: approachable, everyday person."}
${input.influencerAge ? `- Age range: ${input.influencerAge}` : "- Age range: 25-35."}
${input.influencerSetting ? `- Setting: ${input.influencerSetting}` : "- Setting: modern home interior or urban outdoor."}
- Eye-level or slightly elevated camera angle.
- Natural lighting, not studio-lit.
- Person holds the product toward camera intentionally.
- Social-native feel — like an Instagram post, not stock photography.
- Clothing should be casual/smart-casual, realistic.
- Posture should feel natural: "showing what I use", not "posing for a shoot".`;
  }
}

// ── Creative angles (what makes each variant different) ──

function buildAngleInstruction(angle: CreativeAngle, input: GenerateInput): string {
  switch (angle) {
    case "benefit":
      return `CREATIVE ANGLE: Benefit-First
- The visual should immediately communicate the product's key benefit.
- ${input.productBenefit ? `Emphasize: "${input.productBenefit}"` : "Show the product in its most compelling use-case scenario."}
- The scene should answer: "What does this product do for me?"
- Create an aspirational but realistic context around the product.`;

    case "social-proof":
      return `CREATIVE ANGLE: Social Proof / Popularity
- The visual should convey that this product is popular and trusted.
- Show the product in a context that implies wide adoption.
- Create a "everyone is using this" feeling through the scene composition.
- Multiple products, a lived-in setting, or a "just unboxed" moment work well.`;

    case "urgency":
      return `CREATIVE ANGLE: Offer / Attention-Grabbing
- The visual should be bold and scroll-stopping.
- Use high-contrast, vibrant composition.
- The product should be the absolute hero — larger, more prominent.
- Create visual tension or excitement through color, angle, or staging.
- Leave prominent space for an offer/discount text overlay.`;
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
