"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LandingLogo } from "@/app/components/landing/LandingLogo";

export default function BetaLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/app";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/beta-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Could not sign in. Try again.");
        return;
      }

      router.push(next.startsWith("/app") ? next : "/app");
      router.refresh();
    } catch {
      setError("Could not sign in. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-4)",
        background: "var(--bg)",
      }}
    >
      <div style={{ marginBottom: 28 }}>
        <LandingLogo iconSize={40} />
      </div>

      <div
        className="app-card"
        style={{ width: "100%", maxWidth: 400, padding: "var(--space-4)" }}
      >
        <h1 className="font-heading text-h2" style={{ marginTop: 0, marginBottom: 8 }}>
          Beta access
        </h1>
        <p style={{ marginTop: 0, marginBottom: 24, fontSize: 15, color: "var(--muted)", lineHeight: 1.5 }}>
          Enter the password from your invite email to open the app.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label
              htmlFor="beta-password"
              style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--muted)", marginBottom: 8 }}
            >
              Password
            </label>
            <input
              id="beta-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                minHeight: 48,
                padding: "0 14px",
                borderRadius: "var(--btn-radius)",
                border: "1px solid var(--border)",
                fontSize: 16,
                boxSizing: "border-box",
              }}
            />
          </div>

          {error ? (
            <p role="alert" style={{ margin: 0, fontSize: 14, color: "#b42318" }}>
              {error}
            </p>
          ) : null}

          <button type="submit" className="app-btn-primary" disabled={submitting} style={{ width: "100%" }}>
            {submitting ? "Opening…" : "Enter app"}
          </button>
        </form>

        <p style={{ marginTop: 20, marginBottom: 0, fontSize: 13, color: "var(--muted)", textAlign: "center" }}>
          Not in the beta yet?{" "}
          <Link href="/#beta" className="app-link">
            Join the waitlist
          </Link>
        </p>
      </div>
    </main>
  );
}
