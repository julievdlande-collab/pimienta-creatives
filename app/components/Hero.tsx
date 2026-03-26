export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Badge */}
        <div className="flex justify-center mb-6 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-accent-light text-accent">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Now in public beta
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto animate-fade-in-up"
          style={{ animationDelay: "0.1s", opacity: 0, letterSpacing: "-0.025em" }}
        >
          One photo. Three ads{" "}
          <span className="text-accent">that convert.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-center text-lg sm:text-xl text-muted max-w-2xl mx-auto mt-6 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: "0.2s", opacity: 0 }}
        >
          Upload your product image, pick a style, and get 3 ad creatives ready
          for Meta &amp; TikTok — in seconds. No designer needed.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-in-up"
          style={{ animationDelay: "0.3s", opacity: 0 }}
        >
          <a
            href="/create"
            className="inline-flex items-center px-8 py-3.5 text-base font-semibold text-white bg-accent rounded-full hover:bg-accent-hover transition-colors shadow-lg shadow-accent/25"
          >
            Start creating for free
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-medium text-muted hover:text-foreground transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            See how it works
          </a>
        </div>

        {/* Hero visual: mock ad grid */}
        <div
          className="mt-16 animate-fade-in-up"
          style={{ animationDelay: "0.4s", opacity: 0 }}
        >
          <div className="relative max-w-5xl mx-auto">
            {/* Browser chrome mockup */}
            <div className="rounded-2xl border border-card-border bg-section-alt shadow-2xl shadow-black/5 overflow-hidden">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-card-border bg-white">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-section-alt rounded-md px-4 py-1.5 text-xs text-muted text-center">
                    creatives.pimienta.agency/create
                  </div>
                </div>
              </div>

              {/* Content: product → 3 ads */}
              <div className="p-8 sm:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Source product */}
                  <div className="flex-shrink-0 text-center">
                    <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-white border-2 border-dashed border-card-border flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📦</div>
                        <p className="text-xs text-muted font-medium">Your product</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted mt-3 font-medium">1 photo uploaded</p>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 text-accent">
                    <svg className="w-8 h-8 rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>

                  {/* 3 generated ads */}
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    {[
                      { bg: "from-red-50 to-rose-100", label: "Benefit", icon: "🌿" },
                      { bg: "from-amber-50 to-orange-100", label: "Social Proof", icon: "🔥" },
                      { bg: "from-teal-50 to-emerald-100", label: "Scroll-Stopper", icon: "✨" },
                    ].map((ad) => (
                      <div key={ad.label} className="group">
                        <div
                          className={`aspect-square rounded-xl bg-gradient-to-br ${ad.bg} flex items-center justify-center transition-transform group-hover:scale-[1.03] shadow-sm`}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-1">{ad.icon}</div>
                            <div className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider">
                              {ad.label}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-success" />
                          <span className="text-[11px] text-muted font-medium">Ready</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
