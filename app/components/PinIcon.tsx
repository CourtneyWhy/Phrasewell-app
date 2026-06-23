"use client";

import { Pin } from "lucide-react";

/** Lucide Pin. Brass stroke when pinned, muted when not; pinned row can use accent-soft tint. */
export function PinIcon({ pinned, size = 18 }: { pinned: boolean; size?: number }) {
  return (
    <Pin
      size={size}
      strokeWidth={2}
      style={{
        flexShrink: 0,
        color: pinned ? "var(--accent)" : "var(--muted)",
      }}
      aria-hidden
    />
  );
}
