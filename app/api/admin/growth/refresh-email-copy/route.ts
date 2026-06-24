import { NextResponse } from "next/server";
import { growthDb } from "@/app/lib/growth/db";
import { FLOWS } from "@/app/lib/growth/email-data";
import { resolveEmailBody } from "@/app/lib/growth/email-klaviyo-copy";

/** Refresh body copy + graphic notes from templates (no re-seed needed) */
export async function POST() {
  const db = growthDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  let updated = 0;

  for (const flow of FLOWS) {
    for (let i = 0; i < flow.emails.length; i++) {
      const e = flow.emails[i];
      const body = resolveEmailBody(flow.slug, i + 1, e.body_outline, e.cta);
      const slug = `${flow.slug}_${i + 1}`;

      await db
        .from("growth_email_flow_emails")
        .update({ body_outline: body, notes: `Graphic: ${e.graphic_recommendation}` })
        .eq("flow_slug", flow.slug)
        .eq("step_number", i + 1);

      await db
        .from("growth_email_library")
        .update({ body_outline: body, notes: `Graphic: ${e.graphic_recommendation}` })
        .eq("slug", slug);

      updated++;
    }
  }

  return NextResponse.json({ ok: true, updated });
}
