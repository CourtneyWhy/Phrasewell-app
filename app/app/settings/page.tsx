"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageTitle } from "@/app/components/PageTitle";
import { SectionLabel } from "@/app/components/SectionLabel";
import { AgeSelector } from "@/app/components/AgeSelector";
import type { AgeBand, MomentId } from "@/app/lib/contentLibrary";
import { getAppDefaults, setAppDefaults } from "@/app/lib/app-defaults";
import { MOMENT_CONTEXT_HEADER, MOMENT_OPTIONS } from "@/app/lib/moments";

export default function SettingsPage() {
  const [ageBand, setAgeBand] = useState<AgeBand>("4-7");
  const [momentId, setMomentId] = useState<MomentId>("unsafe_right_now");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const defaults = getAppDefaults();
    setAgeBand(defaults.ageBand);
    setMomentId(defaults.momentId);
  }, []);

  function updateAge(next: AgeBand) {
    setAgeBand(next);
    setAppDefaults({ ageBand: next });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function updateMoment(next: MomentId) {
    setMomentId(next);
    setAppDefaults({ momentId: next });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <main className="app-container" style={{ paddingTop: "var(--space-3)", paddingBottom: 100 }}>
      <PageTitle>Settings</PageTitle>

      {saved ? (
        <p role="status" style={{ fontSize: 13, color: "var(--muted)", marginTop: -8, marginBottom: 16 }}>
          Saved
        </p>
      ) : null}

      <section style={{ marginBottom: "var(--space-4)" }}>
        <SectionLabel>Defaults</SectionLabel>
        <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 0, marginBottom: 16, lineHeight: 1.5 }}>
          Used when you start a new moment from Home or Search.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <AgeSelector value={ageBand} onChange={updateAge} />
          <div>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 10, fontWeight: 600, marginTop: 0 }}>
              {MOMENT_CONTEXT_HEADER}
            </p>
            <div role="group" aria-label={MOMENT_CONTEXT_HEADER} style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {MOMENT_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => updateMoment(m.id)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 20,
                    border:
                      momentId === m.id
                        ? m.id === "unsafe_right_now"
                          ? "1px solid var(--safety-outline)"
                          : "1px solid var(--accent)"
                        : "1px solid var(--border)",
                    background:
                      momentId === m.id
                        ? m.id === "unsafe_right_now"
                          ? "rgba(197, 48, 48, 0.08)"
                          : "var(--accent-soft)"
                        : "var(--surface)",
                    color: "var(--text)",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: "var(--space-4)" }}>
        <SectionLabel>Profile</SectionLabel>
        <Link href="/app/profile" className="app-link" style={{ fontSize: 15 }}>
          Profile & family →
        </Link>
      </section>

      <section style={{ marginBottom: "var(--space-4)" }}>
        <SectionLabel>Beta</SectionLabel>
        <div
          className="app-card"
          style={{ padding: "var(--space-4)", fontSize: 14, color: "var(--muted)", lineHeight: 1.55 }}
        >
          <p style={{ margin: "0 0 12px" }}>
            Signed in with your email. Your kids and preferences save to your account.
          </p>
          <Link href="/#beta" className="app-link" style={{ fontSize: 14 }}>
            Join the waitlist
          </Link>
          {" · "}
          <Link href="/" className="app-link" style={{ fontSize: 14 }}>
            Marketing site
          </Link>
        </div>
      </section>

      <section>
        <SectionLabel>Sign out of beta</SectionLabel>
        <button
          type="button"
          className="app-btn-primary"
          style={{ width: "100%", background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}
          onClick={async () => {
            const { createSupabaseBrowser } = await import("@/app/lib/supabase/browser");
            const supabase = createSupabaseBrowser();
            await supabase?.auth.signOut();
            await fetch("/api/beta-auth", { method: "DELETE" });
            window.location.href = "/app/login";
          }}
        >
          Leave app (clear beta access on this device)
        </button>
      </section>
    </main>
  );
}
