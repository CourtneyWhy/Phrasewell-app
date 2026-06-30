"use client";

import { useState } from "react";
import {
  PARENT_TYPES,
  KID_COUNT_OPTIONS,
  AGE_BAND_OPTIONS,
  CHALLENGE_OPTIONS,
} from "@/app/lib/profile/constants";

const SUCCESS_MESSAGE =
  "You're on the list. We're inviting early testers in small groups and will email you when your beta access opens.";

export function BetaForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [parentType, setParentType] = useState("");
  const [kidCount, setKidCount] = useState("");
  const [ageBands, setAgeBands] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submitWaitlist(includeExtras: boolean) {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          email,
          parent_type: parentType,
          kid_count: includeExtras ? kidCount || null : null,
          challenge_tags: includeExtras ? challenges : [],
          age_bands: includeExtras ? ageBands : [],
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          email,
          parent_type: parentType,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setStep(2);
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="landing-beta-success" role="status">
        <p className="font-heading" style={{ fontSize: "1.25rem", margin: "0 0 12px" }}>
          You&apos;re on the list
        </p>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>{SUCCESS_MESSAGE}</p>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="landing-beta-form">
        <p className="font-heading" style={{ fontSize: "1.1rem", margin: "0 0 8px" }}>
          Help us personalize (optional)
        </p>
        <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 0, lineHeight: 1.5 }}>
          Same email as step 1 — we update your waitlist entry, no duplicate.
        </p>

        <p className="landing-field-label" style={{ marginTop: 16 }}>
          How many kids are you parenting?
        </p>
        <div className="onboarding-chips">
          {KID_COUNT_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              className={`onboarding-chip${kidCount === n ? " onboarding-chip-on" : ""}`}
              onClick={() => setKidCount(n)}
            >
              {n}
            </button>
          ))}
        </div>

        <p className="landing-field-label">Ages in your home</p>
        <div className="onboarding-chips">
          {AGE_BAND_OPTIONS.map((a) => (
            <button
              key={a.id}
              type="button"
              className={`onboarding-chip${ageBands.includes(a.id) ? " onboarding-chip-on" : ""}`}
              onClick={() =>
                setAgeBands((prev) =>
                  prev.includes(a.id) ? prev.filter((x) => x !== a.id) : [...prev, a.id],
                )
              }
            >
              {a.label}
            </button>
          ))}
        </div>

        <p className="landing-field-label">What&apos;s hardest right now?</p>
        <div className="onboarding-chips">
          {CHALLENGE_OPTIONS.slice(0, 8).map((c) => (
            <button
              key={c.id}
              type="button"
              className={`onboarding-chip${challenges.includes(c.id) ? " onboarding-chip-on" : ""}`}
              onClick={() =>
                setChallenges((prev) =>
                  prev.includes(c.id) ? prev.filter((x) => x !== c.id) : [...prev, c.id],
                )
              }
            >
              {c.label}
            </button>
          ))}
        </div>

        {error ? <p className="landing-form-error" role="alert">{error}</p> : null}

        <button
          type="button"
          className="landing-btn landing-btn-primary landing-btn-full"
          disabled={submitting}
          onClick={() => submitWaitlist(true)}
        >
          {submitting ? "Submitting…" : "Finish"}
        </button>
        <button
          type="button"
          className="landing-btn landing-btn-secondary landing-btn-full"
          style={{ marginTop: 8 }}
          disabled={submitting}
          onClick={() => setSuccess(true)}
        >
          Skip for now
        </button>
      </div>
    );
  }

  return (
    <form className="landing-beta-form" onSubmit={handleStep1} noValidate>
      <div className="landing-field">
        <label htmlFor="beta-first-name">First name</label>
        <input
          id="beta-first-name"
          type="text"
          name="first_name"
          autoComplete="given-name"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      <div className="landing-field">
        <label htmlFor="beta-email">Email</label>
        <input
          id="beta-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="landing-field">
        <label htmlFor="beta-parent-type">Parent type</label>
        <select
          id="beta-parent-type"
          name="parent_type"
          required
          value={parentType}
          onChange={(e) => setParentType(e.target.value)}
        >
          <option value="">Select one</option>
          {PARENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p className="landing-form-error" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className="landing-btn landing-btn-primary landing-btn-full" disabled={submitting}>
        Continue
      </button>

      <p className="landing-form-note">We&apos;ll only email you about Phrasewell. Already on the list? We&apos;ll update your info.</p>
    </form>
  );
}
