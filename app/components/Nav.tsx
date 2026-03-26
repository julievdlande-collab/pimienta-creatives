"use client";

import { useEffect, useState } from "react";

export default function Nav() {
  const [user, setUser] = useState<{ email: string; balance: number } | null>(null);

  useEffect(() => {
    fetch("/api/credits")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) {
          setUser({ email: data.email, balance: data.balance });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-card-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold tracking-tight text-foreground">
          pimienta<span className="text-accent">.</span>creatives
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
          <a href="/#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="/#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          <a href="/#pricing" className="hover:text-foreground transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Credit badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-accent-light text-accent">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {user.balance} credits
              </span>
              <a
                href="/create"
                className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-accent rounded-full hover:bg-accent-hover transition-colors"
              >
                Create
              </a>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                Log in
              </a>
              <a
                href="/create"
                className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-accent rounded-full hover:bg-accent-hover transition-colors"
              >
                Start creating
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
