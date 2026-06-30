"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AgeBand } from "@/app/lib/contentLibrary";
import { PageTitle } from "@/app/components/PageTitle";
import { SectionLabel } from "@/app/components/SectionLabel";
import {
  AGE_BAND_OPTIONS,
  CHALLENGE_OPTIONS,
  CHILD_RELATIONSHIPS,
  PARENT_TYPES,
  type ParentType,
} from "@/app/lib/profile/constants";
import { useProfile } from "@/app/contexts/ProfileContext";

export default function ProfilePage() {
  const {
    profile,
    activeChildren,
    selectedChildId,
    setSelectedChildId,
    updateProfile,
    addChild,
    updateChild,
    removeChild,
    loading,
  } = useProfile();

  const [firstName, setFirstName] = useState("");
  const [parentTypes, setParentTypes] = useState<ParentType[]>([]);
  const [challenges, setChallenges] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddChild, setShowAddChild] = useState(false);
  const [newChild, setNewChild] = useState({ name: "", age_band: "4-7" as AgeBand, relationship: "Foster child" });

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.first_name ?? "");
    setParentTypes((profile.parent_types ?? []) as ParentType[]);
    setChallenges(profile.challenge_tags ?? []);
  }, [profile]);

  async function saveParent() {
    setError(null);
    try {
      await updateProfile({
        first_name: firstName,
        parent_types: parentTypes,
        challenge_tags: challenges,
      } as Parameters<typeof updateProfile>[0]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Could not save.");
    }
  }

  async function handleAddChild() {
    if (!newChild.name.trim()) return;
    try {
      await addChild(newChild);
      setShowAddChild(false);
      setNewChild({ name: "", age_band: "4-7", relationship: "Foster child" });
    } catch {
      setError("Could not add child.");
    }
  }

  return (
    <div className="app-container" style={{ paddingTop: "var(--space-3)", paddingBottom: 100 }}>
      <PageTitle>Profile & family</PageTitle>
      <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 0, lineHeight: 1.5 }}>
        Update your info anytime. Removing a child hides them from quick help — we never show &quot;delete.&quot;
      </p>

      {saved ? (
        <p role="status" style={{ fontSize: 13, color: "var(--muted)" }}>
          Saved
        </p>
      ) : null}
      {error ? <p className="onboarding-error">{error}</p> : null}

      <section style={{ marginBottom: "var(--space-4)" }}>
        <SectionLabel>About you</SectionLabel>
        <label className="onboarding-label">Email</label>
        <input className="onboarding-input" value={profile?.email ?? ""} readOnly />
        <label className="onboarding-label" htmlFor="prof-name">
          First name
        </label>
        <input
          id="prof-name"
          className="onboarding-input"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <p className="onboarding-label">Parent type</p>
        <div className="onboarding-chips">
          {PARENT_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              className={`onboarding-chip${parentTypes.includes(t) ? " onboarding-chip-on" : ""}`}
              onClick={() =>
                setParentTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
              }
            >
              {t}
            </button>
          ))}
        </div>
        <p className="onboarding-label">Focus areas</p>
        <div className="onboarding-chips">
          {CHALLENGE_OPTIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`onboarding-chip${challenges.includes(c.id) ? " onboarding-chip-on" : ""}`}
              onClick={() =>
                setChallenges((prev) => (prev.includes(c.id) ? prev.filter((x) => x !== c.id) : [...prev, c.id]))
              }
            >
              {c.label}
            </button>
          ))}
        </div>
        <button type="button" className="onboarding-btn-primary" onClick={saveParent}>
          Save profile
        </button>
      </section>

      <section>
        <SectionLabel>Children</SectionLabel>
        {activeChildren.map((child) => (
          <div key={child.id} className="onboarding-child-block app-card" style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <strong>{child.name}</strong>
              <button
                type="button"
                className={`onboarding-chip${selectedChildId === child.id ? " onboarding-chip-on" : ""}`}
                onClick={() => {
                  setSelectedChildId(child.id);
                  updateProfile({ default_child_id: child.id } as Parameters<typeof updateProfile>[0]);
                }}
              >
                {selectedChildId === child.id ? "Default" : "Set default"}
              </button>
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)", margin: "4px 0 12px" }}>
              {child.relationship} · {child.age_band}
            </p>
            <button
              type="button"
              className="onboarding-link-btn"
              onClick={async () => {
                if (confirm(`Remove ${child.name} from your profile? You can add them again later.`)) {
                  await removeChild(child.id);
                }
              }}
            >
              Remove
            </button>
          </div>
        ))}

        {showAddChild ? (
          <div className="onboarding-child-block">
            <input
              className="onboarding-input"
              placeholder="Name / nickname"
              value={newChild.name}
              onChange={(e) => setNewChild((c) => ({ ...c, name: e.target.value }))}
            />
            <select
              className="onboarding-input"
              value={newChild.age_band}
              onChange={(e) => setNewChild((c) => ({ ...c, age_band: e.target.value as AgeBand }))}
            >
              {AGE_BAND_OPTIONS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
            <select
              className="onboarding-input"
              value={newChild.relationship}
              onChange={(e) => setNewChild((c) => ({ ...c, relationship: e.target.value }))}
            >
              {CHILD_RELATIONSHIPS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <button type="button" className="onboarding-btn-primary" onClick={handleAddChild}>
              Add child
            </button>
          </div>
        ) : (
          <button type="button" className="onboarding-btn-secondary" onClick={() => setShowAddChild(true)}>
            + Add child
          </button>
        )}
      </section>

      <p style={{ marginTop: 24, fontSize: 14 }}>
        <Link href="/app/settings" className="app-link">
          App settings
        </Link>
      </p>
    </div>
  );
}
