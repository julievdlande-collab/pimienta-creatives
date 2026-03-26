"use client";

import { useState, useCallback, useEffect } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

type CreativeStyle = "ugc" | "clean" | "influencer";
type AdFormat = "1:1" | "4:5" | "9:16";

const STYLES: { value: CreativeStyle; label: string; description: string }[] = [
  { value: "ugc", label: "UGC", description: "Authentic, social-native feel" },
  { value: "clean", label: "Clean E-commerce", description: "Premium, minimal, polished" },
  { value: "influencer", label: "Influencer", description: "Person holding your product" },
];

const FORMATS: { value: AdFormat; label: string; ratio: string }[] = [
  { value: "1:1", label: "Square", ratio: "1:1" },
  { value: "4:5", label: "Portrait", ratio: "4:5" },
  { value: "9:16", label: "Story / Reel", ratio: "9:16" },
];

const ASPECT_CLASSES: Record<AdFormat, string> = {
  "1:1": "aspect-square",
  "4:5": "aspect-[4/5]",
  "9:16": "aspect-[9/16]",
};

export default function CreatePage() {
  // Form state
  const [productName, setProductName] = useState("");
  const [productBenefit, setProductBenefit] = useState("");
  const [brandColor, setBrandColor] = useState("#AE1B1F");
  const [tone, setTone] = useState("Confident and direct");
  const [style, setStyle] = useState<CreativeStyle>("clean");
  const [format, setFormat] = useState<AdFormat>("1:1");
  const [productImage, setProductImage] = useState<string | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);

  // Style-specific options
  const [ugcSetting, setUgcSetting] = useState("");
  const [cleanBackground, setCleanBackground] = useState("");
  const [influencerSetting, setInfluencerSetting] = useState("");

  // Generation state
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [results, setResults] = useState<(string | null)[]>([]);
  const [imageUrls, setImageUrls] = useState<({ id: string; url: string } | null)[]>([]);
  const [error, setError] = useState("");
  const [canvaLoading, setCanvaLoading] = useState<number | null>(null);

  // Check URL params for Canva connection status
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("canva_connected") === "true") {
      window.history.replaceState({}, "", "/create");
    }
    const canvaError = params.get("canva_error");
    if (canvaError) {
      setError(`Canva connection failed: ${canvaError}`);
      window.history.replaceState({}, "", "/create");
    }
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image too large. Maximum 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setProductImagePreview(dataUrl);
      const base64 = dataUrl.split(",")[1];
      setProductImage(base64);
    };
    reader.onerror = () => setError("Failed to read image. Try again.");
    reader.readAsDataURL(file);
  }, []);

  const handleGenerate = async () => {
    if (!productName.trim()) {
      setError("Please enter a product name.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    setImageUrls([]);
    setProgress("Generating 3 ad variants...");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          productBenefit,
          brandColor,
          tone,
          style,
          format,
          productImageBase64: productImage,
          // Style-specific options
          ...(style === "ugc" && ugcSetting ? { ugcSetting } : {}),
          ...(style === "clean" && cleanBackground ? { cleanBackground } : {}),
          ...(style === "influencer" && influencerSetting ? { influencerSetting } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Generation failed.");
        return;
      }

      setResults(data.images || []);
      setImageUrls(data.imageUrls || []);
      setProgress("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (base64: string, index: number) => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${base64}`;
    link.download = `${productName.replace(/\s+/g, "-").toLowerCase()}-variant-${index + 1}.png`;
    link.click();
  };

  const handleEditInCanva = async (index: number) => {
    const entry = imageUrls[index];
    if (!entry) return;

    setCanvaLoading(index);
    try {
      const res = await fetch("/api/canva/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: entry.url,
          title: `${productName} - ${["Benefit", "Social Proof", "Urgency"][index]}`,
        }),
      });

      const data = await res.json();

      if (data.method === "connect") {
        window.location.href = data.authUrl;
        return;
      }

      if (data.editUrl) {
        window.open(data.editUrl, "_blank");
      }
    } catch {
      window.open(`https://www.canva.com/design/new`, "_blank");
    } finally {
      setCanvaLoading(null);
    }
  };

  return (
    <>
      <Nav />
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Create ad creatives
          </h1>
          <p className="text-muted mb-10">
            Upload your product, configure your brand, and generate 3 unique ad variants.
          </p>

          <div className="grid lg:grid-cols-[1fr,1fr] gap-10">
            {/* ── Left: Form ── */}
            <div className="space-y-6">
              {/* Product image */}
              <div>
                <label className="block text-sm font-semibold mb-2">Product image</label>
                <label className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-card-border bg-section-alt hover:border-accent/50 transition-colors cursor-pointer">
                  {productImagePreview ? (
                    <img
                      src={productImagePreview}
                      alt="Product"
                      className="h-full object-contain rounded-lg p-2"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-3xl mb-2">📸</div>
                      <p className="text-sm text-muted">Click to upload product photo</p>
                      <p className="text-xs text-muted/60 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {/* Product name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Product name <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Hydra Glow Serum"
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
              </div>

              {/* Product benefit */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Key benefit <span className="text-muted text-xs font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={productBenefit}
                  onChange={(e) => setProductBenefit(e.target.value)}
                  placeholder="e.g. 24h hydration with vitamin C"
                  maxLength={200}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
              </div>

              {/* Brand color + Tone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Brand color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-card-border cursor-pointer"
                    />
                    <span className="text-sm text-muted font-mono">{brandColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-card-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  >
                    <option>Confident and direct</option>
                    <option>Friendly and warm</option>
                    <option>Bold and edgy</option>
                    <option>Minimal and calm</option>
                    <option>Playful and fun</option>
                  </select>
                </div>
              </div>

              {/* Creative style */}
              <div>
                <label className="block text-sm font-semibold mb-2">Creative style</label>
                <div className="grid grid-cols-3 gap-3">
                  {STYLES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStyle(s.value)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        style === s.value
                          ? "border-accent bg-accent-light ring-1 ring-accent"
                          : "border-card-border bg-white hover:border-accent/30"
                      }`}
                    >
                      <p className="text-sm font-semibold">{s.label}</p>
                      <p className="text-xs text-muted mt-0.5">{s.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Style-specific options */}
              {style === "ugc" && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Setting <span className="text-muted text-xs font-normal">(optional)</span>
                  </label>
                  <select
                    value={ugcSetting}
                    onChange={(e) => setUgcSetting(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-card-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  >
                    <option value="">Auto (kitchen, desk, outdoor)</option>
                    <option value="kitchen counter with morning light">Kitchen</option>
                    <option value="desk with laptop and coffee">Desk / Office</option>
                    <option value="bathroom shelf with mirror">Bathroom</option>
                    <option value="outdoor cafe table in sunlight">Outdoor / Cafe</option>
                    <option value="cozy couch with blanket">Living room</option>
                  </select>
                </div>
              )}

              {style === "clean" && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Background <span className="text-muted text-xs font-normal">(optional)</span>
                  </label>
                  <select
                    value={cleanBackground}
                    onChange={(e) => setCleanBackground(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-card-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  >
                    <option value="">Auto (soft gradient or neutral)</option>
                    <option value="pure white seamless background">White</option>
                    <option value="light gray gradient">Light gray</option>
                    <option value="warm beige gradient">Warm beige</option>
                    <option value="soft pastel gradient matching brand color">Brand color gradient</option>
                    <option value="dark charcoal gradient">Dark / Charcoal</option>
                  </select>
                </div>
              )}

              {style === "influencer" && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Setting <span className="text-muted text-xs font-normal">(optional)</span>
                  </label>
                  <select
                    value={influencerSetting}
                    onChange={(e) => setInfluencerSetting(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-card-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  >
                    <option value="">Auto (apartment or urban outdoor)</option>
                    <option value="modern bright apartment living room">Modern apartment</option>
                    <option value="trendy cafe interior">Cafe</option>
                    <option value="urban street with soft background blur">Urban street</option>
                    <option value="gym or fitness studio">Gym / Fitness</option>
                    <option value="outdoor park with natural light">Park / Nature</option>
                  </select>
                </div>
              )}

              {/* Ad format */}
              <div>
                <label className="block text-sm font-semibold mb-2">Ad format</label>
                <div className="flex gap-3">
                  {FORMATS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFormat(f.value)}
                      className={`flex-1 p-3 rounded-xl border text-center transition-all ${
                        format === f.value
                          ? "border-accent bg-accent-light ring-1 ring-accent"
                          : "border-card-border bg-white hover:border-accent/30"
                      }`}
                    >
                      <p className="text-sm font-semibold">{f.ratio}</p>
                      <p className="text-xs text-muted">{f.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-4 px-6 rounded-xl text-base font-semibold text-white bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-accent/25"
              >
                {loading ? "Generating..." : "Generate 3 variants"}
              </button>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
              )}
            </div>

            {/* ── Right: Results ── */}
            <div>
              <h2 className="text-sm font-semibold mb-4 text-muted uppercase tracking-wider">
                Generated variants
              </h2>

              {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-10 h-10 border-3 border-accent/30 border-t-accent rounded-full animate-spin mb-4" />
                  <p className="text-sm text-muted">{progress}</p>
                  <p className="text-xs text-muted/60 mt-1">This takes ~15-30 seconds</p>
                </div>
              )}

              {!loading && results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-card-border bg-section-alt">
                  <div className="text-4xl mb-3">✨</div>
                  <p className="text-sm text-muted">Your 3 ad variants will appear here</p>
                </div>
              )}

              {results.length > 0 && (
                <div className="space-y-4">
                  {results.map((img, i) =>
                    img ? (
                      <div key={i} className="group relative rounded-xl border border-card-border overflow-hidden bg-white shadow-sm">
                        <div className={`${ASPECT_CLASSES[format]} w-full`}>
                          <img
                            src={`data:image/png;base64,${img}`}
                            alt={`Variant ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-xs font-semibold shadow-sm">
                            {["Benefit", "Social Proof", "Scroll-Stopper"][i]}
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditInCanva(i)}
                            disabled={canvaLoading === i}
                            className="px-4 py-2 rounded-lg bg-accent/90 backdrop-blur-sm text-xs font-semibold text-white shadow-sm hover:bg-accent transition-colors disabled:opacity-50"
                          >
                            {canvaLoading === i ? "Opening..." : "Edit in Canva"}
                          </button>
                          <button
                            onClick={() => handleDownload(img, i)}
                            className="px-4 py-2 rounded-lg bg-white/90 backdrop-blur-sm text-xs font-semibold shadow-sm hover:bg-white transition-colors"
                          >
                            Download PNG
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={i}
                        className="flex items-center justify-center py-12 rounded-xl border border-card-border bg-section-alt"
                      >
                        <p className="text-sm text-muted">Variant {i + 1} failed — try again</p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
