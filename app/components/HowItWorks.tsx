const steps = [
  {
    number: "01",
    title: "Set up your brand",
    description: "Upload your logo, pick your brand colors, and define your tone of voice.",
    visual: "🎨",
  },
  {
    number: "02",
    title: "Add your product",
    description: "Drop in a product photo and give it a name. That's all we need.",
    visual: "📸",
  },
  {
    number: "03",
    title: "Pick style & format",
    description: "Choose from UGC, clean e-commerce, lifestyle, or bold sale — in any aspect ratio.",
    visual: "🎯",
  },
  {
    number: "04",
    title: "Generate & download",
    description: "Get 3 unique ad variants. Preview them, download as high-res PNG. Done.",
    visual: "⬇️",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-section-alt">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            From product photo to ad creative in{" "}
            <span className="text-accent">4 steps</span>
          </h2>
          <p className="text-muted text-lg mt-4 max-w-xl mx-auto">
            No design skills. No agency. No complex tools.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(100%+0.5rem)] w-[calc(100%-3rem)] h-px bg-card-border" />
              )}

              <div className="text-center">
                {/* Number badge */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent text-white text-sm font-bold mb-5">
                  {step.number}
                </div>

                {/* Visual */}
                <div className="w-full aspect-[4/3] rounded-xl bg-white border border-card-border flex items-center justify-center mb-5 shadow-sm">
                  <span className="text-4xl">{step.visual}</span>
                </div>

                <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
