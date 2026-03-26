export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-card-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold tracking-tight text-foreground">
          pimienta<span className="text-accent">.</span>creatives
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#pricing"
            className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Log in
          </a>
          <a
            href="#pricing"
            className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-accent rounded-full hover:bg-accent/90 transition-colors"
          >
            Get started free
          </a>
        </div>
      </div>
    </nav>
  );
}
