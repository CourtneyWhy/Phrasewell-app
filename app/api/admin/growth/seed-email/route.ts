import { NextResponse } from "next/server";
import { growthDb } from "@/app/lib/growth/db";
import {
  getSeedSegments,
  getSeedFlows,
  getSeedFlowEmails,
  getSeedEmailLibrary,
  getSeedCampaigns,
} from "@/app/lib/growth/email-data";
import { getSeedContentPipeline } from "@/app/lib/growth/content-pipeline";

export async function POST() {
  const db = growthDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const { count } = await db.from("growth_email_segments").select("id", { count: "exact", head: true });
  if ((count ?? 0) > 0) {
    return NextResponse.json({ error: "Email seed data already exists." }, { status: 409 });
  }

  const segments = getSeedSegments();
  const flows = getSeedFlows();
  const flowEmails = getSeedFlowEmails();
  const library = getSeedEmailLibrary();
  const campaigns = getSeedCampaigns();
  const pipeline = getSeedContentPipeline();

  const results = await Promise.all([
    db.from("growth_email_segments").insert(segments),
    db.from("growth_email_flows").insert(flows),
    db.from("growth_email_flow_emails").insert(flowEmails),
    db.from("growth_email_library").insert(library),
    db.from("growth_email_campaigns").insert(campaigns),
    db.from("growth_content_pipeline").insert(pipeline),
  ]);

  const err = results.find((r) => r.error);
  if (err?.error) {
    return NextResponse.json({ error: err.error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    segments: segments.length,
    flows: flows.length,
    flowEmails: flowEmails.length,
    library: library.length,
    campaigns: campaigns.length,
    pipeline: pipeline.length,
  });
}
