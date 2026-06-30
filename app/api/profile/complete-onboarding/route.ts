import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/app/lib/supabase/server-auth";
import { REQUIRED_ONBOARDING_VERSION } from "@/app/lib/profile/constants";
import type { AgeBand } from "@/app/lib/contentLibrary";
import { normalizeAgeBand } from "@/app/lib/contentLibrary";
import { CHILD_RELATIONSHIPS } from "@/app/lib/profile/constants";

type ChildInput = {
  name: string;
  age_band: AgeBand;
  relationship: string;
};

export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: "Auth not configured." }, { status: 503 });
  }

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: {
    first_name?: string;
    parent_types?: string[];
    challenge_tags?: string[];
    children?: ChildInput[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  if (!auth.user.email) {
    return NextResponse.json({ error: "Email required on account." }, { status: 400 });
  }

  const children = body.children ?? [];
  if (children.length === 0) {
    return NextResponse.json({ error: "Add at least one child before saving." }, { status: 400 });
  }

  for (const c of children) {
    if (!c.name?.trim()) {
      return NextResponse.json({ error: "Each child needs a name or nickname." }, { status: 400 });
    }
    if (!CHILD_RELATIONSHIPS.includes(c.relationship as (typeof CHILD_RELATIONSHIPS)[number])) {
      return NextResponse.json({ error: "Invalid relationship type." }, { status: 400 });
    }
  }

  const now = new Date().toISOString();

  const { error: profileErr } = await supabase.from("user_profiles").upsert({
    id: auth.user.id,
    email: auth.user.email.toLowerCase(),
    first_name: body.first_name?.trim() ?? null,
    parent_types: body.parent_types ?? [],
    challenge_tags: body.challenge_tags ?? [],
    onboarding_version: REQUIRED_ONBOARDING_VERSION,
    onboarding_completed_at: now,
    updated_at: now,
  });

  if (profileErr) {
    console.error("onboarding profile:", profileErr);
    return NextResponse.json({ error: "Could not save profile." }, { status: 500 });
  }

  const rows = children.map((c, i) => ({
    user_id: auth.user!.id,
    name: c.name.trim(),
    age_band: normalizeAgeBand(c.age_band),
    relationship: c.relationship,
    sort_order: i,
    removed_at: null,
    updated_at: now,
  }));

  const { data: inserted, error: childErr } = await supabase
    .from("user_children")
    .insert(rows)
    .select();

  if (childErr) {
    console.error("onboarding children:", childErr);
    return NextResponse.json({ error: "Could not save children." }, { status: 500 });
  }

  const defaultChildId = inserted?.[0]?.id ?? null;
  if (defaultChildId) {
    await supabase
      .from("user_profiles")
      .update({ default_child_id: defaultChildId })
      .eq("id", auth.user.id);
  }

  return NextResponse.json({ ok: true, children: inserted });
}
