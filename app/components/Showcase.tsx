const examples = [
  {
    category: "Skincare",
    before: "🧴",
    variants: [
      { style: "Lifestyle", gradient: "from-emerald-50 to-teal-100" },
      { style: "UGC", gradient: "from-amber-50 to-orange-100" },
      { style: "Minimal", gradient: "from-slate-50 to-gray-100" },
    ],
  },
  {
    category: "Coffee",
    before: "☕",
    variants: [
      { style: "Bold Sale", gradient: "from-red-50 to-rose-100" },
      { style: "Lifestyle", gradient: "from-amber-50 to-yellow-100" },
      { style: "Dark", gradient: "from-zinc-100 to-stone-200" },
    ],
  },
  {
    category: "Sneakers",
    before: "👟",
    variants: [
      { style: "Street", gradient: "from-violet-50 to-purple-100" },
      { style: "Clean", gradient: "from-sky-50 to-blue-100" },
      { style: "Bold", gradient: "from-orange-50 to-red-100" },
    ],
  },
];

export default function Showcase() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            One product photo. Three ad-ready creatives.
          </h2>
          <p className="text-muted text-lg mt-4 max-w-2xl mx-auto">
            See what our AI generates across different product categories and styles.
          </p>
        </div>

        <div className="space-y-12">
          {examples.map((example) => (
            <div
              key={example.category}
              className="rounded-2xl border border-card-border bg-white p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{example.before}</span>
                <div>
                  <p className="text-sm font-semibold">{example.category}</p>
                  <p className="text-xs text-muted">Product photo → 3 variants</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {example.variants.map((v) => (
                  <div key={v.style} className="group">
                    <div
                      className={`aspect-[4/5] rounded-xl bg-gradient-to-br ${v.gradient} flex items-center justify-center transition-transform group-hover:scale-[1.02] shadow-sm border border-card-border/50`}
                    >
                      <div className="text-center px-4">
                        <div className="text-3xl mb-2">{example.before}</div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 inline-block">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/70">
                            {v.style}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
