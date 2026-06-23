type SaveHeartButtonProps = {
  saved: boolean;
  onClick: () => void;
};

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? "0" : "2"}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/** Save toggle on Moment Cards — filled sand heart when saved. */
export function SaveHeartButton({ saved, onClick }: SaveHeartButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={saved ? "Unsave phrase" : "Save phrase"}
      aria-pressed={saved}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 44,
        height: 44,
        padding: 0,
        border: saved ? "1px solid var(--accent)" : "1px solid var(--border)",
        background: saved ? "var(--accent-soft)" : "var(--surface)",
        color: saved ? "var(--accent)" : "var(--muted)",
        cursor: "pointer",
        borderRadius: "50%",
        flexShrink: 0,
        transition: "background 0.18s ease, color 0.18s ease, border-color 0.18s ease",
      }}
    >
      <HeartIcon filled={saved} />
    </button>
  );
}
