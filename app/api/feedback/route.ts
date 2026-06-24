import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/app/lib/supabase/server";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;

  const helpful = data.helpful;
  if (typeof helpful !== "boolean") {
    return NextResponse.json({ error: "Feedback rating is required." }, { status: 400 });
  }

  const cardId = typeof data.card_id === "string" ? data.card_id.trim() : "";
  const behaviorId = typeof data.behavior_id === "string" ? data.behavior_id.trim() : "";
  const ageBand = typeof data.age_band === "string" ? data.age_band.trim() : "";
  const momentId = typeof data.moment_id === "string" ? data.moment_id.trim() : "";
  const sayThis = typeof data.say_this === "string" ? data.say_this.trim() : "";

  if (!cardId || !behaviorId || !ageBand || !momentId || !sayThis) {
    return NextResponse.json({ error: "Missing phrase context." }, { status: 400 });
  }

  const comment =
    typeof data.comment === "string" ? data.comment.trim().slice(0, 2000) : "";

  const supabase = createSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "Feedback is temporarily unavailable." },
      { status: 503 },
    );
  }

  const { error } = await supabase.from("phrase_feedback").insert({
    helpful,
    comment: comment || null,
    card_id: cardId,
    behavior_id: behaviorId,
    behavior_name: typeof data.behavior_name === "string" ? data.behavior_name : null,
    category_id: typeof data.category_id === "string" ? data.category_id : null,
    category_name: typeof data.category_name === "string" ? data.category_name : null,
    age_band: ageBand,
    moment_id: momentId,
    say_this: sayThis,
    do_this: typeof data.do_this === "string" ? data.do_this : null,
    helpful_note: typeof data.helpful_note === "string" ? data.helpful_note : null,
    page_path: typeof data.page_path === "string" ? data.page_path : null,
    source: "app",
  });

  if (error) {
    console.error("phrase_feedback insert error:", error);
    return NextResponse.json({ error: "Could not save feedback." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
