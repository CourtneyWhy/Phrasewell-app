import { NextResponse } from "next/server";
import { syncDailyMetrics } from "@/app/lib/growth/sync-metrics";

/** Manual sync from Growth OS (admin cookie required via middleware). */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { metric_date?: string };
    const metricDate =
      typeof body.metric_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.metric_date)
        ? body.metric_date
        : undefined;
    const result = await syncDailyMetrics(metricDate);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
