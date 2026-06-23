"use client";

import Link from "next/link";
import { useSavedPhrases } from "@/app/contexts/SavedPhrasesContext";
import { Card } from "@/app/components/Card";
import { HelpTopBar } from "@/app/components/HelpTopBar";
import { PageTitle } from "@/app/components/PageTitle";
import { getMomentLabel } from "@/app/lib/moments";

function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function formatAge(age: string): string {
  if (age === "teen") return "Teen";
  return age;
}

function previewText(phrase: string, maxLen = 140): string {
  const t = phrase.replace(/\s+/g, " ").trim();
  return t.length > maxLen ? t.slice(0, maxLen - 1) + "…" : t;
}

export default function SavedPage() {
  const { savedEntries, removeSaved } = useSavedPhrases();

  const handleUnsave = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeSaved(id);
  };

  return (
    <main className="app-container" style={{ paddingTop: "var(--space-3)", paddingBottom: 100 }}>
      <HelpTopBar backHref="/app" backLabel="← Back" />
      <PageTitle>Saved phrases</PageTitle>

      {savedEntries.length === 0 ? (
        <div style={{ marginTop: 48, textAlign: "center" }}>
          <p
            style={{
              fontSize: "14px",
              color: "var(--muted)",
              lineHeight: 1.5,
              margin: "0 0 24px",
            }}
          >
            No saved phrases yet. Save a helpful script from any moment card to find it here.
          </p>
          <Link
            href="/app"
            className="app-btn-primary"
            style={{
              display: "inline-flex",
              textDecoration: "none",
            }}
          >
            Go to Home
          </Link>
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {savedEntries.map((entry) => (
            <li key={entry.id}>
              <Link
                href={`/app/behavior/${entry.behaviorId}?categoryId=${encodeURIComponent(entry.categoryId)}&savedId=${encodeURIComponent(entry.id)}`}
                className="saved-entry-link block"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card
                  style={{
                    padding: "var(--space-3) var(--space-4)",
                    margin: 0,
                    borderLeft: "3px solid var(--sand-border)",
                    transition: "opacity 0.18s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "15px",
                          fontWeight: 500,
                          color: "var(--text)",
                          margin: 0,
                          lineHeight: 1.4,
                        }}
                      >
                        {previewText(entry.phrase)}
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "var(--muted)",
                          marginTop: 4,
                          marginBottom: 0,
                          lineHeight: 1.3,
                        }}
                      >
                        {entry.categoryLabel} · {entry.behaviorLabel} · {formatAge(entry.ageBand)} · {getMomentLabel(entry.momentId ?? entry.intensity)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleUnsave(e, entry.id)}
                      aria-label="Unsave"
                      style={{
                        padding: 6,
                        border: "none",
                        background: "transparent",
                        color: "var(--accent)",
                        cursor: "pointer",
                        flexShrink: 0,
                        transition: "transform 0.18s ease",
                      }}
                      className="saved-row-heart"
                    >
                      <HeartIcon filled />
                    </button>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
