"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PinIcon } from "@/app/components/PinIcon";
import { isPinnedBehavior, togglePinnedBehavior } from "@/app/lib/pins";
import { buildBehaviorHref } from "@/app/lib/app-defaults";
import type { AgeBand, MomentId } from "@/app/lib/contentLibrary";
import type { Behavior } from "@/app/lib/behavior-catalog";

function CardChevron() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, opacity: 0.5, color: "var(--muted)" }}
      aria-hidden
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function BehaviorList({
  behaviors,
  categoryId,
  momentId,
  ageBand,
}: {
  behaviors: Behavior[];
  categoryId: string;
  momentId?: string;
  ageBand?: string;
}) {
  const [, setTick] = useState(0);
  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  if (behaviors.length === 0) return null;

  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
      }}
    >
      {behaviors.map((b) => (
        <li key={b.id}>
          <Link
            href={buildBehaviorHref(b.id, categoryId, {
              momentId: momentId as MomentId | undefined,
              ageBand: ageBand as AgeBand | undefined,
            })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              minHeight: 44,
              padding: "var(--space-3) var(--space-4)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderLeft: "3px solid var(--sand-border)",
              borderRadius: "var(--card-radius)",
              boxShadow: "var(--shadow-soft)",
              textDecoration: "none",
              color: "inherit",
            }}
            className="subcategory-tile"
          >
            <span
              className="subcategory-tile-title"
              style={{
                flex: 1,
                minWidth: 0,
                fontSize: "16px",
                fontWeight: 500,
                color: "var(--text)",
              }}
            >
              {b.title}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                togglePinnedBehavior(b.id, categoryId);
                refresh();
              }}
              aria-label={isPinnedBehavior(b.id, categoryId) ? "Unpin" : "Pin"}
              style={{
                padding: 8,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <PinIcon pinned={isPinnedBehavior(b.id, categoryId)} size={18} />
            </button>
            <CardChevron />
          </Link>
        </li>
      ))}
    </ul>
  );
}
