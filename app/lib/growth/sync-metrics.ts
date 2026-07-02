import type { SupabaseClient } from "@supabase/supabase-js";
import { growthDb } from "@/app/lib/growth/db";

const DEFAULT_TIMEZONE = "America/Chicago";

export type SyncMetricsResult = {
  metricDate: string;
  timezone: string;
  waitlist_signups: number;
  feedback_submissions: number;
  thumbs_up_count: number;
  thumbs_down_count: number;
  created: boolean;
  preservedManualFields: string[];
};

function metricsTimezone() {
  return process.env.METRICS_TIMEZONE?.trim() || DEFAULT_TIMEZONE;
}

/** Calendar date (YYYY-MM-DD) for an instant in the given IANA timezone. */
export function dateInTimezone(instant: Date, timeZone: string): string {
  return instant.toLocaleDateString("en-CA", { timeZone });
}

function getTimezoneOffsetMs(timeZone: string, date: Date): number {
  const utc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const zoned = new Date(date.toLocaleString("en-US", { timeZone }));
  return zoned.getTime() - utc.getTime();
}

/** UTC bounds for one calendar day in a timezone (for Supabase created_at filters). */
export function zonedDayRange(
  metricDate: string,
  timeZone: string,
): { startIso: string; endIso: string } {
  const [year, month, day] = metricDate.split("-").map(Number);
  const noonUtc = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const offsetMs = getTimezoneOffsetMs(timeZone, noonUtc);
  const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - offsetMs);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { startIso: start.toISOString(), endIso: end.toISOString() };
}

const AUTO_SYNC_FIELDS = [
  "waitlist_signups",
  "feedback_submissions",
  "thumbs_up_count",
  "thumbs_down_count",
] as const;

const MANUAL_FIELDS = [
  "website_visits",
  "beta_users_invited",
  "beta_users_active",
  "app_sessions",
  "email_subscribers",
  "email_open_rate",
  "email_click_rate",
  "x_followers",
  "linkedin_followers",
  "instagram_followers",
  "tiktok_followers",
  "facebook_groups_joined",
  "reddit_comments_posted",
  "creator_outreach_sent",
  "notes",
] as const;

async function countInRange(
  db: SupabaseClient,
  table: "waitlist_signups" | "phrase_feedback",
  startIso: string,
  endIso: string,
) {
  const { count, error } = await db
    .from(table)
    .select("id", { count: "exact", head: true })
    .gte("created_at", startIso)
    .lt("created_at", endIso);
  if (error) throw new Error(`${table}: ${error.message}`);
  return count ?? 0;
}

async function countFeedbackThumbs(
  db: SupabaseClient,
  startIso: string,
  endIso: string,
): Promise<{ total: number; thumbsUp: number; thumbsDown: number }> {
  const { data, error } = await db
    .from("phrase_feedback")
    .select("helpful")
    .gte("created_at", startIso)
    .lt("created_at", endIso);
  if (error) throw new Error(`phrase_feedback: ${error.message}`);
  const rows = data ?? [];
  const thumbsUp = rows.filter((r) => r.helpful === true).length;
  const thumbsDown = rows.filter((r) => r.helpful === false).length;
  return { total: rows.length, thumbsUp, thumbsDown };
}

export async function syncDailyMetrics(metricDate?: string): Promise<SyncMetricsResult> {
  const db = growthDb();
  if (!db) throw new Error("Database not configured.");

  const timeZone = metricsTimezone();
  const targetDate = metricDate ?? dateInTimezone(new Date(), timeZone);
  const { startIso, endIso } = zonedDayRange(targetDate, timeZone);

  const [waitlistCount, feedback] = await Promise.all([
    countInRange(db, "waitlist_signups", startIso, endIso),
    countFeedbackThumbs(db, startIso, endIso),
  ]);

  const autoPayload = {
    metric_date: targetDate,
    waitlist_signups: waitlistCount,
    feedback_submissions: feedback.total,
    thumbs_up_count: feedback.thumbsUp,
    thumbs_down_count: feedback.thumbsDown,
    updated_at: new Date().toISOString(),
  };

  const { data: existing } = await db
    .from("growth_metrics_daily")
    .select("*")
    .eq("metric_date", targetDate)
    .maybeSingle();

  const preservedManualFields = MANUAL_FIELDS.filter(
    (key) => existing?.[key] != null && existing[key] !== "",
  );

  let created = false;
  if (existing?.id) {
    const { error } = await db.from("growth_metrics_daily").update(autoPayload).eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await db.from("growth_metrics_daily").insert(autoPayload);
    if (error) throw new Error(error.message);
    created = true;
  }

  const result: SyncMetricsResult = {
    metricDate: targetDate,
    timezone: timeZone,
    waitlist_signups: waitlistCount,
    feedback_submissions: feedback.total,
    thumbs_up_count: feedback.thumbsUp,
    thumbs_down_count: feedback.thumbsDown,
    created,
    preservedManualFields: [...preservedManualFields],
  };

  await db.from("growth_agent_runs").insert({
    agent_name: "Daily Metrics Sync",
    run_date: targetDate,
    input: JSON.stringify({ metric_date: targetDate, timezone: timeZone, range: { startIso, endIso } }),
    output: JSON.stringify(result),
    status: "success",
    notes: `Auto-filled: ${AUTO_SYNC_FIELDS.join(", ")}`,
  });

  return result;
}
