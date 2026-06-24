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

  const { count: communityCount } = await db
    .from("growth_communities")
    .select("id", { count: "exact", head: true });

  if ((communityCount ?? 0) > 0) {
    return NextResponse.json({ error: "Seed data already exists. Clear tables first if you want to re-seed." }, { status: 409 });
  }

  const communities = getSeedCommunities();
  const creators = getSeedCreators();
  const content = generateContentCalendar();
  const tasks = generateDailyTasks();

  const results = await Promise.all([
    db.from("growth_communities").insert(communities),
    db.from("growth_creators").insert(creators),
    db.from("growth_content_calendar").insert(content),
    db.from("growth_daily_tasks").insert(tasks),
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
  });
}
