"use client";

import { useState } from "react";

const PARENT_TYPES = [
  "Foster parent",
  "Adoptive parent",
  "Kinship caregiver",
  "Biological parent",
  "Stepparent",
  "Grandparent caregiver",
  "Professional supporting parents",
  "Other",
] as const;

const SUCCESS_MESSAGE =
  "You're on the list. We're inviting early testers in small groups and will email you when your beta access opens.";

export function BetaForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [parentType, setParentType] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
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

  return (
    <form className="landing-beta-form" onSubmit={handleSubmit} noValidate>
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
        {submitting ? "Submitting…" : "Get beta access"}
      </button>

      <p className="landing-form-note">We&apos;ll only email you about the beta.</p>
    </form>
  );
}
