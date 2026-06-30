"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LandingLogo } from "@/app/components/landing/LandingLogo";
import { createSupabaseBrowser } from "@/app/lib/supabase/browser";

export default function AppLoginForm({ betaGate = true }: { betaGate?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/app";

  const [betaPassword, setBetaPassword] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"beta" | "email" | "sent">(betaGate ? "beta" : "email");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleBetaSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/beta-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: betaPassword }),
      });
      if (!res.ok) {
        setError("Incorrect beta password.");
        return;
      }
      setStep("email");
    } catch {
      setError("Could not verify password.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = createSupabaseBrowser();
    if (!supabase) {
      setError("Sign-in is not configured yet. Add NEXT_PUBLIC_SUPABASE_ANON_KEY to Vercel.");
      setSubmitting(false);
      return;
    }

    try {
      const origin = window.location.origin;
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${origin}/app/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });

      if (otpError) {
        setError(otpError.message);
        return;
      }
      setStep("sent");
    } catch {
      setError("Could not send sign-in link.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="onboarding-shell">
      <div style={{ marginBottom: 28 }}>
        <LandingLogo iconSize={40} />
      </div>

      <div className="app-card onboarding-card">
        {step === "beta" && (
          <>
            <h1 className="font-heading" style={{ fontSize: "1.35rem", margin: "0 0 8px" }}>
              Beta access
            </h1>
            <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 0, lineHeight: 1.5 }}>
              Enter the beta password you received from Courtney.
            </p>
            <form onSubmit={handleBetaSubmit} style={{ marginTop: 20 }}>
              <label className="onboarding-label" htmlFor="beta-pw">
                Beta password
              </label>
              <input
                id="beta-pw"
                type="password"
                className="onboarding-input"
                value={betaPassword}
                onChange={(e) => setBetaPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              {error ? <p className="onboarding-error">{error}</p> : null}
              <button type="submit" className="onboarding-btn-primary" disabled={submitting}>
                {submitting ? "Checking…" : "Continue"}
              </button>
            </form>
          </>
        )}

        {step === "email" && (
          <>
            <h1 className="font-heading" style={{ fontSize: "1.35rem", margin: "0 0 8px" }}>
              Sign in with email
            </h1>
            <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 0, lineHeight: 1.5 }}>
              We&apos;ll email you a magic link. Your profile and kids save to your account — even if you delete the app later.
            </p>
            <form onSubmit={handleEmailSubmit} style={{ marginTop: 20 }}>
              <label className="onboarding-label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                className="onboarding-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              {error ? <p className="onboarding-error">{error}</p> : null}
              <button type="submit" className="onboarding-btn-primary" disabled={submitting}>
                {submitting ? "Sending…" : "Send magic link"}
              </button>
            </form>
          </>
        )}

        {step === "sent" && (
          <div role="status">
            <h1 className="font-heading" style={{ fontSize: "1.35rem", margin: "0 0 8px" }}>
              Check your email
            </h1>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
              We sent a sign-in link to <strong>{email}</strong>. Click it on this device to open Phrasewell.
            </p>
            <button
              type="button"
              className="onboarding-btn-secondary"
              style={{ marginTop: 16 }}
              onClick={() => setStep("email")}
            >
              Use a different email
            </button>
          </div>
        )}

        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 20, marginBottom: 0 }}>
          <Link href="/" className="app-link">
            Back to phrasewell.net
          </Link>
        </p>
      </div>
    </main>
  );
}
