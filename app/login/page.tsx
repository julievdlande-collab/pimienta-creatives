"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    const supabase = createBrowserSupabase();
    const redirectTo = `${window.location.origin}/api/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("");
    const supabase = createBrowserSupabase();
    const redirectTo = `${window.location.origin}/api/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) setError(error.message);
  };

  return (
    <>
      <Nav />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-sm mx-auto">
          <h1 className="text-2xl font-bold tracking-tight text-center mb-2">
            Sign in to Pimienta
          </h1>
          <p className="text-sm text-muted text-center mb-8">
            Create ad creatives with AI. 5 free generations included.
          </p>

          {sent ? (
            <div className="text-center p-6 rounded-2xl bg-teal-light border border-teal/20">
              <div className="text-3xl mb-3">📬</div>
              <p className="font-semibold text-teal">Check your email</p>
              <p className="text-sm text-muted mt-2">
                We sent a login link to <strong>{email}</strong>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Google */}
              <button
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-card-border bg-white text-sm font-semibold hover:bg-section-alt transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-card-border" />
                <span className="text-xs text-muted">or</span>
                <div className="flex-1 h-px bg-card-border" />
              </div>

              {/* Magic link */}
              <form onSubmit={handleMagicLink} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent-hover disabled:opacity-50 transition-colors"
                >
                  {loading ? "Sending..." : "Send magic link"}
                </button>
              </form>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl mt-4">
              {error}
            </p>
          )}

          <p className="text-xs text-muted text-center mt-8">
            By signing in you agree to our terms of service.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
