"use client";

import { useState } from "react";
import Link from "next/link";
import { PageTitle } from "@/app/components/PageTitle";
import { SectionLabel } from "@/app/components/SectionLabel";
import type { MomentId } from "@/app/lib/contentLibrary";
import { MOMENT_CONTEXT_HEADER, MOMENT_OPTIONS } from "@/app/lib/moments";

export default function SettingsPage() {
  const [age, setAge] = useState("4–7");
  const [momentId, setMomentId] = useState<MomentId>("unsafe_right_now");

  return (
    <main className="app-container" style={{ paddingTop: "var(--space-3)", paddingBottom: 100 }}>
      <PageTitle>Settings</PageTitle>

      <section style={{ marginBottom: "var(--space-4)" }}>
        <SectionLabel>Defaults</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div>
            <label style={{ fontSize: 14, color: "var(--text)", display: "block", marginBottom: 6 }}>
              Age
            </label>
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--btn-radius)",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text)",
                fontSize: 15,
              }}
            >
              <option value="0–3">0–3</option>
              <option value="4–7">4–7</option>
              <option value="8–12">8–12</option>
              <option value="Teen">Teen</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 14, color: "var(--text)", display: "block", marginBottom: 6 }}>
              {MOMENT_CONTEXT_HEADER}
            </label>
            <select
              value={momentId}
              onChange={(e) => setMomentId(e.target.value as MomentId)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--btn-radius)",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text)",
                fontSize: 15,
              }}
            >
              {MOMENT_OPTIONS.map((mode) => (
                <option key={mode.id} value={mode.id}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: "var(--space-4)" }}>
        <SectionLabel>Accessibility</SectionLabel>
        <div
          style={{
            padding: "var(--space-3)",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--card-radius)",
            fontSize: 14,
            color: "var(--muted)",
          }}
        >
          Reduce motion, larger text, and other preferences (placeholder).
        </div>
      </section>

      <section>
        <SectionLabel>Account</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <Link
            href="#"
            style={{
              display: "block",
              padding: "var(--space-3)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--card-radius)",
              fontSize: 15,
              color: "var(--text)",
              textDecoration: "none",
            }}
          >
            Subscription
          </Link>
          <Link
            href="#"
            style={{
              display: "block",
              padding: "var(--space-3)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--card-radius)",
              fontSize: 15,
              color: "var(--text)",
              textDecoration: "none",
            }}
          >
            Manage account
          </Link>
        </div>
      </section>
    </main>
  );
}
