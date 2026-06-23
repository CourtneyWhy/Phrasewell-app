"use client";

import { useChildren } from "@/app/contexts/ChildrenContext";

export function SelectedChildName() {
  const { children, selectedId } = useChildren();
  const selected = children.find((c) => c.id === selectedId);
  if (!selected) return null;
  return (
    <span className="font-medium text-[var(--text-muted)]" style={{ fontSize: "14px" }}>
      {selected.name}
    </span>
  );
}
