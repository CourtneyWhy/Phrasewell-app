"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getBrowseCategories } from "@/app/lib/behavior-catalog";
import type { AgeBand, MomentId } from "@/app/lib/contentLibrary";
import { normalizeAgeBand, intensityToMomentId } from "@/app/lib/contentLibrary";
import { getAppDefaults } from "@/app/lib/app-defaults";
import { SEARCH_PLACEHOLDER } from "@/app/lib/moments";
import { CategoryRow } from "@/app/components/CategoryRow";
import { HelpTopBar } from "@/app/components/HelpTopBar";
import { MomentSearchResults } from "@/app/components/MomentSearchResults";
import { PageTitle } from "@/app/components/PageTitle";
import { SectionLabel } from "@/app/components/SectionLabel";
import { buildCategoryHref } from "@/app/lib/app-defaults";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [momentId, setMomentId] = useState<MomentId>("unsafe_right_now");
  const [ageBand, setAgeBand] = useState<AgeBand>("4-7");
  const allCategories = useMemo(() => getBrowseCategories(), []);

  useEffect(() => {
    const defaults = getAppDefaults();
    setMomentId(intensityToMomentId(searchParams.get("moment") ?? defaults.momentId));
    setAgeBand(normalizeAgeBand(searchParams.get("ageBand") ?? defaults.ageBand));
  }, [searchParams]);

  const isSearching = query.trim().length > 0;

  return (
    <main style={{ paddingTop: "var(--space-3)", paddingBottom: 100 }}>
      <HelpTopBar backHref="/app" backLabel="← Back" />
      <PageTitle>All categories</PageTitle>

      <input
        type="search"
        placeholder={SEARCH_PLACEHOLDER}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search what is happening"
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "var(--btn-radius)",
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: "var(--text)",
          fontSize: 15,
          marginBottom: "var(--space-4)",
          boxSizing: "border-box",
        }}
      />

      {isSearching ? (
        <MomentSearchResults query={query} momentId={momentId} ageBand={ageBand} />
      ) : (
        <>
          <SectionLabel>Browse by category</SectionLabel>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {allCategories.map((c) => (
              <li key={c.id}>
                <CategoryRow
                  categoryId={c.id}
                  title={c.title}
                  href={buildCategoryHref(c.id, { momentId, ageBand })}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
