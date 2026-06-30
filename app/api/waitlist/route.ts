import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/app/lib/supabase/server";
import { PARENT_TYPES } from "@/app/lib/profile/constants";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const {
    first_name,
    email,
    parent_type,
    kid_count,
    challenge_tags,
    age_bands,
  } = body as Record<string, unknown>;

  const firstName = typeof first_name === "string" ? first_name.trim() : "";
  const emailValue = typeof email === "string" ? email.trim().toLowerCase() : "";
  const parentType = typeof parent_type === "string" ? parent_type.trim() : "";

  if (!firstName) {
    return NextResponse.json({ error: "First name is required." }, { status: 400 });
  }

  if (!emailValue || !EMAIL_RE.test(emailValue)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  if (!parentType || !PARENT_TYPES.includes(parentType as (typeof PARENT_TYPES)[number])) {
    return NextResponse.json({ error: "Please select a parent type." }, { status: 400 });
  }

  const kidCount = typeof kid_count === "string" ? kid_count.trim() : null;
  const challenges = Array.isArray(challenge_tags)
    ? challenge_tags.filter((t): t is string => typeof t === "string")
    : [];
  const ages = Array.isArray(age_bands)
    ? age_bands.filter((t): t is string => typeof t === "string")
    : [];

  const supabase = createSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "Signup is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  const row = {
    first_name: firstName,
    email: emailValue,
    parent_type: parentType,
    source: "landing_page",
    kid_count: kidCount || null,
    challenge_tags: challenges,
    age_bands: ages,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("waitlist_signups").insert(row);

  if (error) {
    if (error.code === "23505") {
      const { error: updateErr } = await supabase
        .from("waitlist_signups")
        .update({
          first_name: firstName,
          parent_type: parentType,
          kid_count: kidCount || null,
          challenge_tags: challenges,
          age_bands: ages,
          updated_at: new Date().toISOString(),
        })
        .eq("email", emailValue);

      if (updateErr) {
        console.error("waitlist update error:", updateErr);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
      }
      return NextResponse.json({ ok: true, updated: true });
    }

    console.error("waitlist upsert error:", error);

    if (error.code === "PGRST205" || error.message?.includes("waitlist_signups")) {
      return NextResponse.json(
        { error: "Waitlist is not set up yet. Please try again soon." },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
