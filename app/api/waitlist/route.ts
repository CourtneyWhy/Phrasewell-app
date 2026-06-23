import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/app/lib/supabase/server";

const PARENT_TYPES = [
  "Foster parent",
  "Adoptive parent",
  "Kinship caregiver",
  "Biological parent",
  "Stepparent",
  "Grandparent caregiver",
  "Professional supporting parents",
  "Other",
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { first_name, email, parent_type } = body as Record<string, unknown>;

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

  const supabase = createSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "Signup is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  const { error } = await supabase.from("waitlist_signups").insert({
    first_name: firstName,
    email: emailValue,
    parent_type: parentType,
    source: "landing_page",
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "This email is already on the list." },
        { status: 409 },
      );
    }
    console.error("waitlist insert error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
