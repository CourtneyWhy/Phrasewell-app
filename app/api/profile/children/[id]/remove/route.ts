import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/app/lib/supabase/server-auth";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: "Auth not configured." }, { status: 503 });
  }

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("user_children")
    .update({ removed_at: now, updated_at: now })
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .is("removed_at", null)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not remove child." }, { status: 500 });
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("default_child_id")
    .eq("id", auth.user.id)
    .single();

  if (profile?.default_child_id === id) {
    const { data: nextChild } = await supabase
      .from("user_children")
      .select("id")
      .eq("user_id", auth.user.id)
      .is("removed_at", null)
      .order("sort_order")
      .limit(1)
      .maybeSingle();

    await supabase
      .from("user_profiles")
      .update({ default_child_id: nextChild?.id ?? null })
      .eq("id", auth.user.id);
  }

  return NextResponse.json({ child: data });
}
