/** Temporary Lovable-style bowl + dot mark (SVG). Replace with final asset later. */
export function LandingBrandMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0, display: "block" }}
    >
      <circle cx="16" cy="9" r="3.5" fill="var(--accent)" />
      <path
        d="M6 22c0-5.523 4.477-10 10-10s10 4.477 10 10"
        stroke="var(--text)"
        strokeWidth="2.25"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
