import { NextResponse } from "next/server";
import { growthDb } from "@/app/lib/growth/db";

export async function GET(request: Request) {
  const db = growthDb();
  if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? 100);

  const { data, error } = await db
    .from("phrase_feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(Math.min(limit, 500));

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = data ?? [];
  const thumbsUp = rows.filter((r) => r.helpful === true).length;
  const thumbsDown = rows.filter((r) => r.helpful === false).length;
  const total = rows.length;

  const byCategory: Record<string, { up: number; down: number }> = {};
  rows.forEach((r) => {
    const cat = (r.category_name as string) || "Unknown";
    if (!byCategory[cat]) byCategory[cat] = { up: 0, down: 0 };
    if (r.helpful) byCategory[cat].up++;
    else byCategory[cat].down++;
  });

  let worstCategory = "—";
  let worstRate = 1;
  Object.entries(byCategory).forEach(([cat, v]) => {
    const t = v.up + v.down;
    if (t >= 3) {
      const rate = v.down / t;
      if (rate > worstRate) {
        worstRate = rate;
        worstCategory = cat;
      }
    }
  });

  return NextResponse.json({
    data: rows,
    summary: {
      total,
      thumbsUp,
      thumbsDown,
      thumbsUpPct: total ? Math.round((thumbsUp / total) * 100) : 0,
      worstCategory,
      byCategory,
    },
  });
}

export async function PATCH(request: Request) {
  const db = growthDb();
  if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  const body = await request.json();
  const { id, ...fields } = body as { id: string };
  if (!id) return NextResponse.json({ error: "id required." }, { status: 400 });

  const { data, error } = await db.from("phrase_feedback").update(fields).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
