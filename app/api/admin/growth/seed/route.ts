import { NextResponse } from "next/server";
import { growthDb } from "@/app/lib/growth/db";
import {
  getSeedCommunities,
  getSeedCreators,
  generateContentCalendar,
  generateDailyTasks,
} from "@/app/lib/growth/seed-data";

type SeedBody = {
  only?: "creators" | "communities" | "content" | "tasks" | "all";
  force?: boolean;
};

async function readCounts(db: NonNullable<ReturnType<typeof growthDb>>) {
  const [communitiesRes, creatorsRes, contentRes, tasksRes] = await Promise.all([
    db.from("growth_communities").select("id", { count: "exact", head: true }),
    db.from("growth_creators").select("id", { count: "exact", head: true }),
    db.from("growth_content_calendar").select("id", { count: "exact", head: true }),
    db.from("growth_daily_tasks").select("id", { count: "exact", head: true }),
  ]);

  return {
    errors: {
      communities: communitiesRes.error?.message ?? null,
      creators: creatorsRes.error?.message ?? null,
      content: contentRes.error?.message ?? null,
      tasks: tasksRes.error?.message ?? null,
    },
    counts: {
      communities: communitiesRes.count ?? 0,
      creators: creatorsRes.count ?? 0,
      content: contentRes.count ?? 0,
      tasks: tasksRes.count ?? 0,
    },
  };
}

function tableError(label: string, error: string | null) {
  if (!error) return null;
  if (error.includes("does not exist") || error.includes("schema cache")) {
    return `${label} table missing. Run supabase/migrations/004_growth_schema.sql in Supabase SQL Editor.`;
  }
  return `${label}: ${error}`;
}

function formatCounts(counts: { communities: number; creators: number; content: number; tasks: number }) {
  return `Database now has ${counts.communities} communities, ${counts.creators} creators, ${counts.content} content items, ${counts.tasks} tasks.`;
}

export async function GET() {
  const db = growthDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const { errors, counts } = await readCounts(db);
  const tableErrors = [
    tableError("growth_communities", errors.communities),
    tableError("growth_creators", errors.creators),
    tableError("growth_content_calendar", errors.content),
    tableError("growth_daily_tasks", errors.tasks),
  ].filter(Boolean);

  return NextResponse.json({
    ok: tableErrors.length === 0,
    counts,
    errors: tableErrors,
    hint:
      counts.creators === 0
        ? "Creators table is empty. Use Load creator list on the Creators tab."
        : "Creators exist in the database. If the tab is empty, refresh the page or clear filters.",
  });
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
  const force = body.force === true;

  const { errors, counts: before } = await readCounts(db);

  const tableErrors = [
    tableError("growth_communities", errors.communities),
    tableError("growth_creators", errors.creators),
    tableError("growth_content_calendar", errors.content),
    tableError("growth_daily_tasks", errors.tasks),
  ].filter(Boolean);

  if (tableErrors.length > 0) {
    return NextResponse.json({ error: tableErrors.join(" ") }, { status: 500 });
  }

  const wantCommunities = only === "all" || only === "communities";
  const wantCreators = only === "all" || only === "creators";
  const wantContent = only === "all" || only === "content";
  const wantTasks = only === "all" || only === "tasks";

  if (force && wantCreators && before.creators > 0) {
    const { error: delErr } = await db.from("growth_creators").delete().gte("created_at", "1970-01-01");
    if (delErr) {
      return NextResponse.json({ error: `Could not clear creators: ${delErr.message}` }, { status: 500 });
    }
  }

  const communities =
    wantCommunities && (before.communities === 0 || (force && only === "communities"))
      ? getSeedCommunities()
      : [];
  const creators =
    wantCreators && (before.creators === 0 || (force && only === "creators"))
      ? getSeedCreators()
      : [];
  const content =
    wantContent && (before.content === 0 || (force && only === "content"))
      ? generateContentCalendar()
      : [];
  const tasks =
    wantTasks && (before.tasks === 0 || (force && only === "tasks")) ? generateDailyTasks() : [];

  if (!communities.length && !creators.length && !content.length && !tasks.length) {
    return NextResponse.json({
      ok: true,
      inserted: { communities: 0, creators: 0, content: 0, tasks: 0 },
      counts: before,
      message: `Nothing new inserted. ${formatCounts(before)}`,
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

  const { counts: after } = await readCounts(db);

  return NextResponse.json({
    ok: true,
    inserted: {
      communities: communities.length,
      creators: creators.length,
      content: content.length,
      tasks: tasks.length,
    },
    counts: after,
    message: [
      communities.length ? `Added ${communities.length} communities` : null,
      creators.length ? `Added ${creators.length} creators` : null,
      content.length ? `Added ${content.length} content ideas` : null,
      tasks.length ? `Added ${tasks.length} tasks` : null,
      formatCounts(after),
    ]
      .filter(Boolean)
      .join(". "),
  });
}
