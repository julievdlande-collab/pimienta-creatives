export default function LogoBar() {
  const platforms = [
    "Meta Ads",
    "TikTok Ads",
    "Instagram",
    "Shopify",
    "Amazon",
    "Pinterest",
  ];

  return (
    <section className="py-12 border-y border-card-border bg-section-alt">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-sm font-medium text-muted mb-8">
          Generate creatives optimized for
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {platforms.map((name) => (
            <span
              key={name}
              className="text-base font-semibold text-foreground/30 hover:text-foreground/60 transition-colors"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
