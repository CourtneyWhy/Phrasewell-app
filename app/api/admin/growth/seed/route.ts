import { NextResponse } from "next/server";
import { growthDb } from "@/app/lib/growth/db";
import {
  getSeedCommunities,
  getSeedCreators,
  generateContentCalendar,
  generateDailyTasks,
} from "@/app/lib/growth/seed-data";

type SeedBody = { only?: "creators" | "communities" | "content" | "tasks" | "all" };

function tableError(label: string, error: { message: string } | null) {
  if (!error) return null;
  if (error.message.includes("does not exist") || error.message.includes("schema cache")) {
    return `${label} table missing. Run supabase/migrations/004_growth_schema.sql in Supabase SQL Editor.`;
  }
  return `${label}: ${error.message}`;
}

export async function POST(request: Request) {
  const db = growthDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  let body: SeedBody = {};
  try {
    body = (await request.json()) as SeedBody;
  } catch {
    /* empty body ok */
  }

  const only = body.only ?? "all";

  const [communitiesRes, creatorsRes, contentRes, tasksRes] = await Promise.all([
    db.from("growth_communities").select("id", { count: "exact", head: true }),
    db.from("growth_creators").select("id", { count: "exact", head: true }),
    db.from("growth_content_calendar").select("id", { count: "exact", head: true }),
    db.from("growth_daily_tasks").select("id", { count: "exact", head: true }),
  ]);

  const tableErrors = [
    tableError("growth_communities", communitiesRes.error),
    tableError("growth_creators", creatorsRes.error),
    tableError("growth_content_calendar", contentRes.error),
    tableError("growth_daily_tasks", tasksRes.error),
  ].filter(Boolean);

  if (tableErrors.length > 0) {
    return NextResponse.json({ error: tableErrors.join(" ") }, { status: 500 });
  }

  const communityCount = communitiesRes.count ?? 0;
  const creatorCount = creatorsRes.count ?? 0;
  const contentCount = contentRes.count ?? 0;
  const taskCount = tasksRes.count ?? 0;

  const wantCommunities = only === "all" || only === "communities";
  const wantCreators = only === "all" || only === "creators";
  const wantContent = only === "all" || only === "content";
  const wantTasks = only === "all" || only === "tasks";

  const communities = wantCommunities && communityCount === 0 ? getSeedCommunities() : [];
  const creators = wantCreators && creatorCount === 0 ? getSeedCreators() : [];
  const content = wantContent && contentCount === 0 ? generateContentCalendar() : [];
  const tasks = wantTasks && taskCount === 0 ? generateDailyTasks() : [];

  if (!communities.length && !creators.length && !content.length && !tasks.length) {
    const hint =
      only === "creators" && creatorCount > 0
        ? `${creatorCount} creators already in database.`
        : "Seed data already loaded for the selected tables.";
    return NextResponse.json({
      ok: true,
      message: hint,
      communities: 0,
      creators: 0,
      content: 0,
      tasks: 0,
      creatorCount,
    });
  }

  const results = await Promise.all([
    communities.length ? db.from("growth_communities").insert(communities) : Promise.resolve({ error: null }),
    creators.length ? db.from("growth_creators").insert(creators) : Promise.resolve({ error: null }),
    content.length ? db.from("growth_content_calendar").insert(content) : Promise.resolve({ error: null }),
    tasks.length ? db.from("growth_daily_tasks").insert(tasks) : Promise.resolve({ error: null }),
  ]);

  const err = results.find((r) => r.error);
  if (err?.error) {
    console.error("seed error:", err.error);
    return NextResponse.json({ error: err.error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    communities: communities.length,
    creators: creators.length,
    content: content.length,
    tasks: tasks.length,
    creatorCount: creatorCount + creators.length,
    message: [
      communities.length ? `${communities.length} communities` : null,
      creators.length ? `${creators.length} creators` : null,
      content.length ? `${content.length} content ideas` : null,
      tasks.length ? `${tasks.length} daily tasks` : null,
    ]
      .filter(Boolean)
      .join(", ") || "Nothing new to load",
  });
}
