"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CategoryLineIcon } from "@/app/components/CategoryLineIcon";

type CategoryRowProps = {
  categoryId: string;
  title: string;
  href: string;
  /** Optional pin control rendered inside the row (Home only). */
  pinControl?: React.ReactNode;
};

/** Shared category row — Home primary and Search/All use the same visual. */
export function CategoryRow({ categoryId, title, href, pinControl }: CategoryRowProps) {
  return (
    <div style={{ position: "relative" }}>
      <Link
        href={href}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          minHeight: 52,
          padding: "var(--space-3) var(--space-4)",
          paddingRight: pinControl ? 52 : "var(--space-4)",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderLeft: "3px solid var(--sand-border)",
          borderRadius: 16,
          boxShadow: "var(--shadow-soft)",
          textDecoration: "none",
          color: "var(--text)",
          fontSize: 15,
          fontWeight: 500,
        }}
      >
        <CategoryLineIcon categoryId={categoryId} />
        <span style={{ flex: 1, minWidth: 0 }}>{title}</span>
        <ChevronRight
          size={18}
          strokeWidth={1.5}
          style={{ flexShrink: 0, color: "var(--muted)", opacity: 0.6 }}
        />
      </Link>
      {pinControl != null && (
        <div
          style={{
            position: "absolute",
            right: "var(--space-2)",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {pinControl}
        </div>
      )}
    </div>
  );
}
