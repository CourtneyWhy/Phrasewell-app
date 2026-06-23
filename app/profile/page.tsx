import { PageTitle } from "@/app/components/PageTitle";

export default function ProfilePage() {
  return (
    <main className="app-container" style={{ paddingTop: "var(--space-3)", paddingBottom: "var(--space-5)" }}>
      <PageTitle>Profile</PageTitle>
      <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 0 }}>
        Profile settings will appear here.
      </p>
    </main>
  );
}
