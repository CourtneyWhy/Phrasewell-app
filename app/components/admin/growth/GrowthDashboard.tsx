"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { growthFetch } from "@/app/lib/growth/client";
import {
  LAUNCH_DATE,
  LAUNCH_PHASES,
  LTD_SCENARIOS,
  LTD_TIERS,
  MRR_SCENARIOS,
  ANNUAL_1M_SCENARIOS,
  AUTOMATION_RECOMMENDATIONS,
  AUTOMATION_DONT,
  getLaunchCalendarDays,
} from "@/app/lib/growth/launch-phases";
import { GOTCHA_PITCH } from "@/app/lib/growth/launch-strategy";
import { AGENT_PROMPTS } from "@/app/lib/growth/agent-prompts";
import { OUTREACH_TEMPLATES, POST_TEMPLATES, BLOG_TITLES } from "@/app/lib/growth/templates";
import type {
  GrowthCommunity,
  GrowthContentItem,
  GrowthCreator,
  GrowthDailyTask,
  GrowthMetricsDaily,
  GrowthOutreach,
  GrowthRevenueDaily,
  TaskStatus,
} from "@/app/lib/growth/types";
import {
  buildQuery,
  CopyBtn,
  EmptyState,
  ExportBtn,
  FilterBar,
  patchRow,
  SimpleBars,
  StatCard,
  StatusBadge,
} from "./shared";
import { EmailMarketingTab } from "./EmailMarketingTab";
import { ContentEngineTab } from "./ContentEngineTab";
import { TodayTab } from "./TodayTab";
import { ToolsTab } from "./ToolsTab";

