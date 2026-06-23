"use client";

import { useChildren } from "@/app/contexts/ChildrenContext";

function AvatarPlaceholder({ selected }: { selected: boolean }) {
  const size = selected ? 56 : 48;
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-[var(--border)]"
      style={{
        width: size,
        height: size,
        border: selected ? "2px solid var(--navy)" : "2px solid transparent",
        boxSizing: "border-box",
      }}
      aria-hidden
    >
      <svg
        width={size * 0.45}
        height={size * 0.45}
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--text-muted)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );
}

export function ChildCarousel() {
  const { children: list, selectedId, setSelectedId } = useChildren();

  if (list.length === 0) {
    return (
      <div className="flex items-center gap-2" style={{ padding: "var(--space-2) 0" }}>
        <AvatarPlaceholder selected />
        <span className="text-body-muted" style={{ fontSize: "14px" }}>
          Add a child in Profile
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex gap-4 overflow-x-auto pb-2"
        style={{
          paddingLeft: "4px",
          paddingRight: "4px",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
        role="tablist"
        aria-label="Select child"
      >
        {list.map((child) => {
          const selected = selectedId === child.id;
          return (
            <button
              key={child.id}
              type="button"
              onClick={() => setSelectedId(child.id)}
              className="flex flex-col items-center gap-2 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--navy)] focus:ring-offset-2"
              style={{ minWidth: 56 }}
              role="tab"
              aria-selected={selected}
              aria-label={`${child.name}, ${selected ? "selected" : "select"}`}
            >
              <AvatarPlaceholder selected={selected} />
              <span
                className="text-center font-medium text-[var(--charcoal)]"
                style={{ fontSize: "13px", maxWidth: 72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {child.name}
              </span>
            </button>
          );
        })}
      </div>
      {selectedId && (
        <p
          className="font-medium text-[var(--charcoal)]"
          style={{ fontSize: "15px" }}
        >
          {list.find((c) => c.id === selectedId)?.name ?? ""}
        </p>
      )}
    </div>
  );
}
