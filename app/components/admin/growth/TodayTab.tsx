"use client";

import { useEffect, useRef, useState } from "react";
import { growthFetch } from "@/app/lib/growth/client";
import type { DailyPlaybook } from "@/app/lib/growth/daily-playbooks";
import type { GrowthDailyTask, TaskStatus } from "@/app/lib/growth/types";
import { BigCheckbox, EmptyState } from "./shared";

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
        text: e instanceof Error ? e.message : "Something went wrong. Check Supabase migration 004 is run.",
      });
    } finally {
      setLoading(null);
    }
  }

  const tabFromLink = (link?: string | null) => {
    if (!link) return null;
    const m = link.match(/tab=([a-z-]+)/);
    return m?.[1] ?? null;
  };

  return (
    <section>
      <div className="growth-card growth-card-muted">
        <h2>Today&apos;s playbook — what to update and where</h2>
        <p className="growth-muted">
          Buttons add tasks to your checklist below (scroll down after clicking). Klaviyo schedule spreads 7 flows across 7 days — only today&apos;s flow appears in today&apos;s checklist.
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
            {loading === "generate" ? "Working…" : "Generate Today's Tasks"}
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
            {loading === "regenerate" ? "Working…" : "Regenerate Today's Tasks"}
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
          <button
            type="button"
            className="growth-btn growth-btn-secondary"
            disabled={!!loading}
            onClick={() =>
              runAction("klaviyo-regen", () =>
                growthFetch("/api/admin/growth/generate-tasks", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ regenerate: true }),
                }),
              )
            }
          >
            {loading === "klaviyo-regen" ? "Working…" : "Regenerate Klaviyo schedule"}
          </button>
        </div>

        {result ? (
          <div className={`growth-action-result growth-action-result-${result.type}`} role="status">
            {result.text}
          </div>
        ) : null}

        {klaviyoSchedule.length > 0 ? (
          <div className="growth-klaviyo-schedule">
            <strong>7-day Klaviyo build schedule:</strong>
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

      {playbooks.map((pb) => (
        <div key={pb.id} className="growth-card">
          <div className="growth-card-head">
            <h3>{pb.title}</h3>
            <button
              type="button"
              className="growth-btn growth-btn-sm growth-btn-secondary"
              onClick={() => {
                const map: Record<string, string> = {
                  "Email Marketing": "email",
                  Communities: "communities",
                  "Content Engine": "content-engine",
                  "Beta Feedback": "feedback",
                  Creators: "creators",
                  "Launch Calendar": "launch",
                  Metrics: "metrics",
                };
                onGoToTab(map[pb.dashboardTab] ?? "email");
              }}
            >
              Open {pb.dashboardTab}
            </button>
          </div>
          {pb.klaviyoLocation ? (
            <p className="growth-muted">
              <strong>Klaviyo:</strong> {pb.klaviyoLocation}
            </p>
          ) : null}
          <ol className="growth-playbook-steps">
            {pb.steps.map((s) => (
              <li key={s.step}>
                <strong>[{s.where}]</strong> {s.action}
              </li>
            ))}
          </ol>
        </div>
      ))}

      <div className="growth-card" ref={checklistRef}>
        <h2>Today&apos;s checklist {tasks.length > 0 ? `(${tasks.length})` : ""}</h2>
        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks for today"
            body="Click Generate Today's Tasks above. The list will appear here with checkboxes."
          />
        ) : (
          <ul className="growth-task-list">
            {tasks.map((task) => (
              <li key={task.id} className="growth-task-row">
                <BigCheckbox
                  checked={task.status === "done"}
                  label={task.task_title}
                  onChange={(done) =>
                    onUpdateTask(task, { status: done ? "done" : "not_started" })
                  }
                />
                <div className="growth-task-meta">
                  {task.platform ? <span className="growth-tag">{task.platform}</span> : null}
                  {task.task_type ? <span className="growth-tag">{task.task_type}</span> : null}
                  {tabFromLink(task.link) ? (
                    <button
                      type="button"
                      className="growth-btn growth-btn-sm growth-btn-secondary"
                      onClick={() => onGoToTab(tabFromLink(task.link)!)}
                    >
                      Go to tab
                    </button>
                  ) : null}
                  <select
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
                {task.notes ? <pre className="growth-task-steps">{task.notes}</pre> : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
