"use client";

import { useCallback, useEffect, useState } from "react";
import { growthFetch } from "@/app/lib/growth/client";
import type { GrowthContentDraft } from "@/app/lib/growth/types";
import { CopyBtn, EmptyState } from "./shared";

type ContentStudioTabProps = {
  todayIso: string;
  onMessage: (msg: string) => void;
};

type GeneratedImage = { slide: number; label: string; url: string };

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

  async function runPack(mode: "content" | "images" | "all") {
    setLoading(true);
    try {
      const res = await growthFetch<{ message?: string }>("/api/admin/growth/scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: mode === "all" ? "all" : mode, scout_date: filterDate }),
      });
      onMessage(res.message ?? "Done.");
      await load();
    } catch (e) {
      onMessage(e instanceof Error ? e.message : "Failed.");
    } finally {
      setLoading(false);
    }
  }

  const fullPost = (d: GrowthContentDraft) =>
    [d.hook, d.body, d.cta, d.hashtags].filter(Boolean).join("\n\n");

  const tiktok = drafts.find((d) => d.platform === "TikTok");

  return (
    <section>
      <div className="growth-card growth-card-accent">
        <h2>Content Studio</h2>
        <p className="growth-muted">
          One place for X, TikTok, and Instagram. TikTok uses a Glam Up style before/after script slideshow
          (hook → blank brain → old words → app → new script → waitlist CTA). Generate Today on the Today tab
          runs everything, including slide images when OPENAI_API_KEY is set.
        </p>
        <div className="growth-form-grid growth-form-grid-compact">
          <label>
            Date
            <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          </label>
        </div>
        <div className="growth-card-actions">
          <button type="button" className="growth-btn growth-btn-primary" disabled={loading} onClick={() => runPack("all")}>
            {loading ? "Working…" : "Run full social pack"}
          </button>
          <button type="button" className="growth-btn" disabled={loading} onClick={() => runPack("images")}>
            Generate slide images only
          </button>
        </div>
      </div>

      {tiktok?.generated_images && (tiktok.generated_images as GeneratedImage[]).length > 0 ? (
        <div className="growth-card">
          <h3>TikTok / Instagram slides — download and post</h3>
          <p className="growth-muted">
            TikTok: Photo mode slideshow or import to CapCut. Audio: {tiktok.audio_suggestion ?? "pick calm trending sound"}
          </p>
          <div className="growth-slide-grid">
            {(tiktok.generated_images as GeneratedImage[]).map((img) => (
              <figure key={img.slide} className="growth-slide-figure">
                <img src={img.url} alt={`Slide ${img.slide}: ${img.label}`} className="growth-slide-img" />
                <figcaption>
                  {img.slide}. {img.label}{" "}
                  <a href={img.url} download={`phrasewell-slide-${img.slide}.png`} className="growth-slide-dl">
                    Download
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="growth-muted" style={{ marginTop: 12 }}>
            <strong>Post steps:</strong> Upload slides to TikTok → add suggested audio → paste caption + hashtags from
            TikTok draft below → link in bio phrasewell.net
          </p>
        </div>
      ) : tiktok ? (
        <div className="growth-card">
          <p className="growth-muted">
            No slide images yet. Add OPENAI_API_KEY in Vercel, then click Generate slide images only (takes ~1–2 min).
          </p>
        </div>
      ) : null}

      {drafts.length === 0 ? (
        <EmptyState
          title="No content drafts for this date"
          body='Click "Generate today (tasks + social pack)" on the Today tab.'
        />
      ) : (
        drafts.map((d) => {
          const slides = Array.isArray(d.image_prompts) ? d.image_prompts : [];
          const isVideo = d.platform === "TikTok" || d.platform === "Instagram";
          return (
            <div key={d.id} className="growth-card growth-content-draft-card">
              <div className="growth-scout-card-head">
                <h3>
                  {d.platform} · {d.content_type}
                  {d.behavior_title ? ` — ${d.behavior_title}` : ""}
                </h3>
                <span className="growth-tag">{d.status}</span>
              </div>
              {isVideo && d.on_screen_hook ? (
                <p className="growth-scout-excerpt">
                  <strong>On-screen hook:</strong> {d.on_screen_hook}
                </p>
              ) : null}
              {d.body ? (
                <div className="growth-scout-draft">
                  <strong>{isVideo ? "Caption" : "Post"}</strong>
                  <pre>{d.body}</pre>
                  <CopyBtn text={fullPost(d)} label="Copy caption + hashtags" />
                </div>
              ) : null}
              {d.hashtags ? (
                <p className="growth-muted">
                  <strong>Hashtags:</strong> {d.hashtags}
                </p>
              ) : null}
              {d.audio_suggestion ? (
                <p className="growth-muted">
                  <strong>Audio:</strong> {d.audio_suggestion}
                </p>
              ) : null}
              {d.video_script ? (
                <div className="growth-scout-draft">
                  <strong>Voiceover script</strong>
                  <pre>{d.video_script}</pre>
                  <CopyBtn text={d.video_script} label="Copy script" />
                </div>
              ) : null}
              {slides.length > 0 && !(d.generated_images as GeneratedImage[] | null)?.length ? (
                <div className="growth-scout-draft">
                  <strong>Slide outline</strong>
                  <ol className="growth-list">
                    {slides.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
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
