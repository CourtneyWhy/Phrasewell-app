/** Consistent page heading across app screens. */
export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1
      className="font-heading font-normal"
      style={{
        fontSize: 20,
        color: "var(--text)",
        marginBottom: "var(--space-4)",
        marginTop: 0,
      }}
    >
      {children}
    </h1>
  );
}
