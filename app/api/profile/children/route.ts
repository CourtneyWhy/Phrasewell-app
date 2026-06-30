import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/app/lib/supabase/server-auth";
import { normalizeAgeBand } from "@/app/lib/contentLibrary";
import { CHILD_RELATIONSHIPS } from "@/app/lib/profile/constants";

export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: "Auth not configured." }, { status: 503 });
  }

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { name?: string; age_band?: string; relationship?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "Name or nickname is required." }, { status: 400 });
  }

  if (!body.relationship || !CHILD_RELATIONSHIPS.includes(body.relationship as (typeof CHILD_RELATIONSHIPS)[number])) {
    return NextResponse.json({ error: "Select a relationship." }, { status: 400 });
  }

  const { count } = await supabase
    .from("user_children")
    .select("*", { count: "exact", head: true })
    .eq("user_id", auth.user.id)
    .is("removed_at", null);

  const { data, error } = await supabase
    .from("user_children")
    .insert({
      user_id: auth.user.id,
      name,
      age_band: normalizeAgeBand(body.age_band ?? "4-7"),
      relationship: body.relationship,
      sort_order: count ?? 0,
    })
    .select()
    .single();

  if (error) {
    console.error("add child:", error);
    return NextResponse.json({ error: "Could not add child." }, { status: 500 });
  }

  return NextResponse.json({ child: data });
}
