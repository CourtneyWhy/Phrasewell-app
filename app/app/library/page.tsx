import { ListRow } from "@/app/components/ListRow";
import { getBrowseCategories } from "@/app/lib/behavior-catalog";

export default function LibraryPage() {
  const categories = getBrowseCategories();
  return (
    <div style={{ paddingTop: "var(--space-3)", paddingBottom: "var(--space-5)" }}>
      <h1 className="font-heading font-normal text-[var(--text)]" style={{ fontSize: "20px" }}>
        Library
      </h1>
      <label className="text-label mb-2 mt-4 block">Search</label>
      <input
        type="search"
        placeholder="Search categories…"
        className="app-card mb-6 w-full px-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        style={{ borderRadius: "var(--card-radius)", border: "1px solid var(--border)", fontSize: "15px" }}
        aria-label="Search categories"
      />
      <p className="text-label mb-3">Browse by category</p>
      <ul className="flex flex-col gap-3" style={{ gap: "var(--space-3)" }}>
        {categories.map((c) => (
          <li key={c.id}>
            <ListRow href={`/app/category/${c.id}`} title={c.title} />
          </li>
        ))}
      </ul>
    </div>
  );
}
