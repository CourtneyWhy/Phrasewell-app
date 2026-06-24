import { NextResponse } from "next/server";
import { growthDb, todayIso } from "@/app/lib/growth/db";
import { TODAY_CHECKLIST } from "@/app/lib/growth/seed-data";
import { getEnhancedDailyTasks, getKlaviyoBacklogTasks } from "@/app/lib/growth/daily-playbooks";

async function getNextKlaviyoFlow(db: ReturnType<typeof growthDb>) {
  if (!db) return null;
  const { data } = await db
    .from("growth_email_flows")
    .select("slug, name, status")
    .in("status", ["not_started", "in_klaviyo"])
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data;
}

async function getNextPipelineBehavior(db: ReturnType<typeof growthDb>) {
  if (!db) return null;
  const { data } = await db
    .from("growth_content_pipeline")
    .select("behavior_title, category_title")
    .eq("blog_status", "not_started")
    .order("category_id", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data;
}

import { resolveEmailBody } from "@/app/lib/growth/email-klaviyo-copy";

async function buildTaskRows(db: ReturnType<typeof growthDb>, today: string) {
  const [nextFlow, nextBehavior] = await Promise.all([
    getNextKlaviyoFlow(db),
    getNextPipelineBehavior(db),
  ]);

  const enhanced = getEnhancedDailyTasks(today, {
    nextFlow: nextFlow ? { slug: nextFlow.slug, name: nextFlow.name } : null,
    nextBehavior: nextBehavior ?? null,
  });

  return [...TODAY_CHECKLIST, ...enhanced].map((t) => ({
    task_date: today,
    ...t,
    status: "not_started",
  }));
}

export async function POST(request: Request) {
  const db = growthDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  let regenerate = false;
  try {
    const body = await request.json();
    regenerate = body?.regenerate === true;
  } catch {
    /* empty body ok */
  }

  const today = todayIso();

  const { data: existing } = await db
    .from("growth_daily_tasks")
    .select("id")
    .eq("task_date", today);

  if (existing && existing.length > 0 && !regenerate) {
    return NextResponse.json({ message: "Tasks already exist for today. Use Regenerate to replace them.", count: existing.length });
  }

  if (regenerate && existing && existing.length > 0) {
    const { error: delErr } = await db.from("growth_daily_tasks").delete().eq("task_date", today);
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });
  }

  const rows = await buildTaskRows(db, today);

  const { error } = await db.from("growth_daily_tasks").insert(rows);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    count: rows.length,
    regenerated: regenerate,
  });
}

/** Spread Klaviyo flow setup across 7 days starting today (or regenerate future klaviyo tasks) */
export async function PUT(request: Request) {
  const db = growthDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  let regenerate = false;
  try {
    const body = await request.json();
    regenerate = body?.regenerate === true;
  } catch {
    /* empty body ok */
  }

  const today = todayIso();

  if (!regenerate) {
    const { count } = await db
      .from("growth_daily_tasks")
      .select("id", { count: "exact", head: true })
      .eq("task_type", "klaviyo-setup")
      .gte("task_date", today);

    if ((count ?? 0) > 0) {
      return NextResponse.json({
        error: "Klaviyo setup tasks already scheduled. Use Regenerate to replace them.",
        count,
      }, { status: 409 });
    }
  } else {
    const { error: delErr } = await db
      .from("growth_daily_tasks")
      .delete()
      .eq("task_type", "klaviyo-setup")
      .gte("task_date", today);
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });
  }

  const backlog = getKlaviyoBacklogTasks(today).map((t) => ({
    ...t,
    status: "not_started",
  }));

  const { error } = await db.from("growth_daily_tasks").insert(backlog);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    count: backlog.length,
    regenerated: regenerate,
    message: "One Klaviyo flow per day scheduled.",
  });
}
