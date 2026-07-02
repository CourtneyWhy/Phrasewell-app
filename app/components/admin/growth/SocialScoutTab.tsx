"use client";

import { useCallback, useEffect, useState } from "react";
import { growthFetch } from "@/app/lib/growth/client";
import type { GrowthSocialOpportunity, SocialOpportunityStatus } from "@/app/lib/growth/types";
import { CopyBtn, EmptyState, patchRow } from "./shared";

type SocialScoutTabProps = {
  todayIso: string;
  onMessage: (msg: string) => void;
};

const STATUSES: { value: SocialOpportunityStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "skipped", label: "Skipped" },
];

export function SocialScoutTab({ todayIso, onMessage }: SocialScoutTabProps) {
  const [rows, setRows] = useState<GrowthSocialOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterDate, setFilterDate] = useState(todayIso);

  const load = useCallback(async () => {
    try {
      const res = await growthFetch<{ data: GrowthSocialOpportunity[] }>(
        `/api/admin/growth/social-scout?date=${filterDate}`,
      );
      setRows(res.data ?? []);
    } catch {
      setRows([]);
    }
  }, [filterDate]);

  useEffect(() => {
    load();
  }, [load]);

  async function runScout(mode: "all" | "reddit" | "x") {
    setLoading(true);
    try {
      const res = await growthFetch<{ message?: string }>("/api/admin/growth/scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, scout_date: filterDate }),
      });
      onMessage(res.message ?? "Scout complete.");
      await load();
    } catch (e) {
      onMessage(e instanceof Error ? e.message : "Scout failed.");
    } finally {
      setLoading(false);
    }
  }

  async function setStatus(row: GrowthSocialOpportunity, status: SocialOpportunityStatus) {
    await patchRow("social-scout", row.id, { status });
    onMessage(`Marked ${status}.`);
    load();
  }

  const reddit = rows.filter((r) => r.platform === "reddit");
  const xRows = rows.filter((r) => r.platform === "x");

  function OpportunityList({ items, platform }: { items: GrowthSocialOpportunity[]; platform: string }) {
    if (items.length === 0) {
      return (
        <EmptyState
          title={`No ${platform} opportunities for this date`}
          body='Click "Run scout" or Generate Today&apos;s Tasks on the Today tab.'
        />
      );
    }
    return (
      <ul className="growth-scout-list">
        {items.map((row) => (
          <li key={row.id} className="growth-scout-card">
            <div className="growth-scout-card-head">
              <div>
                <span className="growth-tag">{row.source_name ?? platform}</span>
                {row.relevance_score != null ? (
                  <span className="growth-muted"> · score {row.relevance_score}</span>
                ) : null}
              </div>
              <select
                value={row.status}
                onChange={(e) => setStatus(row, e.target.value as SocialOpportunityStatus)}
                aria-label="Status"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <h3 className="growth-scout-title">
              <a href={row.thread_url} target="_blank" rel="noopener noreferrer">
                {row.thread_title ?? "Open thread"} ↗
              </a>
            </h3>
            {row.thread_excerpt ? <p className="growth-muted growth-scout-excerpt">{row.thread_excerpt}</p> : null}
            {row.draft_response ? (
              <div className="growth-scout-draft">
                <pre>{row.draft_response}</pre>
                <CopyBtn text={row.draft_response} label="Copy draft" />
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section>
      <div className="growth-card">
        <h2>Social Scout</h2>
        <p className="growth-muted">
          Reddit: r/SpecialNeedsChildren, r/Mommit, r/AdoptiveParents, r/Parenting. X uses Serper for
          direct post links (x.com/user/status/…). Each reply is customized to that post. Re-run scout to
          refresh drafts. With OPENAI_API_KEY, replies are further personalized.
        </p>
        <div className="growth-form-grid growth-form-grid-compact">
          <label>
            Scout date
            <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          </label>
        </div>
        <div className="growth-card-actions">
          <button type="button" className="growth-btn growth-btn-primary" disabled={loading} onClick={() => runScout("all")}>
            {loading ? "Scouting…" : "Run scout (Reddit + X)"}
          </button>
          <button type="button" className="growth-btn" disabled={loading} onClick={() => runScout("reddit")}>
            Reddit only
          </button>
          <button type="button" className="growth-btn" disabled={loading} onClick={() => runScout("x")}>
            X only
          </button>
        </div>
      </div>

      <div className="growth-card">
        <h3>Reddit threads ({reddit.length})</h3>
        <OpportunityList items={reddit} platform="Reddit" />
      </div>

      <div className="growth-card">
        <h3>X opportunities ({xRows.length})</h3>
        <p className="growth-muted" style={{ marginBottom: 12 }}>
          Direct post links via Serper. Each reply is written for that specific post. Re-run scout to refresh.
        </p>
        <OpportunityList items={xRows} platform="X" />
      </div>
    </section>
  );
}
