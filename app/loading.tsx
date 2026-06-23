export default function Loading() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      style={{ backgroundColor: "var(--page-bg)" }}
    >
      <p className="text-[var(--text-muted)]" style={{ fontSize: "15px" }}>
        Loading…
      </p>
    </div>
  );
}
