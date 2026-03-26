export default function CTA() {
  return (
    <section className="py-24 px-6 bg-section-alt">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Agency-quality ads.{" "}
          <span className="text-accent">Without the agency.</span>
        </h2>
        <p className="text-muted text-lg mt-4 max-w-xl mx-auto">
          Upload your first product and generate 3 ad creatives — completely free. No credit card required.
        </p>
        <div className="mt-10">
          <a
            href="#pricing"
            className="inline-flex items-center px-8 py-4 text-base font-semibold text-white bg-accent rounded-full hover:bg-accent-hover transition-colors shadow-lg shadow-accent/25"
          >
            Start creating for free
          </a>
        </div>
        <p className="text-sm text-muted mt-4">
          5 free generations included. No sign-up hassle.
        </p>
      </div>
    </section>
  );
}
