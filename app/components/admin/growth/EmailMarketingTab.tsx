"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { growthFetch } from "@/app/lib/growth/client";
import {
  EMAIL_TEMPLATES,
  FLOWS,
  FUTURE_FLOWS,
  FRIDAY_NEWSLETTER_IDEAS,
} from "@/app/lib/growth/email-data";
import { AGENT_PROMPTS } from "@/app/lib/growth/agent-prompts";
import { formatKlaviyoPasteBlock } from "@/app/lib/growth/email-klaviyo-copy";
import type {
  GrowthEmailAnalyticsDaily,
  GrowthEmailCampaign,
  GrowthEmailFlow,
  GrowthEmailFlowEmail,
  GrowthEmailLibraryItem,
  GrowthEmailSegment,
} from "@/app/lib/growth/types";
import { CopyBtn, EmptyState, ExportBtn, patchRow, SimpleBars, StatCard, StatusBadge } from "./shared";

const SUBTABS = [
  "Overview",
  "Segments",
  "Flows",
  "Campaign Calendar",
  "Email Library",
  "Templates",
  "Analytics",
] as const;

type OverviewData = {
  funnel: Array<{ id: string; label: string; count: number; conversion: number; dropOff: number }>;
  segments: GrowthEmailSegment[];
  launchTracker: {
    waitlist: number;
    betaInvited: number;
    betaActive: number;
    customers: number;
    revenue: number;
    emailSubscribers: number | null;
  };
  emailAnalytics: { latest: GrowthEmailAnalyticsDaily | null; trend: GrowthEmailAnalyticsDaily[]; avgOpenRate: number | null };
  topCampaign: GrowthEmailCampaign | null;
};

const FLOW_STATUS = [
  { value: "not_started", label: "Not started" },
  { value: "in_klaviyo", label: "In Klaviyo" },
  { value: "live", label: "Live" },
  { value: "paused", label: "Paused" },
];

const EMAIL_STATUS = [
  { value: "idea", label: "Idea" },
  { value: "drafted", label: "Drafted" },
  { value: "in_klaviyo", label: "In Klaviyo" },
  { value: "live", label: "Live" },
  { value: "sent", label: "Sent" },
];

