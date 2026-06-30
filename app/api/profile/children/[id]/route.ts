import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/app/lib/supabase/server-auth";
import { normalizeAgeBand } from "@/app/lib/contentLibrary";
import { CHILD_RELATIONSHIPS } from "@/app/lib/profile/constants";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: "Auth not configured." }, { status: 503 });
  }

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.name === "string") patch.name = body.name.trim();
  if (typeof body.age_band === "string") patch.age_band = normalizeAgeBand(body.age_band);
  if (typeof body.relationship === "string") {
    if (!CHILD_RELATIONSHIPS.includes(body.relationship as (typeof CHILD_RELATIONSHIPS)[number])) {
      return NextResponse.json({ error: "Invalid relationship." }, { status: 400 });
    }
    patch.relationship = body.relationship;
  }

  const { data, error } = await supabase
    .from("user_children")
    .update(patch)
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .is("removed_at", null)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not update child." }, { status: 500 });
  }

  return NextResponse.json({ child: data });
}
