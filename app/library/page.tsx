import { ListRow } from "@/app/components/ListRow";
import { getBrowseCategories } from "@/app/lib/behavior-catalog";
import { PageTitle } from "@/app/components/PageTitle";
import { SectionLabel } from "@/app/components/SectionLabel";

export default function LibraryPage() {
  const categories = getBrowseCategories();

  return (
    <main className="app-container" style={{ paddingTop: "var(--space-3)", paddingBottom: "var(--space-5)" }}>
      <PageTitle>Library</PageTitle>
      <SectionLabel>Search</SectionLabel>
      <input
        type="search"
        placeholder="Search categories…"
        className="app-card"
        style={{
          width: "100%",
          marginBottom: "var(--space-4)",
          padding: "12px 16px",
          borderRadius: "var(--btn-radius)",
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: "var(--text)",
          fontSize: 15,
        }}
        aria-label="Search categories"
      />
      <SectionLabel>Browse by category</SectionLabel>
      <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        {categories.map((c) => (
          <li key={c.id}>
            <ListRow href={`/app/category/${c.id}`} title={c.title} />
          </li>
        ))}
      </ul>
    </main>
  );
}
