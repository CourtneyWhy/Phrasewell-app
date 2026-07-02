"use client";

import { useEffect, useRef, useState } from "react";
import { growthFetch } from "@/app/lib/growth/client";
import type { DailyPlaybook } from "@/app/lib/growth/daily-playbooks";
import { getTodayPlaybooks } from "@/app/lib/growth/daily-playbooks";
import { getTaskGuide } from "@/app/lib/growth/task-guides";
import { GOTCHA_PITCH } from "@/app/lib/growth/launch-strategy";
import { getPhaseForDate } from "@/app/lib/growth/launch-phases";
import type { GrowthDailyTask, TaskStatus } from "@/app/lib/growth/types";
import { BigCheckbox, CopyBtn, EmptyState } from "./shared";

const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
  { value: "skipped", label: "Skipped" },
];

type ActionResult = { type: "success" | "warn" | "error"; text: string } | null;

type TodayTabProps = {
  todayIso: string;
  tasks: GrowthDailyTask[];
  onRefresh: () => void;
  onUpdateTask: (task: GrowthDailyTask, fields: Partial<GrowthDailyTask>) => void;
  onGoToTab: (tabId: string) => void;
};

function tabFromLink(link?: string | null) {
  if (!link) return null;
  const m = link.match(/tab=([a-z-]+)/);
  return m?.[1] ?? null;
}

