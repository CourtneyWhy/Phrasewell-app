"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { growthFetch } from "@/app/lib/growth/client";
import { CATEGORIES } from "@/app/lib/behavior-catalog";
import { contentReuseChecklist, PIPELINE_STAGES } from "@/app/lib/growth/content-pipeline";
import type { GrowthContentPipeline, PipelineStatus } from "@/app/lib/growth/types";
import { CopyBtn, EmptyState, ExportBtn, patchRow, StatCard } from "./shared";

const STAGE_STATUS: { value: PipelineStatus; label: string }[] = [
  { value: "not_started", label: "Not started" },
  { value: "drafted", label: "Drafted" },
  { value: "approved", label: "Approved" },
  { value: "scheduled", label: "Scheduled" },
  { value: "posted", label: "Posted" },
];

function stageKey(stage: string) {
  return `${stage}_status` as keyof GrowthContentPipeline;
}

export function ContentEngineTab({ onMessage }: { onMessage: (msg: string) => void }) {
  const [rows, setRows] = useState<GrowthContentPipeline[]>([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = category ? `?category=${category}` : "";
      const res = await growthFetch<{ data: GrowthContentPipeline[] }>(`/api/admin/growth/content-pipeline${q}`);
      setRows(res.data ?? []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  const summary = useMemo(() => {
    const total = rows.length;
    const blogDone = rows.filter((r) => r.blog_status === "posted").length;
    const anyStarted = rows.filter((r) =>
      PIPELINE_STAGES.some((s) => r[stageKey(s.id)] !== "not_started"),
    ).length;
    return { total, blogDone, anyStarted };
  }, [rows]);

  async function updateStage(row: GrowthContentPipeline, stage: string, status: PipelineStatus) {
    await patchRow("content-pipeline", row.id, { [stageKey(stage)]: status });
    load();
  }

  return (
    <section>
      <div className="growth-card growth-card-muted">
        <h2>Content Engine — production pipeline</h2>
        <p className="growth-muted">
          Every Phrasewell behavior becomes a reusable asset. Blog first, then repurpose to all channels.
          Nothing posts automatically — you review and publish.
        </p>
        <div className="growth-pipeline-diagram">
          {PIPELINE_STAGES.map((s, i) => (
            <span key={s.id}>
              {i > 0 ? " → " : ""}
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="growth-stat-grid">
        <StatCard label="Behaviors" value={summary.total || "—"} sub="In pipeline" />
        <StatCard label="Blogs posted" value={summary.blogDone} />
        <StatCard label="In progress" value={summary.anyStarted} />
        <StatCard label="Categories" value={CATEGORIES.length} />
      </div>

      <div className="growth-card">
        <div className="growth-card-head">
          <h2>Pipeline by behavior</h2>
          <div className="growth-filters">
            <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
            <ExportBtn rows={rows as unknown as Record<string, unknown>[]} filename="content-pipeline.csv" />
          </div>
        </div>

        {loading ? <p className="growth-muted">Loading…</p> : null}
        {!loading && !rows.length ? (
          <EmptyState
            title="No pipeline data"
            body='Go to Email Marketing tab → "Load email seed data" (includes all behaviors). Run migration 005 first.'
          />
        ) : (
          <div className="growth-table-wrap">
            <table className="growth-table growth-table-pipeline">
              <thead>
                <tr>
                  <th>Behavior</th>
                  <th>Category</th>
                  {PIPELINE_STAGES.map((s) => (
                    <th key={s.id}>{s.label}</th>
                  ))}
                  <th>Reuse</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td><strong>{row.behavior_title}</strong></td>
                    <td className="growth-cell-notes">{row.category_title}</td>
                    {PIPELINE_STAGES.map((s) => (
                      <td key={s.id}>
                        <select
                          className="growth-pipeline-select"
                          value={String(row[stageKey(s.id)] ?? "not_started")}
                          onChange={(e) => updateStage(row, s.id, e.target.value as PipelineStatus)}
                          aria-label={`${s.label} status for ${row.behavior_title}`}
                        >
                          {STAGE_STATUS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label.slice(0, 4)}</option>
                          ))}
                        </select>
                      </td>
                    ))}
                    <td>
                      <button
                        type="button"
                        className="growth-btn growth-btn-sm growth-btn-secondary"
                        onClick={() => setExpanded(expanded === row.id ? null : row.id)}
                      >
                        {expanded === row.id ? "Hide" : "Plan"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {expanded && rows.find((r) => r.id === expanded) ? (
          <div className="growth-card growth-card-muted" style={{ marginTop: 16 }}>
            <h3>Content reuse — {rows.find((r) => r.id === expanded)!.behavior_title}</h3>
            <ul className="growth-list">
              {contentReuseChecklist(
                rows.find((r) => r.id === expanded)!.behavior_title,
                rows.find((r) => r.id === expanded)!.category_title,
              ).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <CopyBtn
              text={contentReuseChecklist(
                rows.find((r) => r.id === expanded)!.behavior_title,
                rows.find((r) => r.id === expanded)!.category_title,
              ).join("\n")}
              label="Copy reuse checklist"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
