"use client";

import Link from "next/link";

type HelpTopBarProps = {
  backHref: string;
  backLabel?: string;
};

/** Help flow header: Back on the left, Home on the right. */
export function HelpTopBar({ backHref, backLabel = "← Back" }: HelpTopBarProps) {
  return (
    <nav
      aria-label="Help navigation"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto",
        alignItems: "center",
        columnGap: 16,
        width: "100%",
        minHeight: 44,
        marginBottom: "var(--space-2)",
        boxSizing: "border-box",
      }}
    >
      <Link
        href={backHref}
        style={{
          fontSize: 14,
          color: "var(--muted)",
          textDecoration: "none",
          padding: "8px 0",
          justifySelf: "start",
          minWidth: 0,
        }}
      >
        {backLabel}
      </Link>
      <Link
        href="/app"
        aria-label="Go to Home"
        style={{
          display: "inline-block",
          fontSize: 14,
          lineHeight: "20px",
          color: "var(--text)",
          textDecoration: "none",
          padding: "8px 12px",
          fontWeight: 500,
          justifySelf: "end",
          minWidth: 56,
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        {"Home"}
      </Link>
    </nav>
  );
}