export function TodayTab({
  todayIso,
  tasks,
  onRefresh,
  onUpdateTask,
  onGoToTab,
}: TodayTabProps) {
  const [playbooks, setPlaybooks] = useState<DailyPlaybook[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<ActionResult>(null);
  const [klaviyoSchedule, setKlaviyoSchedule] = useState<{ date: string; title: string }[]>([]);
  const checklistRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    growthFetch<{ playbooks: DailyPlaybook[] }>("/api/admin/growth/playbook")
      .then((d) => setPlaybooks(d.playbooks))
      .catch(() => setPlaybooks([]));
  }, [todayIso]);

  function scrollToChecklist() {
    setTimeout(() => {
      checklistRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }

  async function runAction(
    key: string,
    fn: () => Promise<{ ok?: boolean; message?: string; schedule?: { date: string; title: string }[] }>,
  ) {
    setLoading(key);
    setResult(null);
    try {
      const res = await fn();
      if (res.schedule) setKlaviyoSchedule(res.schedule);
      setResult({
        type: res.ok === false ? "warn" : "success",
        text: res.message ?? "Done.",
      });
      onRefresh();
      scrollToChecklist();
    } catch (e) {
      setResult({
        type: "error",
        text: e instanceof Error ? e.message : "Something went wrong.",
      });
    } finally {
      setLoading(null);
    }
  }

  const phase = getPhaseForDate(todayIso);
  const weekdayPlaybooks =
    playbooks.length > 0 ? playbooks : getTodayPlaybooks(todayIso);
  const focusPlaybook = weekdayPlaybooks.find((p) => p.id !== "daily-klaviyo-check");

  return (
    <section>
      <div className="growth-card growth-card-accent">
        <h2>Current phase: {phase.name}</h2>
        <p className="growth-muted" style={{ marginTop: 8, lineHeight: 1.55 }}>
          {phase.goal}
          {phase.id === "prep" ? (
            <>
              {" "}
              <strong>You are here:</strong> communities + waitlist. Invite people you know when login works. Skip influencer outreach for now.
            </>
          ) : null}
        </p>
      </div>

      <div className="growth-card growth-card-accent">
        <h2>Gotcha pitch</h2>
        <p className="growth-gotcha-pitch">{GOTCHA_PITCH}</p>
        <CopyBtn text={GOTCHA_PITCH} label="Copy pitch" />
        <button type="button" className="growth-btn growth-btn-secondary growth-btn-sm" style={{ marginTop: 8 }} onClick={() => onGoToTab("tools")}>
          Open Tools & Plan →
        </button>
      </div>

      <div className="growth-card growth-card-muted">
        <h2>Start here</h2>
        <p className="growth-muted">
          {phase.id === "prep"
            ? "Pre-launch focus: helpful comments on Reddit/FB, daily X post, waitlist link in bio. Skip beta feedback until you send handpicked invites."
            : "Micro-beta ≤25 parents only. Waitlist sees script cards, not app login. Batch emails Mondays + social Saturdays when you have time. Skip tasks on hard days."}
        </p>
        <div className="growth-playbook-actions">
          <button
            type="button"
            className="growth-btn growth-btn-primary"
            disabled={!!loading}
            onClick={() =>
              runAction("generate", () =>
                growthFetch("/api/admin/growth/generate-tasks", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({}),
                }),
              )
            }
          >
            {loading === "generate" ? "Working…" : "Generate today (tasks + social pack)"}
          </button>
          <button
            type="button"
            className="growth-btn growth-btn-secondary"
            disabled={!!loading}
            onClick={() =>
              runAction("regenerate", () =>
                growthFetch("/api/admin/growth/generate-tasks", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ regenerate: true }),
                }),
              )
            }
          >
            {loading === "regenerate" ? "Working…" : "Regenerate (fresh steps)"}
          </button>
          <button
            type="button"
            className="growth-btn growth-btn-secondary"
            disabled={!!loading}
            onClick={() =>
              runAction("klaviyo", () =>
                growthFetch("/api/admin/growth/generate-tasks", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({}),
                }),
              )
            }
          >
            {loading === "klaviyo" ? "Working…" : "Schedule Klaviyo (7 days)"}
          </button>
        </div>
        {result ? (
          <div className={`growth-action-result growth-action-result-${result.type}`} role="status">
            {result.text}
          </div>
        ) : null}
        {klaviyoSchedule.length > 0 ? (
          <div className="growth-klaviyo-schedule">
            <strong>7-day Klaviyo schedule:</strong>
            <ol>
              {klaviyoSchedule.map((s) => (
                <li key={s.date}>
                  <strong>{s.date === todayIso ? "Today" : s.date}:</strong> {s.title}
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>

      {focusPlaybook ? (
        <div className="growth-card growth-card-accent">
          <h2>Today&apos;s weekly playbook</h2>
          <p className="growth-muted" style={{ marginBottom: 12 }}>
            Your focus tab today is <strong>{focusPlaybook.dashboardTab}</strong>. Work through these steps, then use the checklist below.
          </p>
          <h3 style={{ fontSize: "1rem", margin: "0 0 8px" }}>{focusPlaybook.title}</h3>
          <ol className="growth-playbook-steps">
            {focusPlaybook.steps.map((s) => (
              <li key={s.step}>
                <strong>[{s.where}]</strong> {s.action}
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="growth-btn growth-btn-secondary growth-btn-sm"
            style={{ marginTop: 12 }}
            onClick={() => {
              const tab = focusPlaybook.dashboardTab.toLowerCase();
              if (tab.includes("email")) onGoToTab("email");
              else if (tab.includes("community")) onGoToTab("communities");
              else if (tab.includes("content engine")) onGoToTab("content-engine");
              else if (tab.includes("outreach")) onGoToTab("outreach");
              else if (tab.includes("feedback")) onGoToTab("feedback");
              else if (tab.includes("creator")) onGoToTab("creators");
              else if (tab.includes("launch")) onGoToTab("launch");
              else onGoToTab("today");
            }}
          >
            Open {focusPlaybook.dashboardTab} →
          </button>
        </div>
      ) : null}

      <div className="growth-card" ref={checklistRef}>
        <h2>Today&apos;s checklist {tasks.length > 0 ? `(${tasks.length})` : ""}</h2>
        <p className="growth-muted">Work top to bottom. Each task shows steps + a button to the tab with templates and lists.</p>

        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            body={'Click "Generate Today\'s Tasks" above.'}
          />
        ) : (
          <ul className="growth-guided-task-list">
            {tasks.map((task) => {
              const guide = getTaskGuide(task);
              const tabId = tabFromLink(task.link) ?? guide.tabId;

              return (
                <li key={task.id} className={`growth-guided-task${task.status === "done" ? " growth-guided-task-done" : ""}`}>
                  <div className="growth-guided-task-head">
                    <BigCheckbox
                      checked={task.status === "done"}
                      label=""
                      onChange={(done) =>
                        onUpdateTask(task, { status: done ? "done" : "not_started" })
                      }
                    />
                    <div className="growth-guided-task-title">
                      <span>{task.task_title}</span>
                      <span className="growth-guided-task-meta">
                        ~{guide.minutes} min
                      </span>
                    </div>
                    <button
                      type="button"
                      className="growth-btn growth-btn-primary growth-btn-sm growth-guided-open-tab"
                      onClick={() => onGoToTab(tabId)}
                    >
                      Open {guide.tabLabel} →
                    </button>
                  </div>

                  <div className="growth-guided-task-body">
                    <p className="growth-guided-done-when">
                      <strong>Done when:</strong> {guide.doneWhen}
                    </p>
                    <ol className="growth-guided-steps">
                      {guide.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                    {guide.tip ? (
                      <p className="growth-guided-tip">💡 {guide.tip}</p>
                    ) : null}
                    {guide.copyText ? (
                      <div className="growth-guided-copy">
                        <CopyBtn text={guide.copyText} label={guide.copyLabel ?? "Copy script"} />
                        <pre className="growth-guided-script">{guide.copyText}</pre>
                      </div>
                    ) : null}
                    {task.notes && task.task_type === "klaviyo-setup" ? (
                      <details className="growth-guided-extra">
                        <summary>Klaviyo technical steps</summary>
                        <pre>{task.notes}</pre>
                      </details>
                    ) : null}
                    <select
                      className="growth-guided-status"
                      value={task.status}
                      onChange={(e) => onUpdateTask(task, { status: e.target.value as TaskStatus })}
                      aria-label="Task status"
                    >
                      {TASK_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {weekdayPlaybooks.length > 1 ? (
        <details className="growth-card">
          <summary className="growth-weekday-playbook-summary">Also today: Klaviyo daily sync steps</summary>
          {weekdayPlaybooks
            .filter((p) => p.id === "daily-klaviyo-check")
            .map((pb) => (
              <div key={pb.id} className="growth-weekday-playbook">
                <h3>{pb.title}</h3>
                <ol className="growth-playbook-steps">
                  {pb.steps.map((s) => (
                    <li key={s.step}>
                      <strong>[{s.where}]</strong> {s.action}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
        </details>
      ) : null}
    </section>
  );
}
