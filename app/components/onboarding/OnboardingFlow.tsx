"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AgeBand } from "@/app/lib/contentLibrary";
import { GOTCHA_PITCH } from "@/app/lib/growth/launch-strategy";
import {
  AGE_BAND_OPTIONS,
  CHALLENGE_OPTIONS,
  CHILD_RELATIONSHIPS,
  PARENT_TYPES,
  type ParentType,
} from "@/app/lib/profile/constants";
import { createSupabaseBrowser } from "@/app/lib/supabase/browser";

type DraftChild = {
  key: string;
  name: string;
  age_band: AgeBand;
  relationship: string;
};

const INTRO_SLIDES = [
  {
    title: "Words when your brain goes blank",
    body: GOTCHA_PITCH,
  },
  {
    title: "Built for hard moments",
    body: "Exact say-this / do-this scripts for foster, adoptive, kinship, and stepparents — not another course.",
  },
  {
    title: "Made by a parent who needed this",
    body: "From an adoptive mom who needed calm words in the moment, not more theory.",
  },
];

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [parentTypes, setParentTypes] = useState<ParentType[]>([]);
  const [challenges, setChallenges] = useState<string[]>([]);
  const [draftChildren, setDraftChildren] = useState<DraftChild[]>([
    { key: "1", name: "", age_band: "4-7", relationship: "Foster child" },
  ]);
  const [loading, setLoading] = useState(false);
  const [personalizing, setPersonalizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const supabase = createSupabaseBrowser();
      if (!supabase) return;
      const { data } = await supabase.auth.getUser();
      if (data.user?.email) setEmail(data.user.email);
    })();
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.profile?.first_name) setFirstName(d.profile.first_name);
        if (d.profile?.parent_types?.length) setParentTypes(d.profile.parent_types);
        if (d.profile?.challenge_tags?.length) setChallenges(d.profile.challenge_tags);
      })
      .catch(() => {});
  }, []);

  const totalSteps = INTRO_SLIDES.length + 4;
  const progress = Math.min(100, Math.round(((step + 1) / totalSteps) * 100));

  const summaryCards = useMemo(() => {
    const cards: string[] = [];
    if (draftChildren.length) {
      const ages = [...new Set(draftChildren.map((c) => c.age_band))].join(", ");
      cards.push(`Scripts tuned for ages ${ages}`);
    }
    if (parentTypes.length) {
      cards.push(`Guidance for ${parentTypes[0].toLowerCase()}s`);
    }
    if (challenges.length) {
      const label = CHALLENGE_OPTIONS.find((c) => c.id === challenges[0])?.label;
      if (label) cards.push(`Focus on ${label.toLowerCase()}`);
    }
    while (cards.length < 3) {
      cards.push("Instant scripts when kids are melting down");
    }
    return cards.slice(0, 3);
  }, [draftChildren, parentTypes, challenges]);

  const toggleParentType = (t: ParentType) => {
    setParentTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const toggleChallenge = (id: string) => {
    setChallenges((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const addChildRow = () => {
    setDraftChildren((prev) => [
      ...prev,
      { key: String(Date.now()), name: "", age_band: "4-7", relationship: "Biological child" },
    ]);
  };

  const updateChild = (key: string, patch: Partial<DraftChild>) => {
    setDraftChildren((prev) => prev.map((c) => (c.key === key ? { ...c, ...patch } : c)));
  };

  const removeChildRow = (key: string) => {
    setDraftChildren((prev) => (prev.length <= 1 ? prev : prev.filter((c) => c.key !== key)));
  };

  const finish = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/profile/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          parent_types: parentTypes,
          challenge_tags: challenges,
          children: draftChildren.map((c) => ({
            name: c.name,
            age_band: c.age_band,
            relationship: c.relationship,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save.");
        return;
      }
      router.replace("/app");
      router.refresh();
    } catch {
      setError("Could not save. Try again.");
    } finally {
      setLoading(false);
    }
  }, [challenges, draftChildren, firstName, parentTypes, router]);

  const goNext = () => {
    setError(null);
    const introEnd = INTRO_SLIDES.length - 1;
    const aboutStep = INTRO_SLIDES.length;
    const challengeStep = INTRO_SLIDES.length + 1;
    const kidsStep = INTRO_SLIDES.length + 2;
    const readyStep = INTRO_SLIDES.length + 3;

    if (step < introEnd) {
      setStep(step + 1);
      return;
    }

    if (step === aboutStep) {
      if (!email) {
        setError("Sign in with email first — go back to login.");
        return;
      }
      if (!firstName.trim()) {
        setError("Please enter your first name.");
        return;
      }
      if (parentTypes.length === 0) {
        setError("Select at least one parent type.");
        return;
      }
      setStep(step + 1);
      return;
    }

    if (step === challengeStep) {
      setStep(step + 1);
      return;
    }

    if (step === kidsStep) {
      const valid = draftChildren.every((c) => c.name.trim() && c.relationship);
      if (!valid) {
        setError("Each child needs a name/nickname and relationship.");
        return;
      }
      setPersonalizing(true);
      setTimeout(() => {
        setPersonalizing(false);
        setStep(readyStep);
      }, 2200);
      return;
    }

    if (step === readyStep) {
      finish();
    }
  };

  if (personalizing) {
    return (
      <main className="onboarding-shell">
        <div className="onboarding-card app-card" style={{ textAlign: "center" }}>
          <div className="onboarding-spinner" aria-hidden />
          <h1 className="font-heading" style={{ fontSize: "1.25rem", margin: "16px 0 8px" }}>
            Setting up your scripts
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>
            Personalizing for your family…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="onboarding-shell">
      <div className="onboarding-progress" aria-hidden>
        <div className="onboarding-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="onboarding-card app-card">
        {step < INTRO_SLIDES.length && (
          <>
            <h1 className="font-heading onboarding-title">{INTRO_SLIDES[step].title}</h1>
            <p className="onboarding-body">{INTRO_SLIDES[step].body}</p>
            <div className="onboarding-dots">
              {INTRO_SLIDES.map((_, i) => (
                <span key={i} className={`onboarding-dot${i === step ? " onboarding-dot-active" : ""}`} />
              ))}
            </div>
          </>
        )}

        {step === INTRO_SLIDES.length && (
          <>
            <h1 className="font-heading onboarding-title">About you</h1>
            <p className="onboarding-hint">We use this to personalize scripts. Your email is saved to your account.</p>
            <label className="onboarding-label">Email</label>
            <input className="onboarding-input" value={email} readOnly aria-readonly />
            <label className="onboarding-label" htmlFor="ob-first">
              Your first name
            </label>
            <input
              id="ob-first"
              className="onboarding-input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
            />
            <p className="onboarding-label">I am a… (select all that apply)</p>
            <div className="onboarding-chips">
              {PARENT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`onboarding-chip${parentTypes.includes(t) ? " onboarding-chip-on" : ""}`}
                  onClick={() => toggleParentType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </>
        )}

        {step === INTRO_SLIDES.length + 1 && (
          <>
            <h1 className="font-heading onboarding-title">What&apos;s hardest right now?</h1>
            <p className="onboarding-hint">Check all that apply — we&apos;ll surface these categories first.</p>
            <div className="onboarding-chips">
              {CHALLENGE_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`onboarding-chip${challenges.includes(c.id) ? " onboarding-chip-on" : ""}`}
                  onClick={() => toggleChallenge(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === INTRO_SLIDES.length + 2 && (
          <>
            <h1 className="font-heading onboarding-title">Your kids</h1>
            <p className="onboarding-hint">
              Name or nickname only. Add each child you want scripts for. Email required before we save — you&apos;re signed in as {email || "…"}.
            </p>
            {draftChildren.map((child) => (
              <div key={child.key} className="onboarding-child-block">
                <label className="onboarding-label">Name / nickname</label>
                <input
                  className="onboarding-input"
                  value={child.name}
                  onChange={(e) => updateChild(child.key, { name: e.target.value })}
                  placeholder="e.g. Sam"
                />
                <label className="onboarding-label">Age</label>
                <select
                  className="onboarding-input"
                  value={child.age_band}
                  onChange={(e) => updateChild(child.key, { age_band: e.target.value as AgeBand })}
                >
                  {AGE_BAND_OPTIONS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
                <label className="onboarding-label">Relationship</label>
                <select
                  className="onboarding-input"
                  value={child.relationship}
                  onChange={(e) => updateChild(child.key, { relationship: e.target.value })}
                >
                  {CHILD_RELATIONSHIPS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {draftChildren.length > 1 ? (
                  <button
                    type="button"
                    className="onboarding-link-btn"
                    onClick={() => removeChildRow(child.key)}
                  >
                    Remove this child
                  </button>
                ) : null}
              </div>
            ))}
            <button type="button" className="onboarding-btn-secondary" onClick={addChildRow}>
              + Add another child
            </button>
          </>
        )}

        {step === INTRO_SLIDES.length + 3 && (
          <>
            <h1 className="font-heading onboarding-title">Profile ready</h1>
            <p className="onboarding-hint">Based on your answers, we&apos;ll focus on:</p>
            <ul className="onboarding-summary-list">
              {summaryCards.map((text, i) => (
                <li key={i}>
                  <strong>{i + 1}.</strong> {text}
                </li>
              ))}
            </ul>
          </>
        )}

        {error ? <p className="onboarding-error">{error}</p> : null}

        <button
          type="button"
          className="onboarding-btn-primary"
          onClick={goNext}
          disabled={loading}
        >
          {loading
            ? "Saving…"
            : step === INTRO_SLIDES.length + 3
              ? "Get started"
              : step === INTRO_SLIDES.length + 2
                ? "Continue"
                : "Continue"}
        </button>

        {step > 0 && step < INTRO_SLIDES.length + 3 ? (
          <button type="button" className="onboarding-link-btn" onClick={() => setStep(step - 1)}>
            Back
          </button>
        ) : null}
      </div>
    </main>
  );
}