function fmtMoney(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function EmailMarketingTab({ onMessage }: { onMessage: (msg: string) => void }) {
  const [sub, setSub] = useState<(typeof SUBTABS)[number]>("Overview");
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [segments, setSegments] = useState<GrowthEmailSegment[]>([]);
  const [flows, setFlows] = useState<GrowthEmailFlow[]>([]);
  const [flowEmails, setFlowEmails] = useState<GrowthEmailFlowEmail[]>([]);
  const [campaigns, setCampaigns] = useState<GrowthEmailCampaign[]>([]);
  const [library, setLibrary] = useState<GrowthEmailLibraryItem[]>([]);
  const [analytics, setAnalytics] = useState<GrowthEmailAnalyticsDaily[]>([]);
  const [selectedFlow, setSelectedFlow] = useState("");
  const [loading, setLoading] = useState(false);

  const [analyticsForm, setAnalyticsForm] = useState<Partial<GrowthEmailAnalyticsDaily>>({
    metric_date: new Date().toISOString().slice(0, 10),
  });
  const subnavRef = useRef<HTMLDivElement>(null);

  const loadOverview = useCallback(async () => {
    try {
      const data = await growthFetch<OverviewData>("/api/admin/growth/email/overview");
      setOverview(data);
    } catch {
      setOverview(null);
    }
  }, []);

  const loadTable = useCallback(async (table: string, setter: (rows: never[]) => void, extra = "") => {
    setLoading(true);
    try {
      const res = await growthFetch<{ data: never[] }>(`/api/admin/growth/${table}${extra}`);
      setter(res.data ?? []);
    } catch {
      setter([] as never[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    const subnav = subnavRef.current;
    if (!subnav) return;

    const syncSubnavHeight = () => {
      subnav.style.setProperty("--growth-sticky-subnav-height", `${subnav.offsetHeight}px`);
    };

    syncSubnavHeight();
    const observer = new ResizeObserver(syncSubnavHeight);
    observer.observe(subnav);
    window.addEventListener("resize", syncSubnavHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncSubnavHeight);
    };
  }, []);

  useEffect(() => {
    if (sub === "Overview") loadOverview();
    if (sub === "Segments") loadTable("email-segments", setSegments as (r: never[]) => void);
    if (sub === "Flows") {
      loadTable("email-flows", setFlows as (r: never[]) => void);
      loadTable("email-flow-emails", setFlowEmails as (r: never[]) => void);
    }
    if (sub === "Campaign Calendar") loadTable("email-campaigns", setCampaigns as (r: never[]) => void);
    if (sub === "Email Library") loadTable("email-library", setLibrary as (r: never[]) => void);
    if (sub === "Analytics") loadTable("email-analytics", setAnalytics as (r: never[]) => void);
  }, [sub, loadTable, loadOverview]);

  async function seedEmail() {
    try {
      const res = await growthFetch<{ ok: boolean; segments: number; pipeline: number }>(
        "/api/admin/growth/seed-email",
        { method: "POST" },
      );
      onMessage(`Email CRM seeded: ${res.segments} segments, ${res.pipeline} pipeline behaviors.`);
      loadOverview();
    } catch (e) {
      onMessage(e instanceof Error ? e.message : "Seed failed — run migration 005 first.");
    }
  }

  async function refreshEmailCopy() {
    try {
      const res = await growthFetch<{ ok: boolean; updated: number }>(
        "/api/admin/growth/refresh-email-copy",
        { method: "POST" },
      );
      onMessage(`Refreshed ${res.updated} emails with full copy + graphic notes.`);
      if (sub === "Email Library") loadTable("email-library", setLibrary as (r: never[]) => void);
      if (sub === "Flows") {
        loadTable("email-flows", setFlows as (r: never[]) => void);
        loadTable("email-flow-emails", setFlowEmails as (r: never[]) => void);
      }
    } catch (e) {
      onMessage(e instanceof Error ? e.message : "Refresh failed — load seed data first.");
    }
  }

  async function saveAnalytics() {
    const body = { ...analyticsForm, metric_date: analyticsForm.metric_date ?? new Date().toISOString().slice(0, 10) };
    const existing = analytics.find((a) => a.metric_date === body.metric_date);
    if (existing?.id) {
      await patchRow("email-analytics", existing.id, body);
    } else {
      await fetch("/api/admin/growth/email-analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    onMessage("Email analytics saved.");
    loadTable("email-analytics", setAnalytics as (r: never[]) => void);
    loadOverview();
  }

  const emailAgent = AGENT_PROMPTS.find((a) => a.name === "Email Marketing Manager");
  const filteredFlowEmails = selectedFlow
    ? flowEmails.filter((e) => e.flow_slug === selectedFlow)
    : flowEmails;

  return (
    <section className="growth-email-tab">
      <div className="growth-sticky-subnav" ref={subnavRef}>
        <div className="growth-card-head">
          <p className="growth-muted">
            Klaviyo is your send platform. This tab tells you exactly what to build — nothing sends automatically.
          </p>
          <button type="button" className="growth-btn growth-btn-secondary growth-btn-sm" onClick={seedEmail}>
            Load email seed data
          </button>
          <button type="button" className="growth-btn growth-btn-secondary growth-btn-sm" onClick={refreshEmailCopy}>
            Refresh email copy
          </button>
        </div>

        <nav className="growth-subtabs" aria-label="Email marketing sections">
          {SUBTABS.map((t) => (
            <button
              key={t}
              type="button"
              className={`growth-subtab${sub === t ? " growth-subtab-active" : ""}`}
              onClick={() => setSub(t)}
            >
              {t}
            </button>
          ))}
        </nav>
      </div>

      {sub === "Overview" && (
        <div className="growth-email-overview">
          <div className="growth-stat-grid">
            <StatCard label="Waitlist" value={overview?.launchTracker.waitlist ?? "—"} />
            <StatCard label="Beta active" value={overview?.launchTracker.betaActive ?? "—"} />
            <StatCard label="LTD customers" value={overview?.launchTracker.customers ?? "—"} />
            <StatCard label="Email revenue" value={fmtMoney(overview?.launchTracker.revenue ?? 0)} />
            <StatCard label="Subscribers" value={overview?.launchTracker.emailSubscribers ?? "—"} />
            <StatCard label="Avg open rate" value={overview?.emailAnalytics.avgOpenRate ? `${overview.emailAnalytics.avgOpenRate}%` : "—"} />
          </div>

          <div className="growth-card">
            <h2>Customer journey funnel</h2>
            <p className="growth-muted">Klaviyo holds the memory — every person moves through this path.</p>
            {!overview?.funnel?.length ? (
              <EmptyState title="No funnel data" body='Click "Load email seed data" and run migration 005 in Supabase.' />
            ) : (
              <div className="growth-funnel">
                {overview.funnel.map((step, i) => (
                  <div key={step.id} className="growth-funnel-step">
                    <div className="growth-funnel-node">
                      <strong>{step.label}</strong>
                      <span className="growth-funnel-count">{step.count.toLocaleString()}</span>
                      {i > 0 ? (
                        <span className="growth-funnel-meta">
                          {step.conversion}% from prev · −{step.dropOff} drop-off
                        </span>
                      ) : null}
                    </div>
                    {i < overview.funnel.length - 1 ? <div className="growth-funnel-arrow">↓</div> : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="growth-card">
            <h3>Launch goal tracker</h3>
            <ul className="growth-list">
              <li>Waitlist → Beta: track beta invite sends in Klaviyo</li>
              <li>Beta → LTD: goal $100k–$200k by Aug 3</li>
              <li>Log revenue by campaign in Campaign Calendar</li>
              <li>Top converting email: {overview?.topCampaign?.campaign_name ?? "—"}</li>
            </ul>
          </div>

          {emailAgent ? (
            <div className="growth-card">
              <h3>{emailAgent.name}</h3>
              <pre className="growth-agent-prompt">{emailAgent.template}</pre>
              <CopyBtn text={emailAgent.template} label="Copy agent prompt" />
            </div>
          ) : null}
        </div>
      )}

      {sub === "Segments" && (
        <div className="growth-card">
          <div className="growth-card-head">
            <h2>Segments — build these in Klaviyo</h2>
            <ExportBtn rows={segments as unknown as Record<string, unknown>[]} filename="email-segments.csv" />
          </div>
          {loading || !segments.length ? (
            <EmptyState title="No segments" body='Click "Load email seed data" after running migration 005.' />
          ) : (
            <div className="growth-table-wrap">
              <table className="growth-table">
                <thead>
                  <tr>
                    <th>Segment</th>
                    <th>Definition</th>
                    <th>Klaviyo name</th>
                    <th>Count</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {segments.map((s) => (
                    <tr key={s.id}>
                      <td><strong>{s.name}</strong></td>
                      <td className="growth-cell-notes">{s.definition}</td>
                      <td>{s.klaviyo_segment_name}</td>
                      <td>
                        <input
                          type="number"
                          className="growth-inline-input"
                          value={s.estimated_count ?? 0}
                          onChange={(e) => {
                            patchRow("email-segments", s.id, { estimated_count: Number(e.target.value) }).then(() =>
                              loadTable("email-segments", setSegments as (r: never[]) => void),
                            );
                          }}
                          aria-label="Estimated count"
                        />
                      </td>
                      <td><StatusBadge status={s.priority} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {sub === "Flows" && (
        <div className="growth-flows">
          <div className="growth-card">
            <div className="growth-card-head">
              <h2>Klaviyo flows</h2>
              <select value={selectedFlow} onChange={(e) => setSelectedFlow(e.target.value)} aria-label="Filter flow">
                <option value="">All flows</option>
                {flows.map((f) => (
                  <option key={f.slug} value={f.slug}>{f.name}</option>
                ))}
              </select>
            </div>
            {!flows.length ? (
              <EmptyState title="No flows" body="Load email seed data first." />
            ) : (
              flows.filter((f) => !selectedFlow || f.slug === selectedFlow).map((f) => (
                <details key={f.id} className="growth-flow-card" open={!!selectedFlow}>
                  <summary>
                    <strong>{f.name}</strong>
                    <select
                      value={f.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        patchRow("email-flows", f.id, { status: e.target.value }).then(() =>
                          loadTable("email-flows", setFlows as (r: never[]) => void),
                        );
                      }}
                    >
                      {FLOW_STATUS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </summary>
                  <div className="growth-flow-detail">
                    <p><strong>Purpose:</strong> {f.purpose}</p>
                    <p><strong>Trigger:</strong> {f.trigger_description}</p>
                    <p><strong>Goal:</strong> {f.goal}</p>
                    <p><strong>Owner:</strong> {f.owner} · <strong>Klaviyo:</strong> {f.klaviyo_flow_name}</p>
                    <h4>Emails in flow</h4>
                    <ul className="growth-flow-email-list">
                      {filteredFlowEmails.filter((e) => e.flow_slug === f.slug).map((e) => (
                        <li key={e.id}>
                          <strong>{e.send_timing}:</strong> {e.subject}
                          <span className="growth-tag">{e.graphic_recommendation}</span>
                          <CopyBtn
                            text={formatKlaviyoPasteBlock({
                              send_timing: e.send_timing ?? undefined,
                              subject: e.subject ?? "",
                              preview_text: e.preview_text ?? "",
                              body: e.body_outline ?? "",
                              cta: e.cta ?? "",
                              graphic_recommendation: e.graphic_recommendation ?? "",
                            })}
                            label="Copy"
                          />
                          <select
                            value={e.status}
                            onChange={(ev) => {
                              patchRow("email-flow-emails", e.id, { status: ev.target.value }).then(() =>
                                loadTable("email-flow-emails", setFlowEmails as (r: never[]) => void),
                              );
                            }}
                          >
                            {EMAIL_STATUS.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              ))
            )}
          </div>

          <div className="growth-card growth-card-muted">
            <h3>Future flows (placeholders)</h3>
            <ul className="growth-list">
              {FUTURE_FLOWS.map((f) => (
                <li key={f.slug}><strong>{f.name}</strong> — {f.purpose} (Trigger: {f.trigger_description})</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {sub === "Campaign Calendar" && (
        <div className="growth-card">
          <div className="growth-card-head">
            <h2>Campaign calendar</h2>
            <ExportBtn rows={campaigns as unknown as Record<string, unknown>[]} filename="email-campaigns.csv" />
          </div>
          <p className="growth-muted">Founder LTD launch sequence Jul 21–Aug 3. Friday newsletter reminder every week.</p>
          {!campaigns.length ? (
            <EmptyState title="No campaigns" body="Load email seed data." />
          ) : (
            <div className="growth-table-wrap">
              <table className="growth-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Campaign</th>
                    <th>Subject</th>
                    <th>Graphic</th>
                    <th>Status</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c.id}>
                      <td>{c.send_date ?? "—"}</td>
                      <td>{c.campaign_name}</td>
                      <td>{c.subject}</td>
                      <td className="growth-cell-notes">{c.graphic_recommendation}</td>
                      <td>
                        <select
                          value={c.status}
                          onChange={(e) => {
                            patchRow("email-campaigns", c.id, { status: e.target.value }).then(() =>
                              loadTable("email-campaigns", setCampaigns as (r: never[]) => void),
                            );
                          }}
                        >
                          <option value="planned">Planned</option>
                          <option value="drafted">Drafted</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="sent">Sent</option>
                          <option value="skipped">Skipped</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="growth-inline-input"
                          placeholder="0"
                          value={c.revenue_attributed ?? ""}
                          onChange={(e) => {
                            patchRow("email-campaigns", c.id, {
                              revenue_attributed: e.target.value ? Number(e.target.value) : null,
                            }).then(() => loadTable("email-campaigns", setCampaigns as (r: never[]) => void));
                          }}
                          aria-label="Revenue attributed"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="growth-card growth-card-muted" style={{ marginTop: 16 }}>
            <h3>Friday newsletter — pick one each week</h3>
            <ul className="growth-list">
              {FRIDAY_NEWSLETTER_IDEAS.map((idea) => (
                <li key={idea}>{idea}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {sub === "Email Library" && (
        <div className="growth-card">
          <div className="growth-card-head">
            <h2>Email library</h2>
            <ExportBtn rows={library as unknown as Record<string, unknown>[]} filename="email-library.csv" />
          </div>
          <p className="growth-muted">
            Each email includes subject, preview, full body draft, CTA, and graphic + Canva brief.
            Click <strong>Copy full Klaviyo block</strong> and paste into Klaviyo.
          </p>
          {!library.length ? (
            <EmptyState title="No emails in library" body="Load email seed data." />
          ) : (
            <div className="growth-email-library">
              {library.map((e) => (
                <details key={e.id} className="growth-launch-day">
                  <summary>
                    <strong>{e.subject}</strong>
                    <StatusBadge status={e.status.split("_")[0]} />
                    <span className="growth-tag">{e.campaign}</span>
                  </summary>
                  <div className="growth-launch-detail">
                    <p><strong>Preview:</strong> {e.preview_text}</p>
                    <p><strong>Goal:</strong> {e.goal}</p>
                    <p><strong>CTA:</strong> {e.cta}</p>
                    <p><strong>Graphic:</strong> {e.graphic_recommendation}</p>
                    <p><strong>Body:</strong></p>
                    <pre className="growth-email-body-preview">{e.body_outline}</pre>
                    <p><strong>Graphic:</strong> {e.graphic_recommendation}</p>
                    <CopyBtn
                      text={formatKlaviyoPasteBlock({
                        subject: e.subject,
                        preview_text: e.preview_text ?? "",
                        body: e.body_outline ?? "",
                        cta: e.cta ?? "",
                        graphic_recommendation: e.graphic_recommendation ?? "",
                      })}
                      label="Copy full Klaviyo block"
                    />
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      )}

      {sub === "Templates" && (
        <div className="growth-template-grid">
          {Object.entries(EMAIL_TEMPLATES).map(([k, v]) => (
            <div key={k} className="growth-card">
              <h3>{k.replace(/([A-Z])/g, " $1").trim()}</h3>
              <pre>{v}</pre>
              <CopyBtn text={v} />
            </div>
          ))}
          <div className="growth-card">
            <h3>Flow reference (static)</h3>
            <p className="growth-muted">{FLOWS.length} flows defined. {FLOWS.reduce((s, f) => s + f.emails.length, 0)} total emails.</p>
            <ul className="growth-list">
              {FLOWS.map((f) => (
                <li key={f.slug}>{f.name} — {f.emails.length} emails</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {sub === "Analytics" && (
        <div>
          <div className="growth-card">
            <h2>Log Klaviyo metrics (daily)</h2>
            <div className="growth-form-grid">
              {(
                [
                  ["subscribers", "Subscribers"],
                  ["open_rate", "Open rate %"],
                  ["click_rate", "Click rate %"],
                  ["unsubscribes", "Unsubscribes"],
                  ["waitlist_conversion", "Waitlist conv %"],
                  ["beta_conversion", "Beta conv %"],
                  ["ltd_conversion", "LTD conv %"],
                  ["revenue_per_email", "Revenue/email"],
                  ["revenue_per_subscriber", "Revenue/subscriber"],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    type="number"
                    step="0.1"
                    value={Number(analyticsForm[key] ?? "")}
                    onChange={(e) =>
                      setAnalyticsForm((f) => ({ ...f, [key]: e.target.value ? Number(e.target.value) : null }))
                    }
                  />
                </label>
              ))}
              <label>
                Top email
                <input
                  type="text"
                  value={analyticsForm.top_email ?? ""}
                  onChange={(e) => setAnalyticsForm((f) => ({ ...f, top_email: e.target.value }))}
                />
              </label>
              <label>
                Worst email
                <input
                  type="text"
                  value={analyticsForm.worst_email ?? ""}
                  onChange={(e) => setAnalyticsForm((f) => ({ ...f, worst_email: e.target.value }))}
                />
              </label>
            </div>
            <button type="button" className="growth-btn growth-btn-primary" onClick={saveAnalytics}>
              Save email analytics
            </button>
          </div>

          {analytics.length > 0 ? (
            <div className="growth-card">
              <h3>Open rate trend (14 days)</h3>
              <SimpleBars
                items={[...analytics].reverse().map((a) => ({
                  label: a.metric_date.slice(5),
                  value: Number(a.open_rate ?? 0),
                }))}
              />
            </div>
          ) : null}
          <ExportBtn rows={analytics as unknown as Record<string, unknown>[]} filename="email-analytics.csv" />
        </div>
      )}
    </section>
  );
}
