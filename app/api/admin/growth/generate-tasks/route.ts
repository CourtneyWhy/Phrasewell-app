import { NextResponse } from "next/server";
import { growthDb, todayIso } from "@/app/lib/growth/db";
import { TODAY_CHECKLIST } from "@/app/lib/growth/seed-data";

export async function POST() {
  const db = growthDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const today = todayIso();

  const { data: existing } = await db
    .from("growth_daily_tasks")
    .select("id")
    .eq("task_date", today);

  if (existing && existing.length > 0) {
    return NextResponse.json({ message: "Tasks already exist for today.", count: existing.length });
  }

  const rows = TODAY_CHECKLIST.map((t) => ({
    task_date: today,
    ...t,
    status: "not_started",
  }));

  const { error } = await db.from("growth_daily_tasks").insert(rows);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, count: rows.length });
}
