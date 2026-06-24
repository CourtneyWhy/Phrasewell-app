"use client";

import { useEffect, useState } from "react";
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

type TodayTabProps = {
  todayIso: string;
  tasks: GrowthDailyTask[];
  onGenerateTasks: () => void;
  onRegenerateTasks: () => void;
  onGenerateKlaviyoBacklog: () => void;
  onRegenerateKlaviyoBacklog: () => void;
  onUpdateTask: (task: GrowthDailyTask, fields: Partial<GrowthDailyTask>) => void;
  onGoToTab: (tabId: string) => void;
};

export function TodayTab({
  todayIso,
  tasks,
  onGenerateTasks,
  onRegenerateTasks,
  onGenerateKlaviyoBacklog,
  onRegenerateKlaviyoBacklog,
  onUpdateTask,
  onGoToTab,
}: TodayTabProps) {
  const [playbooks, setPlaybooks] = useState<DailyPlaybook[]>([]);

  useEffect(() => {
    growthFetch<{ playbooks: DailyPlaybook[] }>("/api/admin/growth/playbook")
      .then((d) => setPlaybooks(d.playbooks))
      .catch(() => setPlaybooks([]));
  }, [todayIso]);

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
          Each day focuses on specific dashboard tabs + Klaviyo. Follow the steps, then check off matching tasks below.
        </p>
        <div className="growth-playbook-actions">
          <button type="button" className="growth-btn growth-btn-primary" onClick={onGenerateTasks}>
            Generate Today&apos;s Tasks
          </button>
          <button type="button" className="growth-btn growth-btn-secondary" onClick={onRegenerateTasks}>
            Regenerate Today&apos;s Tasks
          </button>
          <button type="button" className="growth-btn growth-btn-secondary" onClick={onGenerateKlaviyoBacklog}>
            Schedule Klaviyo setup (7 days)
          </button>
          <button type="button" className="growth-btn growth-btn-secondary" onClick={onRegenerateKlaviyoBacklog}>
            Regenerate Klaviyo schedule
          </button>
        </div>
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

      <div className="growth-card">
        <h2>Today&apos;s checklist</h2>
        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks for today"
            body='Click "Generate Today&apos;s Tasks" above. Tasks include tab-specific steps in Klaviyo and Content Engine.'
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
