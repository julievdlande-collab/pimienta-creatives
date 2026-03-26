export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-card-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <a href="/" className="text-lg font-bold tracking-tight text-foreground">
              pimienta<span className="text-accent">.</span>creatives
            </a>
            <p className="text-sm text-muted mt-1">
              AI ad creatives for e-commerce brands.
            </p>
          </div>

          <div className="flex items-center gap-8 text-sm text-muted">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Pimienta Agency. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            Built for e-commerce teams that move fast.
          </p>
        </div>
      </div>
    </footer>
  );
}
