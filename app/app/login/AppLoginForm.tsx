"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LandingLogo } from "@/app/components/landing/LandingLogo";
import { createSupabaseBrowser } from "@/app/lib/supabase/browser";
import { REQUIRED_ONBOARDING_VERSION } from "@/app/lib/profile/constants";

export default function AppLoginForm({ betaGate = true }: { betaGate?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/app";

  const [betaPassword, setBetaPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"beta" | "email" | "sent">(betaGate ? "beta" : "email");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function finishSignIn() {
    const profileRes = await fetch("/api/profile");
    if (profileRes.ok) {
      const data = await profileRes.json();
      const needs = (data.profile?.onboarding_version ?? 0) < REQUIRED_ONBOARDING_VERSION;
      router.replace(needs ? "/app/onboarding" : next);
    } else {
      router.replace("/app/onboarding");
    }
    router.refresh();
  }

  useEffect(() => {
    const authError = searchParams.get("error");
    if (authError) {
      setError(decodeURIComponent(authError));
      setStep(betaGate ? "email" : "email");
    }
  }, [searchParams, betaGate]);

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
        const msg = otpError.message.toLowerCase();
        if (msg.includes("rate limit")) {
          setError(
            "Too many sign-in emails sent. Supabase’s free email allows about 2 per hour — wait an hour, or set up Resend SMTP in Supabase to remove this limit.",
          );
        } else {
          setError(otpError.message);
        }
        return;
      }
      setOtpCode("");
      setStep("sent");
    } catch {
      setError("Could not send sign-in link.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = createSupabaseBrowser();
    if (!supabase) {
      setError("Sign-in is not configured yet.");
      setSubmitting(false);
      return;
    }

    const token = otpCode.replace(/\D/g, "");
    if (token.length < 6) {
      setError("Enter the 6-digit code from your email.");
      setSubmitting(false);
      return;
    }

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token,
        type: "email",
      });

      if (verifyError) {
        setError(verifyError.message);
        return;
      }

      await finishSignIn();
    } catch {
      setError("Could not verify code.");
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
              We&apos;ll email you a sign-in link. Your profile and kids save to your account.
              Check spam if it doesn&apos;t arrive within a few minutes.
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
              We sent email to <strong>{email}</strong>. You may get two messages: a welcome note first, then your sign-in link.
            </p>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 12, lineHeight: 1.5 }}>
              <strong>Check spam and promotions.</strong> Mark Phrasewell as not spam so the sign-in link gets through.
            </p>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 12, lineHeight: 1.5 }}>
              Tap the sign-in link in <strong>Safari</strong> or <strong>Chrome</strong> on this device. Not the Gmail or Outlook preview.
            </p>
            <details style={{ marginTop: 20, fontSize: 14 }}>
              <summary style={{ cursor: "pointer", color: "var(--text)" }}>
                Have a 6-digit code instead?
              </summary>
              <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 8, lineHeight: 1.5 }}>
                Some emails include a code. If yours does, enter it below. If not, use the magic link above.
              </p>
              <form onSubmit={handleOtpSubmit} style={{ marginTop: 12 }}>
                <label className="onboarding-label" htmlFor="login-otp">
                  6-digit code
                </label>
                <input
                  id="login-otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="onboarding-input"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  maxLength={8}
                />
                {error ? <p className="onboarding-error">{error}</p> : null}
                <button type="submit" className="onboarding-btn-secondary" disabled={submitting} style={{ marginTop: 12 }}>
                  {submitting ? "Signing in…" : "Sign in with code"}
                </button>
              </form>
            </details>
            <button
              type="button"
              className="onboarding-btn-secondary"
              style={{ marginTop: 16 }}
              onClick={() => {
                setError(null);
                setStep("email");
              }}
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
