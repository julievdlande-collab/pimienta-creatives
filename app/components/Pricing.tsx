"use client";

import { useState } from "react";

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
      "Standard resolution",
    ],
    cta: "Start free",
    packId: null,
    popular: false,
  },
  {
    name: "Creator",
    price: "\u20AC19",
    period: "25 credits",
    description: "Most popular",
    credits: "25 generations",
    features: [
      "3 variants per generation",
      "All styles & formats",
      "Full resolution PNG",
      "Brand presets",
    ],
    cta: "Buy credits",
    packId: "creator",
    popular: true,
  },
  {
    name: "Growth",
    price: "\u20AC49",
    period: "100 credits",
    description: "Best value",
    credits: "100 generations",
    features: [
      "3 variants per generation",
      "All styles & formats",
      "Full resolution PNG",
      "Brand presets",
      "Priority generation",
      "Bulk download",
    ],
    cta: "Buy credits",
    packId: "growth",
    popular: false,
  },
];

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountMsg, setDiscountMsg] = useState("");
  const [discountError, setDiscountError] = useState("");

  const handleBuy = async (packId: string) => {
    setLoading(packId);
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      const data = await res.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (res.status === 401) {
        window.location.href = "/login";
      }
    } catch {
      // ignore
    } finally {
      setLoading(null);
    }
  };

  const handleRedeem = async () => {
    if (!discountCode.trim()) return;
    setDiscountMsg("");
    setDiscountError("");

    try {
      const res = await fetch("/api/discount/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountCode }),
      });
      const data = await res.json();

      if (res.ok) {
        setDiscountMsg(data.message);
        setDiscountCode("");
      } else if (res.status === 401) {
        window.location.href = "/login";
      } else {
        setDiscountError(data.error);
      }
    } catch {
      setDiscountError("Something went wrong.");
    }
  };

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

              {plan.packId ? (
                <button
                  onClick={() => handleBuy(plan.packId!)}
                  disabled={loading === plan.packId}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${
                    plan.popular
                      ? "bg-accent text-white hover:bg-accent-hover"
                      : "bg-section-alt text-foreground hover:bg-card-border"
                  }`}
                >
                  {loading === plan.packId ? "Redirecting..." : plan.cta}
                </button>
              ) : (
                <a
                  href="/create"
                  className="block w-full py-3 px-4 rounded-xl text-sm font-semibold text-center bg-section-alt text-foreground hover:bg-card-border transition-colors"
                >
                  {plan.cta}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Discount code */}
        <div className="max-w-sm mx-auto mt-12 text-center">
          <p className="text-sm text-muted mb-3">Have a discount code?</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Enter code"
              className="flex-1 px-4 py-2.5 rounded-xl border border-card-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
            <button
              onClick={handleRedeem}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-foreground text-white hover:bg-foreground/90 transition-colors"
            >
              Redeem
            </button>
          </div>
          {discountMsg && (
            <p className="text-sm text-teal font-medium mt-2">{discountMsg}</p>
          )}
          {discountError && (
            <p className="text-sm text-red-500 mt-2">{discountError}</p>
          )}
        </div>
      </div>
    </section>
  );
}
