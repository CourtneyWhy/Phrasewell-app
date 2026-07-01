import { NextResponse } from "next/server";
import { growthDb } from "@/app/lib/growth/db";
import {
  getSeedCommunities,
  getSeedCreators,
  generateContentCalendar,
  generateDailyTasks,
} from "@/app/lib/growth/seed-data";

export async function POST() {
  const db = growthDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const [communitiesRes, creatorsRes, contentRes, tasksRes] = await Promise.all([
    db.from("growth_communities").select("id", { count: "exact", head: true }),
    db.from("growth_creators").select("id", { count: "exact", head: true }),
    db.from("growth_content_calendar").select("id", { count: "exact", head: true }),
    db.from("growth_daily_tasks").select("id", { count: "exact", head: true }),
  ]);

  const communityCount = communitiesRes.count ?? 0;
  const creatorCount = creatorsRes.count ?? 0;
  const contentCount = contentRes.count ?? 0;
  const taskCount = tasksRes.count ?? 0;

  const communities = communityCount === 0 ? getSeedCommunities() : [];
  const creators = creatorCount === 0 ? getSeedCreators() : [];
  const content = contentCount === 0 ? generateContentCalendar() : [];
  const tasks = taskCount === 0 ? generateDailyTasks() : [];

  if (!communities.length && !creators.length && !content.length && !tasks.length) {
    return NextResponse.json({
      ok: true,
      message: "Seed data already loaded. Communities, creators, content, and tasks all exist.",
      communities: 0,
      creators: 0,
      content: 0,
      tasks: 0,
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