const TABS = [
  { id: "today", label: "Today" },
  { id: "tools", label: "Tools & Plan" },
  { id: "launch", label: "Launch Calendar" },
  { id: "communities", label: "Communities" },
  { id: "creators", label: "Creators" },
  { id: "content", label: "Content" },
  { id: "content-engine", label: "Content Engine" },
  { id: "outreach", label: "Outreach" },
  { id: "feedback", label: "Beta Feedback" },
  { id: "email", label: "Email Marketing" },
  { id: "metrics", label: "Metrics" },
  { id: "revenue", label: "Revenue" },
  { id: "agents", label: "Agents" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type Stats = {
  today: string;
  daysUntilLaunch: number;
  waitlistTotal: number;
  feedbackTotal: number;
  thumbsUpPct: number;
  ltdRevenueTotal: number;
  betaUsersActive: number | null;
  todayTasks: GrowthDailyTask[];
};

const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
  { value: "skipped", label: "Skipped" },
];

const JOINED_STATUSES = [
  { value: "not_joined", label: "Not joined" },
  { value: "requested", label: "Requested" },
  { value: "joined", label: "Joined" },
  { value: "rejected", label: "Rejected" },
];

const CONTACT_STATUSES = [
  { value: "not_contacted", label: "Not contacted" },
  { value: "contacted", label: "Contacted" },
  { value: "replied", label: "Replied" },
  { value: "interested", label: "Interested" },
  { value: "declined", label: "Declined" },
  { value: "partnered", label: "Partnered" },
];

const CONTENT_STATUSES = [
  { value: "idea", label: "Idea" },
  { value: "drafted", label: "Drafted" },
  { value: "approved", label: "Approved" },
  { value: "scheduled", label: "Scheduled" },
  { value: "posted", label: "Posted" },
];

const OUTREACH_STATUSES = [
  { value: "not_sent", label: "Not sent" },
  { value: "sent", label: "Sent" },
  { value: "replied", label: "Replied" },
  { value: "follow_up_needed", label: "Follow up" },
  { value: "closed", label: "Closed" },
];

function fmtMoney(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function fmtDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function GrowthDashboard() {
  const [tab, setTab] = useState<TabId>("today");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [communities, setCommunities] = useState<GrowthCommunity[]>([]);
  const [creators, setCreators] = useState<GrowthCreator[]>([]);
  const [content, setContent] = useState<GrowthContentItem[]>([]);
  const [outreach, setOutreach] = useState<GrowthOutreach[]>([]);
  const [metrics, setMetrics] = useState<GrowthMetricsDaily[]>([]);
  const [revenue, setRevenue] = useState<GrowthRevenueDaily[]>([]);
  const [feedback, setFeedback] = useState<{ data: Record<string, unknown>[]; summary: Record<string, unknown> } | null>(null);
  const [agentRuns, setAgentRuns] = useState<Record<string, unknown>[]>([]);
  const [launchPhaseFilter, setLaunchPhaseFilter] = useState("");

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const launchDays = useMemo(() => getLaunchCalendarDays(todayIso), [todayIso]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tab");
    if (t && TABS.some((x) => x.id === t)) setTab(t as TabId);
  }, []);

  function goToTab(tabId: TabId) {
    setTab(tabId);
    window.history.replaceState(null, "", `/admin/growth?tab=${tabId}`);
  }

  const loadStats = useCallback(async () => {
    try {
      const data = await growthFetch<Stats>("/api/admin/growth/stats");
      setStats(data);
    } catch {
      setStats(null);
    }
  }, []);

  const loadTable = useCallback(
    async (table: string, setter: (rows: never[]) => void) => {
      setLoading(true);
      try {
        const q = buildQuery({ platform, status, priority, date: filterDate });
        const res = await growthFetch<{ data: never[] }>(`/api/admin/growth/${table}${q}`);
        setter(res.data ?? []);
      } catch {
        setter([] as never[]);
      } finally {
        setLoading(false);
      }
    },
    [platform, status, priority, filterDate],
  );

  const loadFeedback = useCallback(async () => {
    try {
      const res = await growthFetch<{ data: Record<string, unknown>[]; summary: Record<string, unknown> }>(
        "/api/admin/growth/feedback",
      );
      setFeedback(res);
    } catch {
      setFeedback(null);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (tab === "communities") loadTable("communities", setCommunities as (r: never[]) => void);
    if (tab === "creators") loadTable("creators", setCreators as (r: never[]) => void);
    if (tab === "content") loadTable("content", setContent as (r: never[]) => void);
    if (tab === "outreach") loadTable("outreach", setOutreach as (r: never[]) => void);
    if (tab === "metrics") loadTable("metrics", setMetrics as (r: never[]) => void);
    if (tab === "revenue") loadTable("revenue", setRevenue as (r: never[]) => void);
    if (tab === "feedback") loadFeedback();
    if (tab === "agents") loadTable("agents", setAgentRuns as (r: never[]) => void);
    if (tab === "today") loadStats();
  }, [tab, platform, status, priority, filterDate, loadTable, loadFeedback, loadStats]);

  async function runSeed(only?: "creators" | "communities" | "all") {
    setMessage(null);
    try {
      const res = await growthFetch<{
        ok: boolean;
        communities: number;
        creators: number;
        message?: string;
        creatorCount?: number;
        error?: string;
      }>("/api/admin/growth/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(only && only !== "all" ? { only } : {}),
      });
      setMessage(
        res.message ??
          `Seeded ${res.communities} communities, ${res.creators} creators, content + tasks.`,
      );
      loadStats();
      loadTable("creators", setCreators as (r: never[]) => void);
      loadTable("communities", setCommunities as (r: never[]) => void);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Seed failed");
    }
  }

  async function updateTask(task: GrowthDailyTask, fields: Partial<GrowthDailyTask>) {
    await patchRow("daily-tasks", task.id, fields);
    loadStats();
  }

  async function createTestimonialTask() {
    await fetch("/api/admin/growth/daily-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task_date: todayIso,
        task_title: "Request testimonials from 3 beta users",
        task_type: "feedback",
        platform: "Email",
        priority: "high",
        status: "not_started",
        notes: "Ask permission + parent type + can use publicly",
      }),
    });
    setMessage("Testimonial request task created for today.");
    loadStats();
  }

  const metricsSummary = useMemo(() => {
    const last7 = metrics.slice(0, 7);
    const avg = (key: keyof GrowthMetricsDaily) => {
      const vals = last7.map((m) => Number(m[key] ?? 0));
      return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    };
    const mtd = metrics.filter((m) => m.metric_date.startsWith(todayIso.slice(0, 7)));
    const sum = (key: keyof GrowthMetricsDaily) =>
      mtd.reduce((acc, m) => acc + Number(m[key] ?? 0), 0);
    return { avg, sum, today: metrics.find((m) => m.metric_date === todayIso) };
  }, [metrics, todayIso]);

  const revenueSummary = useMemo(() => {
    const cumulative = revenue.length ? Number(revenue[0].cumulative_launch_revenue ?? 0) : stats?.ltdRevenueTotal ?? 0;
    const launchDaysLeft = stats?.daysUntilLaunch ?? 40;
    const dailyNeeded100k = launchDaysLeft > 0 ? Math.round((100000 - cumulative) / Math.max(launchDaysLeft, 1)) : 0;
    const last7 = revenue.slice(0, 7);
    const pace =
      last7.length > 0
        ? last7.reduce((s, r) => s + Number(r.net_revenue ?? 0), 0) / last7.length
        : 0;
    const projected = cumulative + pace * Math.max(launchDaysLeft, 0);
    return { cumulative, dailyNeeded100k, pace, projected };
  }, [revenue, stats]);

  const [metricForm, setMetricForm] = useState<Partial<GrowthMetricsDaily>>({ metric_date: todayIso });
  const [revenueForm, setRevenueForm] = useState<Partial<GrowthRevenueDaily>>({ revenue_date: todayIso });

  async function saveMetrics() {
    const body = { ...metricForm, metric_date: metricForm.metric_date ?? todayIso };
    const existing = metrics.find((m) => m.metric_date === body.metric_date);
    if (existing?.id) {
      await patchRow("metrics", existing.id, body);
    } else {
      await fetch("/api/admin/growth/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    setMessage("Metrics saved.");
    loadTable("metrics", setMetrics as (r: never[]) => void);
  }

  async function saveRevenue() {
    const net = Number(revenueForm.daily_revenue ?? 0) - Number(revenueForm.refunds ?? 0);
    const sorted = [...revenue].sort((a, b) => b.revenue_date.localeCompare(a.revenue_date));
    const prevCumulative =
      sorted.find((r) => r.revenue_date < (revenueForm.revenue_date ?? todayIso))?.cumulative_launch_revenue ??
      sorted[0]?.cumulative_launch_revenue ??
      0;
    const body = {
      ...revenueForm,
      revenue_date: revenueForm.revenue_date ?? todayIso,
      net_revenue: net,
      cumulative_launch_revenue: Number(prevCumulative) + net,
    };
    const existing = revenue.find((r) => r.revenue_date === body.revenue_date);
    if (existing?.id) {
      await patchRow("revenue", existing.id, body);
    } else {
      await fetch("/api/admin/growth/revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    setMessage("Revenue logged.");
    loadTable("revenue", setRevenue as (r: never[]) => void);
    loadStats();
  }

  const filteredLaunch = launchPhaseFilter
    ? launchDays.filter((d) => d.phase.id === launchPhaseFilter)
    : launchDays;

  return (
    <div className="growth-dashboard">
      <header className="growth-header">
        <div>
          <h1 className="font-heading">Growth OS</h1>
          <p className="growth-subtitle">Founder LTD launch {LAUNCH_DATE} · {GOTCHA_PITCH}</p>
        </div>
        <div className="growth-header-actions">
          <button type="button" className="growth-btn growth-btn-secondary growth-btn-sm" onClick={() => runSeed("all")}>
            Load seed data
          </button>
          <button
            type="button"
            className="growth-btn growth-btn-secondary growth-btn-sm"
            onClick={async () => {
              await fetch("/api/admin/auth", { method: "DELETE" });
              window.location.href = "/admin/login";
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      {message ? <p className="growth-toast">{message}</p> : null}

      <nav className="growth-tabs" aria-label="Dashboard tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`growth-tab${tab === t.id ? " growth-tab-active" : ""}`}
            onClick={() => goToTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="growth-main">
        {tab === "today" && (
          <>
            <div className="growth-stat-grid">
              <StatCard label="Today" value={fmtDate(stats?.today ?? todayIso)} />
              <StatCard label="Days to launch" value={stats?.daysUntilLaunch ?? "—"} sub={LAUNCH_DATE} />
              <StatCard label="Waitlist" value={stats?.waitlistTotal ?? 0} />
              <StatCard label="Beta active" value={stats?.betaUsersActive ?? "—"} />
              <StatCard label="Feedback" value={stats?.feedbackTotal ?? 0} sub={`${stats?.thumbsUpPct ?? 0}% thumbs up`} />
              <StatCard label="LTD revenue" value={fmtMoney(stats?.ltdRevenueTotal ?? 0)} />
            </div>
            <TodayTab
              todayIso={todayIso}
              tasks={stats?.todayTasks ?? []}
              onRefresh={loadStats}
              onUpdateTask={updateTask}
              onGoToTab={(id) => goToTab(id as TabId)}
            />
          </>
        )}

        {tab === "tools" && <ToolsTab />}

        {tab === "launch" && (
          <section>
            <div className="growth-phase-grid">
              {LAUNCH_PHASES.map((p) => (
                <div key={p.id} className="growth-card growth-phase-card">
                  <h3>{p.name}</h3>
                  <p className="growth-dates">
                    {p.start} → {p.end}
                  </p>
                  <p>{p.goal}</p>
                </div>
              ))}
            </div>
            <div className="growth-card">
              <div className="growth-card-head">
                <h2>Workback schedule</h2>
                <select value={launchPhaseFilter} onChange={(e) => setLaunchPhaseFilter(e.target.value)}>
                  <option value="">All phases</option>
                  {LAUNCH_PHASES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="growth-launch-list">
                {filteredLaunch.map((day) => (
                  <details key={day.date} className="growth-launch-day">
                    <summary>
                      <strong>{fmtDate(day.date)}</strong>
                      <StatusBadge status={day.phase.id} />
                      {day.plan ? <span className="growth-tag">Launch week</span> : null}
                    </summary>
                    <div className="growth-launch-detail">
                      <p>
                        <strong>Main goal:</strong> {day.plan?.goal ?? day.phase.goal}
                      </p>
                      <p>
                        <strong>Tasks:</strong> {day.plan?.tasks.join(" · ") ?? day.guidance.tasks}
                      </p>
                      <p>
                        <strong>Content:</strong> {day.plan?.content ?? day.guidance.content}
                      </p>
                      <p>
                        <strong>Community:</strong> {day.plan?.community ?? day.guidance.community}
                      </p>
                      <p>
                        <strong>Creator:</strong> {day.plan?.creator ?? day.guidance.creator}
                      </p>
                      <p>
                        <strong>Email:</strong> {day.plan?.email ?? day.guidance.email}
                      </p>
                      <p>
                        <strong>Metrics:</strong> {day.plan?.metrics ?? day.guidance.metrics}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {tab === "communities" && (
          <CrudSection
            title="Communities"
            loading={loading}
            rows={communities as unknown as Record<string, unknown>[]}
            exportName="growth-communities.csv"
            filters={
              <FilterBar
                platform={platform}
                setPlatform={setPlatform}
                status={status}
                setStatus={setStatus}
                priority={priority}
                setPriority={setPriority}
                statusOptions={JOINED_STATUSES}
                platforms={["", "Reddit", "Facebook"]}
              />
            }
            emptyTitle="No communities yet"
            emptyBody='Click "Load seed data" to pre-fill Reddit subs and Facebook groups to research.'
            renderRow={(row) => {
              const c = row as unknown as GrowthCommunity;
              return (
                <tr key={c.id}>
                  <td>
                    <strong>{c.name}</strong>
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noreferrer" className="growth-link">
                        ↗
                      </a>
                    ) : null}
                  </td>
                  <td>{c.platform}</td>
                  <td>
                    <select
                      value={c.joined_status}
                      onChange={(e) => {
                        patchRow("communities", c.id, { joined_status: e.target.value }).then(() =>
                          loadTable("communities", setCommunities as (r: never[]) => void),
                        );
                      }}
                    >
                      {JOINED_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={c.priority}
                      onChange={(e) => {
                        patchRow("communities", c.id, { priority: e.target.value }).then(() =>
                          loadTable("communities", setCommunities as (r: never[]) => void),
                        );
                      }}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </td>
                  <td className="growth-cell-notes">{c.promo_rules ?? c.best_post_angle ?? "—"}</td>
                  <td className="growth-cell-notes">{c.notes ?? "—"}</td>
                </tr>
              );
            }}
            headers={["Name", "Platform", "Joined", "Priority", "Rules / angle", "Notes"]}
          />
        )}

        {tab === "creators" && (
          <CrudSection
            title="Creators / Influencers"
            loading={loading}
            rows={creators as unknown as Record<string, unknown>[]}
            exportName="growth-creators.csv"
            filters={
              <FilterBar
                platform={platform}
                setPlatform={setPlatform}
                status={status}
                setStatus={setStatus}
                priority={priority}
                setPriority={setPriority}
                statusOptions={CONTACT_STATUSES}
              />
            }
            emptyTitle="No creators yet"
            emptyBody='Click "Load creator list" below. If it fails, run migration 004_growth_schema.sql in Supabase first.'
            emptyAction={
              <button
                type="button"
                className="growth-btn growth-btn-primary growth-btn-sm"
                onClick={() => runSeed("creators")}
              >
                Load creator list
              </button>
            }
            headers={["Name", "Platform", "Handle", "Status", "Priority", "Notes"]}
            renderRow={(row) => {
              const c = row as unknown as GrowthCreator;
              return (
                <tr key={c.id}>
                  <td>
                    <strong>{c.name}</strong>
                  </td>
                  <td>{c.platform}</td>
                  <td>
                    {c.handle ?? "—"}
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noreferrer" className="growth-link">
                        ↗
                      </a>
                    ) : null}
                  </td>
                  <td>
                    <select
                      value={c.contact_status}
                      onChange={(e) => {
                        patchRow("creators", c.id, { contact_status: e.target.value }).then(() =>
                          loadTable("creators", setCreators as (r: never[]) => void),
                        );
                      }}
                    >
                      {CONTACT_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{c.priority}</td>
                  <td className="growth-cell-notes">{c.outreach_angle ?? c.notes ?? "—"}</td>
                </tr>
              );
            }}
          />
        )}

        {tab === "content" && (
          <section>
            <div className="growth-card growth-card-muted">
              <h3>Post templates</h3>
              <div className="growth-template-grid">
                {Object.entries(POST_TEMPLATES).map(([k, v]) => (
                  <div key={k} className="growth-template">
                    <strong>{k}</strong>
                    <pre>{v}</pre>
                    <CopyBtn text={v} />
                  </div>
                ))}
              </div>
              <p className="growth-muted">Blog titles: {BLOG_TITLES.join(" · ")}</p>
            </div>
            <CrudSection
              title="Content calendar"
              loading={loading}
              rows={content as unknown as Record<string, unknown>[]}
              exportName="growth-content.csv"
              filters={
                <FilterBar
                  platform={platform}
                  setPlatform={setPlatform}
                  status={status}
                  setStatus={setStatus}
                  priority={priority}
                  setPriority={setPriority}
                  statusOptions={CONTENT_STATUSES}
                  showPriority={false}
                  showDate
                  date={filterDate}
                  setDate={setFilterDate}
                />
              }
              emptyTitle="No content scheduled"
              emptyBody="Load seed data for 35 days of content ideas through July 28."
              headers={["Date", "Platform", "Type", "Topic", "Status", "Hook / body"]}
              renderRow={(row) => {
                const c = row as unknown as GrowthContentItem;
                return (
                  <tr key={c.id}>
                    <td>{c.publish_date}</td>
                    <td>{c.platform}</td>
                    <td>{c.content_type}</td>
                    <td>{c.topic}</td>
                    <td>
                      <select
                        value={c.status}
                        onChange={(e) => {
                          patchRow("content", c.id, { status: e.target.value }).then(() =>
                            loadTable("content", setContent as (r: never[]) => void),
                          );
                        }}
                      >
                        {CONTENT_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="growth-cell-notes">{c.hook ?? c.body?.slice(0, 120) ?? "—"}</td>
                  </tr>
                );
              }}
            />
          </section>
        )}

        {tab === "outreach" && (
          <section>
            <div className="growth-card growth-card-muted">
              <h3>Outreach templates</h3>
              <div className="growth-template-grid">
                {Object.entries(OUTREACH_TEMPLATES).map(([k, v]) => (
                  <div key={k} className="growth-template">
                    <strong>{k}</strong>
                    <pre>{v}</pre>
                    <CopyBtn text={v} />
                  </div>
                ))}
              </div>
            </div>
            <CrudSection
              title="Outreach log"
              loading={loading}
              rows={outreach as unknown as Record<string, unknown>[]}
              exportName="growth-outreach.csv"
              filters={
                <FilterBar
                  platform={platform}
                  setPlatform={setPlatform}
                  status={status}
                  setStatus={setStatus}
                  priority={priority}
                  setPriority={setPriority}
                  statusOptions={OUTREACH_STATUSES}
                  showPriority={false}
                  showDate
                  date={filterDate}
                  setDate={setFilterDate}
                />
              }
              emptyTitle="No outreach logged"
              emptyBody="Add rows via Supabase or POST to the API as you send messages."
              headers={["Date", "Target", "Type", "Platform", "Status", "Message"]}
              renderRow={(row) => {
                const o = row as unknown as GrowthOutreach;
                return (
                  <tr key={o.id}>
                    <td>{o.outreach_date}</td>
                    <td>{o.target_name}</td>
                    <td>{o.target_type}</td>
                    <td>{o.platform ?? "—"}</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => {
                          patchRow("outreach", o.id, { status: e.target.value }).then(() =>
                            loadTable("outreach", setOutreach as (r: never[]) => void),
                          );
                        }}
                      >
                        {OUTREACH_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="growth-cell-notes">{o.message?.slice(0, 100) ?? "—"}</td>
                  </tr>
                );
              }}
            />
          </section>
        )}

        {tab === "feedback" && (
          <section>
            <div className="growth-stat-grid">
              <StatCard label="Total feedback" value={(feedback?.summary?.total as number) ?? 0} />
              <StatCard label="Thumbs up" value={`${(feedback?.summary?.thumbsUpPct as number) ?? 0}%`} />
              <StatCard
                label="Thumbs down"
                value={
                  feedback?.summary?.total
                    ? `${100 - ((feedback.summary.thumbsUpPct as number) ?? 0)}%`
                    : "—"
                }
              />
              <StatCard label="Most problematic" value={(feedback?.summary?.worstCategory as string) ?? "—"} />
            </div>
            <div className="growth-card-head">
              <button type="button" className="growth-btn growth-btn-primary" onClick={createTestimonialTask}>
                Create testimonial request task
              </button>
              <ExportBtn rows={feedback?.data ?? []} filename="phrase-feedback.csv" />
            </div>
            {!feedback?.data?.length ? (
              <EmptyState title="No feedback yet" body="Beta users submit feedback from Moment Cards in the app." />
            ) : (
              <div className="growth-table-wrap">
                <table className="growth-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Helpful</th>
                      <th>Category</th>
                      <th>Comment</th>
                      <th>Testimonial</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedback.data.map((row) => (
                      <tr key={String(row.id)}>
                        <td>{String(row.created_at ?? "").slice(0, 10)}</td>
                        <td>{row.helpful === true ? "👍" : row.helpful === false ? "👎" : "—"}</td>
                        <td>{String(row.category_name ?? "—")}</td>
                        <td className="growth-cell-notes">{String(row.comment ?? row.feedback_text ?? "—")}</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={Boolean(row.can_use_publicly)}
                            onChange={(e) => {
                              fetch("/api/admin/growth/feedback", {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id: row.id, can_use_publicly: e.target.checked }),
                              }).then(loadFeedback);
                            }}
                            aria-label="Can use publicly"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {tab === "metrics" && (
          <section>
            <div className="growth-card">
              <h2>Log today&apos;s metrics</h2>
              <div className="growth-form-grid">
                {(
                  [
                    ["website_visits", "Website visits"],
                    ["waitlist_signups", "Waitlist signups"],
                    ["beta_users_invited", "Beta invited"],
                    ["beta_users_active", "Beta active"],
                    ["app_sessions", "App sessions"],
                    ["feedback_submissions", "Feedback rows"],
                    ["thumbs_up_count", "Thumbs up"],
                    ["thumbs_down_count", "Thumbs down"],
                    ["email_subscribers", "Email subs"],
                    ["x_followers", "X followers"],
                    ["linkedin_followers", "LinkedIn followers"],
                    ["instagram_followers", "Instagram followers"],
                    ["tiktok_followers", "TikTok followers"],
                    ["facebook_groups_joined", "FB groups joined"],
                    ["reddit_comments_posted", "Reddit comments"],
                    ["creator_outreach_sent", "Outreach sent"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key}>
                    {label}
                    <input
                      type="number"
                      value={Number(metricForm[key] ?? "")}
                      onChange={(e) =>
                        setMetricForm((f) => ({ ...f, [key]: e.target.value ? Number(e.target.value) : null }))
                      }
                    />
                  </label>
                ))}
              </div>
              <button type="button" className="growth-btn growth-btn-primary" onClick={saveMetrics}>
                Save metrics
              </button>
            </div>

            <div className="growth-stat-grid">
              <StatCard label="Today visits" value={metricsSummary.today?.website_visits ?? "—"} />
              <StatCard label="7-day avg visits" value={metricsSummary.avg("website_visits")} />
              <StatCard label="MTD waitlist" value={metricsSummary.sum("waitlist_signups")} />
              <StatCard
                label="Visit → signup %"
                value={
                  metricsSummary.today?.website_visits
                    ? `${Math.round(
                        ((Number(metricsSummary.today.waitlist_signups ?? 0) /
                          Number(metricsSummary.today.website_visits)) *
                          100) as number,
                      )}%`
                    : "—"
                }
              />
            </div>

            <div className="growth-card">
              <h3>Last 7 days — waitlist signups</h3>
              <SimpleBars
                items={metrics
                  .slice(0, 7)
                  .reverse()
                  .map((m) => ({ label: m.metric_date.slice(5), value: Number(m.waitlist_signups ?? 0) }))}
              />
            </div>
            <ExportBtn rows={metrics as unknown as Record<string, unknown>[]} filename="growth-metrics.csv" />
          </section>
        )}

        {tab === "revenue" && (
          <section>
            <div className="growth-stat-grid">
              <StatCard label="Cumulative LTD" value={fmtMoney(revenueSummary.cumulative)} />
              <StatCard label="% to $100k" value={`${Math.round((revenueSummary.cumulative / 100000) * 100)}%`} />
              <StatCard label="% to $200k" value={`${Math.round((revenueSummary.cumulative / 200000) * 100)}%`} />
              <StatCard label="% to $1M" value={`${Math.round((revenueSummary.cumulative / 1000000) * 100)}%`} />
              <StatCard label="Daily needed ($100k)" value={fmtMoney(revenueSummary.dailyNeeded100k)} />
              <StatCard label="Current pace/day" value={fmtMoney(revenueSummary.pace)} />
              <StatCard label="Projected at pace" value={fmtMoney(revenueSummary.projected)} sub="Through launch" />
            </div>

            <div className="growth-card">
              <h2>Log prior-day revenue</h2>
              <div className="growth-form-grid">
                <label>
                  Date
                  <input
                    type="date"
                    value={revenueForm.revenue_date ?? todayIso}
                    onChange={(e) => setRevenueForm((f) => ({ ...f, revenue_date: e.target.value }))}
                  />
                </label>
                <label>
                  Units sold
                  <input
                    type="number"
                    value={revenueForm.ltd_units_sold ?? ""}
                    onChange={(e) => setRevenueForm((f) => ({ ...f, ltd_units_sold: Number(e.target.value) }))}
                  />
                </label>
                <label>
                  Price
                  <input
                    type="number"
                    value={revenueForm.ltd_price ?? ""}
                    onChange={(e) => setRevenueForm((f) => ({ ...f, ltd_price: Number(e.target.value) }))}
                  />
                </label>
                <label>
                  Gross revenue
                  <input
                    type="number"
                    value={revenueForm.daily_revenue ?? ""}
                    onChange={(e) => setRevenueForm((f) => ({ ...f, daily_revenue: Number(e.target.value) }))}
                  />
                </label>
                <label>
                  Refunds
                  <input
                    type="number"
                    value={revenueForm.refunds ?? ""}
                    onChange={(e) => setRevenueForm((f) => ({ ...f, refunds: Number(e.target.value) }))}
                  />
                </label>
              </div>
              <button type="button" className="growth-btn growth-btn-primary" onClick={saveRevenue}>
                Save revenue
              </button>
            </div>

            <div className="growth-calc-grid">
              <div className="growth-card">
                <h3>LTD tiers (launch Jul 28)</h3>
                <table className="growth-table growth-table-compact">
                  <thead>
                    <tr>
                      <th>Tier</th>
                      <th>Price</th>
                      <th>Includes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LTD_TIERS.map((t) => (
                      <tr key={t.id}>
                        <td>{t.name}</td>
                        <td>${t.price}</td>
                        <td>{t.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="growth-muted">After Aug 4: $12/mo with 7-day trial. No free trial during LTD window.</p>
              </div>
              <div className="growth-card">
                <h3>LTD sales scenarios</h3>
                <table className="growth-table growth-table-compact">
                  <thead>
                    <tr>
                      <th>Tier</th>
                      <th>Price</th>
                      <th>Sales for $100k</th>
                      <th>Sales for $200k</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LTD_SCENARIOS.map((s) => (
                      <tr key={`${s.tier}-${s.price}`}>
                        <td>{s.tier}</td>
                        <td>${s.price}</td>
                        <td>{s.sales100k}</td>
                        <td>{s.sales200k}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="growth-card">
                <h3>$10k MRR scenarios</h3>
                <table className="growth-table growth-table-compact">
                  <thead>
                    <tr>
                      <th>Price/mo</th>
                      <th>Subscribers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MRR_SCENARIOS.map((s) => (
                      <tr key={s.price}>
                        <td>${s.price}</td>
                        <td>{s.subs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="growth-card">
                <h3>$1M annual paths</h3>
                <ul className="growth-list">
                  {ANNUAL_1M_SCENARIOS.map((s) => (
                    <li key={s.label}>
                      {s.label}: <strong>{s.value.toLocaleString()}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="growth-card">
              <h3>Net revenue — last 7 days</h3>
              <SimpleBars
                items={revenue
                  .slice(0, 7)
                  .reverse()
                  .map((r) => ({ label: r.revenue_date.slice(5), value: Number(r.net_revenue ?? 0) }))}
              />
            </div>
            <ExportBtn rows={revenue as unknown as Record<string, unknown>[]} filename="growth-revenue.csv" />
          </section>
        )}

        {tab === "email" && <EmailMarketingTab onMessage={setMessage} />}

        {tab === "content-engine" && <ContentEngineTab onMessage={setMessage} />}

        {tab === "agents" && (
          <section>
            <p className="growth-muted">
              Copy prompts into Cursor or ChatGPT. Outputs are manual for now — paste results below when you run them.
            </p>
            <div className="growth-agent-grid">
              {AGENT_PROMPTS.map((agent) => (
                <div key={agent.name} className="growth-card">
                  <h3>{agent.name}</h3>
                  <p>
                    <strong>Purpose:</strong> {agent.purpose}
                  </p>
                  <p>
                    <strong>Input:</strong> {agent.input}
                  </p>
                  <p>
                    <strong>Output:</strong> {agent.output}
                  </p>
                  <pre className="growth-agent-prompt">{agent.template}</pre>
                  <CopyBtn text={agent.template} label="Copy prompt" />
                </div>
              ))}
            </div>
            <div className="growth-card">
              <h3>Automation recommendations</h3>
              <ul className="growth-list">
                {AUTOMATION_RECOMMENDATIONS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <h4>Do not</h4>
              <ul className="growth-list growth-list-warn">
                {AUTOMATION_DONT.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            {agentRuns.length > 0 ? (
              <ExportBtn rows={agentRuns} filename="growth-agent-runs.csv" />
            ) : (
              <EmptyState title="No agent runs logged" body="Save agent outputs to growth_agent_runs when you use them." />
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function CrudSection({
  title,
  loading,
  rows,
  exportName,
  filters,
  emptyTitle,
  emptyBody,
  emptyAction,
  headers,
  renderRow,
}: {
  title: string;
  loading: boolean;
  rows: Record<string, unknown>[];
  exportName: string;
  filters: React.ReactNode;
  emptyTitle: string;
  emptyBody: string;
  emptyAction?: React.ReactNode;
  headers: string[];
  renderRow: (row: Record<string, unknown>) => React.ReactNode;
}) {
  return (
    <section>
      <div className="growth-card">
        <div className="growth-card-head">
          <h2>{title}</h2>
          <ExportBtn rows={rows} filename={exportName} />
        </div>
        {filters}
        {loading ? <p className="growth-muted">Loading…</p> : null}
        {!loading && !rows.length ? (
          <EmptyState title={emptyTitle} body={emptyBody} action={emptyAction} />
        ) : (
          <div className="growth-table-wrap">
            <table className="growth-table">
              <thead>
                <tr>
                  {headers.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{rows.map((row) => renderRow(row))}</tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
