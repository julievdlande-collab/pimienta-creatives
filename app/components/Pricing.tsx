const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Try it out",
    credits: "5 generations",
    features: [
      "3 variants per generation",
      "All styles & formats",
      "With watermark",
      "Standard resolution",
    ],
    cta: "Start free",
    popular: false,
  },
  {
    name: "Creator",
    price: "$19",
    period: "25 credits",
    description: "Most popular",
    credits: "25 generations",
    features: [
      "3 variants per generation",
      "All styles & formats",
      "No watermark",
      "Full resolution PNG",
      "Brand presets",
    ],
    cta: "Buy credits",
    popular: true,
  },
  {
    name: "Growth",
    price: "$49",
    period: "100 credits",
    description: "Best value",
    credits: "100 generations",
    features: [
      "3 variants per generation",
      "All styles & formats",
      "No watermark",
      "Full resolution PNG",
      "Brand presets",
      "Priority generation",
      "Bulk download",
    ],
    cta: "Buy credits",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Simple credit packs
          </h2>
          <p className="text-muted text-lg mt-4">
            Pay for what you use. Each credit = 3 ad variants. No subscription.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-6 rounded-2xl border bg-white transition-shadow ${
                plan.popular
                  ? "border-accent shadow-lg shadow-accent/10 ring-1 ring-accent"
                  : "border-card-border shadow-sm hover:shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent text-white">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-xs text-muted mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-sm text-muted ml-1">/ {plan.period}</span>
                )}
              </div>

              <p className="text-sm font-medium text-foreground/70 mb-4">
                {plan.credits}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
                    <svg
                      className="w-4 h-4 text-success flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-colors ${
                  plan.popular
                    ? "bg-accent text-white hover:bg-accent-hover"
                    : "bg-section-alt text-foreground hover:bg-card-border"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
