import { Card } from "@/app/components/Card";
import { PageTitle } from "@/app/components/PageTitle";
import { SectionLabel } from "@/app/components/SectionLabel";

export default function HistoryPage() {
  return (
    <main className="app-container" style={{ paddingTop: "var(--space-3)", paddingBottom: "var(--space-5)" }}>
      <PageTitle>History</PageTitle>
      <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 0, marginBottom: "var(--space-4)" }}>
        Your logged moments will appear here, grouped by date.
      </p>
      <Card>
        <SectionLabel>No history yet</SectionLabel>
        <p style={{ fontSize: 14, color: "var(--muted)", marginTop: "var(--space-2)", lineHeight: 1.5 }}>
          When you use a script from the app, it can be saved here for quick reference later.
        </p>
      </Card>
    </main>
  );
}
