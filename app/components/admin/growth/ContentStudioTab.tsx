"use client";

import { useCallback, useEffect, useState } from "react";
import { growthFetch } from "@/app/lib/growth/client";
import type { GrowthContentDraft } from "@/app/lib/growth/types";
import { CopyBtn, EmptyState } from "./shared";

type ContentStudioTabProps = {
  todayIso: string;
  onMessage: (msg: string) => void;
};

export function ContentStudioTab({ todayIso, onMessage }: ContentStudioTabProps) {
  const [drafts, setDrafts] = useState<GrowthContentDraft[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterDate, setFilterDate] = useState(todayIso);

  const load = useCallback(async () => {
    try {
      const res = await growthFetch<{ data: GrowthContentDraft[] }>(
        `/api/admin/growth/content-drafts?date=${filterDate}`,
      );
      setDrafts(res.data ?? []);
    } catch {
      setDrafts([]);
    }
  }, [filterDate]);

  useEffect(() => {
    load();
  }, [load]);

  async function generate() {
    setLoading(true);
    try {
      const res = await growthFetch<{ message?: string }>("/api/admin/growth/scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "content", scout_date: filterDate }),
      });
      onMessage(res.message ?? "Content generated.");
      await load();
    } catch (e) {
      onMessage(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  }

  const fullPost = (d: GrowthContentDraft) =>
    [d.hook, d.body, d.cta].filter(Boolean).join("\n\n");

  return (
    <section>
      <div className="growth-card">
        <h2>Content Studio</h2>
        <p className="growth-muted">
          Daily drafts for X, LinkedIn, TikTok, Instagram, and Pinterest based on your checklist and content
          pipeline. Video platforms include slide prompts + scripts for Canva/CapCut.
        </p>
        <div className="growth-form-grid growth-form-grid-compact">
          <label>
            Draft date
            <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          </label>
        </div>
        <div className="growth-card-actions">
          <button type="button" className="growth-btn growth-btn-primary" disabled={loading} onClick={generate}>
            {loading ? "Generating…" : "Generate today's content"}
          </button>
        </div>
      </div>

      {drafts.length === 0 ? (
        <EmptyState
          title="No content drafts for this date"
          body="Generate Today's Tasks on the Today tab (includes content drafts), or click Generate above."
        />
      ) : (
        drafts.map((d) => {
          const slides = Array.isArray(d.image_prompts) ? d.image_prompts : [];
          return (
            <div key={d.id} className="growth-card growth-content-draft-card">
              <div className="growth-scout-card-head">
                <h3>
                  {d.platform} · {d.content_type}
                  {d.behavior_title ? ` — ${d.behavior_title}` : ""}
                </h3>
                <span className="growth-tag">{d.status}</span>
              </div>
              {d.source_task_title ? (
                <p className="growth-muted">From task: {d.source_task_title}</p>
              ) : null}
              {d.hook ? <p className="growth-scout-excerpt"><strong>Hook:</strong> {d.hook}</p> : null}
              {d.body ? (
                <div className="growth-scout-draft">
                  <pre>{d.body}</pre>
                  <CopyBtn text={fullPost(d)} label="Copy full post" />
                </div>
              ) : null}
              {d.cta ? <p className="growth-muted"><strong>CTA:</strong> {d.cta}</p> : null}
              {slides.length > 0 ? (
                <div className="growth-scout-draft">
                  <strong>Image / slide prompts</strong>
                  <ol className="growth-list">
                    {slides.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                  <CopyBtn text={slides.join("\n\n")} label="Copy slide prompts" />
                </div>
              ) : null}
              {d.video_script ? (
                <div className="growth-scout-draft">
                  <strong>Video script</strong>
                  <pre>{d.video_script}</pre>
                  <CopyBtn text={d.video_script} label="Copy script" />
                </div>
              ) : null}
              {d.notes ? <p className="growth-muted">{d.notes}</p> : null}
            </div>
          );
        })
      )}
    </section>
  );
}
