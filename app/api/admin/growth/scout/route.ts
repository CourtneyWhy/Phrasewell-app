import { NextResponse } from "next/server";
import { runContentStudio, runDailyGrowthAgents, runSocialScout } from "@/app/lib/growth/social-scout";

export async function POST(request: Request) {
  try {
    let mode: "all" | "reddit" | "x" | "content" | "images" = "all";
    let scoutDate: string | undefined;
    try {
      const body = await request.json();
      if (body?.mode === "reddit" || body?.mode === "x" || body?.mode === "content" || body?.mode === "images" || body?.mode === "all") {
        mode = body.mode;
      }
      if (typeof body?.scout_date === "string") scoutDate = body.scout_date;
    } catch {
      /* empty body */
    }

    if (mode === "all") {
      const result = await runDailyGrowthAgents(scoutDate);
      return NextResponse.json({
        ok: true,
        message: `Daily social pack ready. Reddit: ${result.reddit.added}, X: ${result.x.added}, content: ${result.content.platforms.join(", ") || "none"}. ${result.images.message}`,
        ...result,
      });
    }

    if (mode === "content") {
      const content = await runContentStudio(scoutDate);
      return NextResponse.json({
        ok: true,
        message: `Generated ${content.added} content draft(s): ${content.platforms.join(", ") || "none scheduled today"}.`,
        content,
      });
    }

    if (mode === "images") {
      const { runSlideImageGeneration } = await import("@/app/lib/growth/social-scout");
      const images = await runSlideImageGeneration(scoutDate);
      return NextResponse.json({ ok: true, ...images });
    }

    const scout = await runSocialScout(scoutDate);
    return NextResponse.json({
      ok: true,
      message: `Scout: ${scout.reddit.added} new Reddit, ${scout.x.added} new X (${scout.reddit.skipped + scout.x.skipped} duplicates skipped).`,
      ...scout,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Scout failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
