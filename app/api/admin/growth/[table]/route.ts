import { NextResponse } from "next/server";
import { growthDb } from "@/app/lib/growth/db";

const TABLE_MAP: Record<string, string> = {
  "daily-tasks": "growth_daily_tasks",
  communities: "growth_communities",
  creators: "growth_creators",
  content: "growth_content_calendar",
  outreach: "growth_outreach",
  metrics: "growth_metrics_daily",
  revenue: "growth_revenue_daily",
  agents: "growth_agent_runs",
  "email-segments": "growth_email_segments",
  "email-flows": "growth_email_flows",
  "email-flow-emails": "growth_email_flow_emails",
  "email-campaigns": "growth_email_campaigns",
  "email-library": "growth_email_library",
  "email-analytics": "growth_email_analytics_daily",
  "content-pipeline": "growth_content_pipeline",
};

type RouteContext = { params: Promise<{ table: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { table } = await context.params;
  const supabaseTable = TABLE_MAP[table];
  if (!supabaseTable) {
    return NextResponse.json({ error: "Unknown table." }, { status: 404 });
  }

  const db = growthDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  let query = db.from(supabaseTable).select("*");

  const status = searchParams.get("status");
  const platform = searchParams.get("platform");
  const priority = searchParams.get("priority");
  const date = searchParams.get("date");
  const dateField =
    table === "daily-tasks"
      ? "task_date"
      : table === "content"
        ? "publish_date"
        : table === "outreach"
          ? "outreach_date"
          : table === "metrics"
            ? "metric_date"
            : table === "revenue"
              ? "revenue_date"
              : table === "email-analytics"
                ? "metric_date"
                : table === "email-campaigns"
                  ? "send_date"
                  : null;

  const statusField =
    table === "daily-tasks"
      ? "status"
      : table === "communities"
        ? "joined_status"
        : table === "creators"
          ? "contact_status"
          : table === "content" ||
              table === "outreach" ||
              table === "email-flows" ||
              table === "email-flow-emails" ||
              table === "email-campaigns" ||
              table === "email-library" ||
              table === "email-segments"
            ? "status"
            : null;

  const category = searchParams.get("category");
  const flowSlug = searchParams.get("flow");

  const hasPriority = table === "daily-tasks" || table === "communities" || table === "creators";

  if (status && statusField) query = query.eq(statusField, status);
  if (platform) query = query.eq("platform", platform);
  if (priority && hasPriority) query = query.eq("priority", priority);
  if (date && dateField) query = query.eq(dateField, date);
  if (category && table === "content-pipeline") query = query.eq("category_id", category);
  if (flowSlug && table === "email-flow-emails") query = query.eq("flow_slug", flowSlug);
  if (flowSlug && table === "email-library") query = query.eq("flow_slug", flowSlug);

  if (table === "email-flows") {
    query = query.order("sort_order", { ascending: true });
  } else if (table === "email-flow-emails") {
    query = query.order("step_number", { ascending: true });
  } else if (table === "email-campaigns") {
    query = query.order("send_date", { ascending: true });
  } else if (table === "content-pipeline") {
    query = query.order("category_id", { ascending: true }).order("behavior_title", { ascending: true });
  } else if (dateField && !date && (table === "daily-tasks" || table === "content")) {
    query = query.order(dateField, { ascending: true });
  } else if (table === "metrics" || table === "revenue" || table === "outreach") {
    query = query.order(dateField!, { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query.limit(table === "content-pipeline" ? 200 : 500);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request, context: RouteContext) {
  const { table } = await context.params;
  const supabaseTable = TABLE_MAP[table];
  if (!supabaseTable) {
    return NextResponse.json({ error: "Unknown table." }, { status: 404 });
  }

  const db = growthDb();
  if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  const body = await request.json();
  const row = { ...body, updated_at: new Date().toISOString() };
  delete row.id;

  const { data, error } = await db.from(supabaseTable).insert(row).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { table } = await context.params;
  const supabaseTable = TABLE_MAP[table];
  if (!supabaseTable) {
    return NextResponse.json({ error: "Unknown table." }, { status: 404 });
  }

  const db = growthDb();
  if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  const body = await request.json();
  const { id, ...fields } = body as { id: string };
  if (!id) return NextResponse.json({ error: "id required." }, { status: 400 });

  const { data, error } = await db
    .from(supabaseTable)
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
