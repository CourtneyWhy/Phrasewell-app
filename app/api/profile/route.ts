import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/app/lib/supabase/server-auth";
import type { AgeBand } from "@/app/lib/contentLibrary";
import { normalizeAgeBand } from "@/app/lib/contentLibrary";

export async function GET() {
  const supabase = await createSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: "Auth not configured." }, { status: 503 });
  }

  const { data: auth, error: authErr } = await supabase.auth.getUser();
  if (authErr || !auth.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { data: profile, error: profileErr } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", auth.user.id)
    .maybeSingle();

  if (profileErr) {
    console.error("profile fetch:", profileErr);
    return NextResponse.json({ error: "Could not load profile." }, { status: 500 });
  }

  const { data: children, error: childErr } = await supabase
    .from("user_children")
    .select("*")
    .eq("user_id", auth.user.id)
    .is("removed_at", null)
    .order("sort_order", { ascending: true });

  if (childErr) {
    console.error("children fetch:", childErr);
    return NextResponse.json({ error: "Could not load children." }, { status: 500 });
  }

  return NextResponse.json({
    profile: profile ?? {
      id: auth.user.id,
      email: auth.user.email ?? "",
      first_name: null,
      parent_types: [],
      challenge_tags: [],
      onboarding_version: 0,
      onboarding_completed_at: null,
      default_child_id: null,
    },
    children: children ?? [],
  });
}

export async function PATCH(request: Request) {
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
  if (typeof body.first_name === "string") patch.first_name = body.first_name.trim();
  if (Array.isArray(body.parent_types)) patch.parent_types = body.parent_types;
  if (Array.isArray(body.challenge_tags)) patch.challenge_tags = body.challenge_tags;
  if (typeof body.default_child_id === "string" || body.default_child_id === null) {
    patch.default_child_id = body.default_child_id;
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .update(patch)
    .eq("id", auth.user.id)
    .select()
    .single();

  if (error) {
    console.error("profile update:", error);
    return NextResponse.json({ error: "Could not save profile." }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
