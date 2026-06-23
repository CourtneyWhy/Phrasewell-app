export default function AppLoading() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      style={{ backgroundColor: "var(--page-bg)", paddingBottom: "var(--nav-bottom-height)" }}
    >
      <p className="text-[var(--text-muted)]" style={{ fontSize: "15px" }}>
        Loading…
      </p>
    </div>
  );
}
