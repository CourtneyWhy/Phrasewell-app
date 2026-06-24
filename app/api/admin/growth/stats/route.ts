import { NextResponse } from "next/server";
import { growthDb, todayIso, daysUntil } from "@/app/lib/growth/db";
import { LAUNCH_DATE } from "@/app/lib/growth/launch-phases";

export async function GET() {
  const db = growthDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const today = todayIso();

  const [waitlist, feedbackRes, revenue, tasksToday, metrics] = await Promise.all([
    db.from("waitlist_signups").select("id", { count: "exact", head: true }),
    db.from("phrase_feedback").select("helpful"),
    db.from("growth_revenue_daily").select("cumulative_launch_revenue, net_revenue"),
    db.from("growth_daily_tasks").select("*").eq("task_date", today),
    db.from("growth_metrics_daily").select("*").eq("metric_date", today).maybeSingle(),
  ]);

  const feedbackRows = feedbackRes.data ?? [];
  const thumbsUp = feedbackRows.filter((r) => r.helpful === true).length;
  const thumbsDown = feedbackRows.filter((r) => r.helpful === false).length;
  const totalFeedback = feedbackRows.length;

  const cumulativeRevenue =
    revenue.data?.reduce((sum, r) => sum + Number(r.net_revenue ?? r.cumulative_launch_revenue ?? 0), 0) ?? 0;

  const latestCumulative = revenue.data?.length
    ? Math.max(...revenue.data.map((r) => Number(r.cumulative_launch_revenue ?? 0)))
    : cumulativeRevenue;

  return NextResponse.json({
    today,
    daysUntilLaunch: daysUntil(LAUNCH_DATE),
    launchDate: LAUNCH_DATE,
    waitlistTotal: waitlist.count ?? 0,
    feedbackTotal: totalFeedback,
    thumbsUp,
    thumbsDown,
    thumbsUpPct: totalFeedback ? Math.round((thumbsUp / totalFeedback) * 100) : 0,
    ltdRevenueTotal: latestCumulative,
    betaUsersActive: metrics.data?.beta_users_active ?? null,
    todayTasks: tasksToday.data ?? [],
  });
}
