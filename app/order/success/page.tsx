"use client";

import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

export default function OrderSuccessPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Credits added!
          </h1>
          <p className="text-muted mb-8">
            Your credits have been added to your account. Start creating ad creatives now.
          </p>
          <a
            href="/create"
            className="inline-flex items-center px-8 py-3.5 text-base font-semibold text-white bg-accent rounded-full hover:bg-accent-hover transition-colors shadow-lg shadow-accent/25"
          >
            Start creating
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
