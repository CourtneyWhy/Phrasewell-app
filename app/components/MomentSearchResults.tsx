"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { AgeBand, MomentId } from "@/app/lib/contentLibrary";
import { searchMoments, SEARCH_NO_MATCH_MESSAGE } from "@/app/lib/contentLibrary";
import { buildBehaviorHref } from "@/app/lib/app-defaults";
import { getMomentLabel } from "@/app/lib/moments";
import { SectionLabel } from "@/app/components/SectionLabel";

type MomentSearchResultsProps = {
  query: string;
  momentId?: MomentId;
  ageBand?: AgeBand;
  compact?: boolean;
};

export function MomentSearchResults({ query, momentId, ageBand, compact }: MomentSearchResultsProps) {
  const results = useMemo(() => searchMoments(query), [query]);
  const trimmed = query.trim();

  if (!trimmed) return null;

  if (results.length === 0) {
    return (
      <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5, marginTop: compact ? 8 : 0 }}>
        {SEARCH_NO_MATCH_MESSAGE}
      </p>
    );
  }

  return (
    <div style={{ marginTop: compact ? 8 : 0 }}>
      <SectionLabel>Closest matches</SectionLabel>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
        }}
      >
        {results.map(({ card, catalogBehaviorId, catalogCategoryId }) => (
          <li key={card.id}>
            <Link
              href={buildBehaviorHref(catalogBehaviorId, catalogCategoryId, {
                cardId: card.id,
                momentId: momentId ?? card.moment_id,
                ageBand: ageBand ?? card.age_band,
              })}
              className="list-row"
              style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}
            >
              <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
                {card.behavior_name}
              </span>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>
                {card.category_name} · {getMomentLabel(momentId ?? card.moment_id)} ·{" "}
                {ageBand ?? card.age_band}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
