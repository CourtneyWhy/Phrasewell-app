"use client";

import type { AgeBand } from "@/app/lib/contentLibrary";

export const AGE_BAND_OPTIONS: { value: AgeBand; label: string }[] = [
  { value: "0-3", label: "0–3" },
  { value: "4-7", label: "4–7" },
  { value: "8-12", label: "8–12" },
  { value: "Teen", label: "Teen" },
];

type AgeSelectorProps = {
  value: AgeBand;
  onChange: (age: AgeBand) => void;
  compact?: boolean;
};

export function AgeSelector({ value, onChange, compact }: AgeSelectorProps) {
  return (
    <div>
      <p
        style={{
          fontSize: 13,
          color: "var(--muted)",
          marginBottom: 8,
          marginTop: 0,
          fontWeight: 600,
        }}
      >
        Age
      </p>
      <div role="group" aria-label="Age" style={{ display: "flex", flexWrap: "wrap", gap: compact ? 8 : 8 }}>
        {AGE_BAND_OPTIONS.map((a) => (
          <button
            key={a.value}
            type="button"
            onClick={() => onChange(a.value)}
            style={{
              padding: compact ? "6px 12px" : "10px 14px",
              borderRadius: 20,
              border: value === a.value ? "1px solid var(--accent)" : "1px solid var(--border)",
              background: value === a.value ? "var(--accent-soft)" : "var(--surface)",
              color: "var(--text)",
              fontSize: compact ? 13 : 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
