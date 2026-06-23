"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGrid, ArrowRight } from "lucide-react";
import {
  PRIMARY_CATEGORY_IDS,
  getCategoryById,
  getBehaviorById,
} from "@/app/lib/behavior-catalog";
import type { AgeBand, MomentId } from "@/app/lib/contentLibrary";
import {
  MOMENT_CONTEXT_HEADER,
  MOMENT_OPTIONS,
  SEARCH_PLACEHOLDER,
} from "@/app/lib/moments";
import {
  getAppDefaults,
  setAppDefaults,
  buildCategoryHref,
  buildBehaviorHref,
} from "@/app/lib/app-defaults";
import { WordmarkLockup } from "@/app/components/WordmarkLockup";
import { SectionLabel } from "@/app/components/SectionLabel";
import { CategoryRow } from "@/app/components/CategoryRow";
import { PinIcon } from "@/app/components/PinIcon";
import { AgeSelector } from "@/app/components/AgeSelector";
import { MomentSearchResults } from "@/app/components/MomentSearchResults";
import {
  getPinned,
  isPinnedCategory,
  togglePinnedCategory,
  togglePinnedBehavior,
  type PinnedItem,
} from "@/app/lib/pins";

function usePinned() {
  const [items, setItems] = useState<PinnedItem[]>([]);
  const refresh = useCallback(() => setItems(getPinned()), []);
  useEffect(() => {
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, [refresh]);
  return { pinnedItems: items, refresh };
}

function PinnedPills({
  items,
  momentId,
  ageBand,
  onUnpin,
  onToast,
}: {
  items: PinnedItem[];
  momentId: MomentId;
  ageBand: AgeBand;
  onUnpin: () => void;
  onToast: (msg: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section style={{ marginBottom: "var(--space-3)" }}>
      <SectionLabel>Pinned</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
        {items.map((item) => {
          if (item.type === "category") {
            const cat = getCategoryById(item.id);
            if (!cat) return null;
            return (
              <span
                key={`cat-${item.id}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 20,
                  background: "var(--accent-soft)",
                  border: "1px solid var(--accent)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text)",
                }}
              >
                <Link
                  href={buildCategoryHref(item.id, { momentId, ageBand })}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {cat.title}
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    togglePinnedCategory(item.id);
                    onUnpin();
                    onToast("Unpinned");
                  }}
                  aria-label="Unpin"
                  style={{ padding: 0, border: "none", background: "transparent", cursor: "pointer", display: "flex" }}
                >
                  <PinIcon pinned size={14} />
                </button>
              </span>
            );
          }
          const behavior = getBehaviorById(item.id);
          const cat = getCategoryById(item.categoryId);
          if (!behavior || !cat) return null;
          return (
            <span
              key={`beh-${item.id}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 20,
                background: "var(--accent-soft)",
                border: "1px solid var(--accent)",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text)",
              }}
            >
              <Link
                href={buildBehaviorHref(item.id, item.categoryId, { momentId, ageBand })}
                style={{ textDecoration: "none", color: "inherit", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {behavior.title}
              </Link>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  togglePinnedBehavior(item.id, item.categoryId);
                  onUnpin();
                  onToast("Unpinned");
                }}
                aria-label="Unpin"
                style={{ padding: 0, border: "none", background: "transparent", cursor: "pointer", display: "flex" }}
              >
                <PinIcon pinned size={14} />
              </button>
            </span>
          );
        })}
      </div>
    </section>
  );
}

export function HomeContent() {
  const { pinnedItems, refresh } = usePinned();
  const [toast, setToast] = useState<string | null>(null);
  const [momentId, setMomentId] = useState<MomentId>("unsafe_right_now");
  const [ageBand, setAgeBand] = useState<AgeBand>("4-7");
  const [searchQuery, setSearchQuery] = useState("");
  const [defaultsLoaded, setDefaultsLoaded] = useState(false);

  useEffect(() => {
    const defaults = getAppDefaults();
    setMomentId(defaults.momentId);
    setAgeBand(defaults.ageBand);
    setDefaultsLoaded(true);
  }, []);

  useEffect(() => {
    if (!defaultsLoaded) return;
    setAppDefaults({ momentId, ageBand });
  }, [momentId, ageBand, defaultsLoaded]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1500);
    return () => clearTimeout(t);
  }, [toast]);

  const pinnedCategoryIds = new Set(
    pinnedItems.filter((p): p is PinnedItem & { type: "category" } => p.type === "category").map((p) => p.id)
  );
  const primaryTiles = PRIMARY_CATEGORY_IDS.filter((id) => !pinnedCategoryIds.has(id)).map((id) =>
    getCategoryById(id)
  ).filter(Boolean);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <>
      <WordmarkLockup />

      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "var(--bg)",
          paddingTop: "var(--space-2)",
          paddingBottom: "var(--space-2)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ marginBottom: "var(--space-3)" }}>
          <AgeSelector
            value={ageBand}
            onChange={setAgeBand}
            compact
          />
        </div>

        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8, marginTop: 0, fontWeight: 600 }}>
          {MOMENT_CONTEXT_HEADER}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
          {MOMENT_OPTIONS.map((mode) => {
            const selected = momentId === mode.id;
            const isSafety = mode.safety === true;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setMomentId(mode.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 20,
                  border: `1px solid ${selected && isSafety ? "var(--safety-outline)" : selected ? "var(--accent)" : "var(--border)"}`,
                  background: selected
                    ? isSafety
                      ? "rgba(197, 48, 48, 0.08)"
                      : "var(--accent-soft)"
                    : "var(--surface)",
                  color: "var(--text)",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {mode.label}
              </button>
            );
          })}
        </div>

        <input
          type="search"
          placeholder={SEARCH_PLACEHOLDER}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search what is happening"
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "var(--btn-radius)",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
            fontSize: 14,
            boxSizing: "border-box",
          }}
        />

        {isSearching && (
          <div style={{ marginTop: "var(--space-2)" }}>
            <MomentSearchResults query={searchQuery} momentId={momentId} ageBand={ageBand} compact />
          </div>
        )}
      </div>

      {!isSearching && (
        <div style={{ paddingTop: "var(--space-4)" }}>
          {pinnedItems.length > 0 && (
            <PinnedPills
              items={pinnedItems}
              momentId={momentId}
              ageBand={ageBand}
              onUnpin={refresh}
              onToast={(msg) => setToast(msg)}
            />
          )}

          <section style={{ marginBottom: "var(--space-4)" }}>
            <SectionLabel>Primary</SectionLabel>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {primaryTiles.map((cat) =>
                cat ? (
                  <li key={cat.id}>
                    <CategoryRow
                      categoryId={cat.id}
                      title={cat.title}
                      href={buildCategoryHref(cat.id, { momentId, ageBand })}
                      pinControl={
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const nowPinned = togglePinnedCategory(cat.id);
                            refresh();
                            setToast(nowPinned ? "Pinned" : "Unpinned");
                          }}
                          aria-label={isPinnedCategory(cat.id) ? "Unpin" : "Pin"}
                          style={{ padding: 8, border: "none", background: "transparent", cursor: "pointer" }}
                        >
                          <PinIcon pinned={isPinnedCategory(cat.id)} size={18} />
                        </button>
                      }
                    />
                  </li>
                ) : null
              )}
            </ul>
          </section>

          <section>
            <Link
              href={`/app/search?ageBand=${encodeURIComponent(ageBand)}&moment=${encodeURIComponent(momentId)}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                minHeight: 52,
                padding: "var(--space-3) var(--space-4)",
                background: "var(--text)",
                border: "none",
                borderRadius: 16,
                boxShadow: "var(--shadow-soft)",
                textDecoration: "none",
                color: "var(--bg)",
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              <LayoutGrid size={20} strokeWidth={1.5} style={{ flexShrink: 0, opacity: 0.85 }} />
              <span style={{ flex: 1 }}>All categories</span>
              <ArrowRight size={18} strokeWidth={1.5} style={{ flexShrink: 0, color: "var(--accent)" }} />
            </Link>
          </section>
        </div>
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: 96,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "8px 16px",
            background: "var(--text)",
            color: "var(--bg)",
            fontSize: "13px",
            borderRadius: "var(--btn-radius)",
            zIndex: 50,
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          {toast}
        </div>
      )}
    </>
  );
}
