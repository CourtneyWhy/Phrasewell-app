/** Sentence-case section label (not ALL CAPS). */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-section-label"
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: "var(--muted)",
        marginBottom: "var(--space-2)",
        marginTop: 0,
      }}
    >
      {children}
    </h2>
  );
}
