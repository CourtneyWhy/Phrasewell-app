"use client";

import type { ReactNode } from "react";
import { exportCsv } from "@/app/lib/growth/client";

export function StatusBadge({ status }: { status: string }) {
  const s = status.replace(/_/g, " ");
  return <span className={`growth-badge growth-badge-${status.split("_")[0]}`}>{s}</span>;
}

export function BigCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="growth-checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="growth-checkbox-input"
      />
      <span className="growth-checkbox-box" aria-hidden />
      <span>{label}</span>
    </label>
  );
}

export function FilterBar({
  platform,
  setPlatform,
  status,
  setStatus,
  priority,
  setPriority,
  date,
  setDate,
  showDate = false,
  showPriority = true,
  platforms = ["", "Reddit", "Facebook", "X", "LinkedIn", "Instagram", "TikTok", "Blog", "Podcast", "Email"],
  statusOptions = [],
}: {
  platform: string;
  setPlatform: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  priority: string;
  setPriority: (v: string) => void;
  date?: string;
  setDate?: (v: string) => void;
  showDate?: boolean;
  showPriority?: boolean;
  platforms?: string[];
  statusOptions?: { value: string; label: string }[];
}) {
  return (
    <div className="growth-filters">
      <select value={platform} onChange={(e) => setPlatform(e.target.value)} aria-label="Platform">
        <option value="">All platforms</option>
        {platforms.filter(Boolean).map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      {statusOptions.length > 0 ? (
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="">All statuses</option>
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : null}
      {showPriority ? (
        <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority">
          <option value="">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      ) : null}
      {showDate && setDate ? (
        <input type="date" value={date ?? ""} onChange={(e) => setDate(e.target.value)} aria-label="Date" />
      ) : null}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="growth-empty">
      <h3>{title}</h3>
      <p>{body}</p>
      {action ? <div style={{ marginTop: 12 }}>{action}</div> : null}
    </div>
  );
}

export function ExportBtn({ rows, filename }: { rows: Record<string, unknown>[]; filename: string }) {
  return (
    <button
      type="button"
      className="growth-btn growth-btn-secondary"
      disabled={!rows.length}
      onClick={() => exportCsv(filename, rows)}
    >
      Export CSV
    </button>
  );
}

export function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  return (
    <button
      type="button"
      className="growth-btn growth-btn-secondary growth-btn-sm"
      onClick={() => navigator.clipboard.writeText(text)}
    >
      {label}
    </button>
  );
}

export function SimpleBars({
  items,
}: {
  items: { label: string; value: number; max?: number }[];
}) {
  const max = Math.max(...items.map((i) => i.max ?? i.value), 1);
  return (
    <div className="growth-bars">
      {items.map((item) => (
        <div key={item.label} className="growth-bar-row">
          <span className="growth-bar-label">{item.label}</span>
          <div className="growth-bar-track">
            <div className="growth-bar-fill" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
          <span className="growth-bar-value">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="growth-stat-card">
      <p className="growth-stat-label">{label}</p>
      <p className="growth-stat-value">{value}</p>
      {sub ? <p className="growth-stat-sub">{sub}</p> : null}
    </div>
  );
}

export function patchRow(table: string, id: string, fields: Record<string, unknown>) {
  return fetch(`/api/admin/growth/${table}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...fields }),
  });
}

export function buildQuery(filters: { platform?: string; status?: string; priority?: string; date?: string }) {
  const q = new URLSearchParams();
  if (filters.platform) q.set("platform", filters.platform);
  if (filters.status) q.set("status", filters.status);
  if (filters.priority) q.set("priority", filters.priority);
  if (filters.date) q.set("date", filters.date);
  const s = q.toString();
  return s ? `?${s}` : "";
}
