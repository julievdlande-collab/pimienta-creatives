const testimonials = [
  {
    quote:
      "We used to spend 2 days on ad creatives. Now it takes 10 minutes. The quality honestly surprised us.",
    name: "Sarah K.",
    role: "Marketing Lead, D2C Skincare",
    avatar: "SK",
  },
  {
    quote:
      "The creatives look like they came from an agency. At a fraction of the cost. Game changer for scaling our Meta campaigns.",
    name: "Marcus T.",
    role: "Founder, Streetwear Brand",
    avatar: "MT",
  },
  {
    quote:
      "I was skeptical about AI creatives but these actually convert. We saw a 23% increase in CTR on our product ads.",
    name: "Lisa R.",
    role: "E-commerce Manager",
    avatar: "LR",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-section-alt">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Loved by e-commerce teams
          </h2>
          <p className="text-muted text-lg mt-4">
            Join 500+ brands creating ad creatives faster.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-2xl bg-white border border-card-border shadow-sm"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-sm leading-relaxed text-foreground/80 mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-light text-accent flex items-center justify-center text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
