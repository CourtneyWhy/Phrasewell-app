import { growthDb, todayIso } from "@/app/lib/growth/db";
import { generateContentDrafts } from "@/app/lib/growth/content-studio";
import { fetchRedditOpportunities, normalizeThreadUrl } from "@/app/lib/growth/reddit-scout";
import { fetchXOpportunities } from "@/app/lib/growth/x-scout";

export type ScoutResult = {
  reddit: { added: number; skipped: number };
  x: { added: number; skipped: number };
  content: { added: number };
};

async function loadExistingUrls(db: NonNullable<ReturnType<typeof growthDb>>) {
  const { data } = await db.from("growth_social_opportunities").select("thread_url");
  return new Set((data ?? []).map((r) => normalizeThreadUrl(r.thread_url)));
}

export async function runSocialScout(scoutDate?: string): Promise<ScoutResult> {
  const db = growthDb();
  if (!db) throw new Error("Database not configured.");

  const date = scoutDate ?? todayIso();
  const existingUrls = await loadExistingUrls(db);

  const [redditPosts, xPosts] = await Promise.all([
    fetchRedditOpportunities(8),
    fetchXOpportunities(5),
  ]);

  let redditAdded = 0;
  let redditSkipped = 0;
  for (const post of redditPosts) {
    const url = normalizeThreadUrl(post.url);
    if (existingUrls.has(url)) {
      redditSkipped += 1;
      continue;
    }
    const { error } = await db.from("growth_social_opportunities").insert({
      scout_date: date,
      platform: "reddit",
      source_name: `r/${post.subreddit}`,
      thread_url: post.url,
      thread_title: post.title,
      thread_excerpt: post.excerpt,
      draft_response: post.draft,
      relevance_score: post.score,
      status: "new",
    });
    if (error) {
      if (error.code === "23505") redditSkipped += 1;
      continue;
    }
    existingUrls.add(url);
    redditAdded += 1;
  }

  let xAdded = 0;
  let xSkipped = 0;
  for (const post of xPosts) {
    const url = normalizeThreadUrl(post.url);
    if (existingUrls.has(url)) {
      xSkipped += 1;
      continue;
    }
    const { error } = await db.from("growth_social_opportunities").insert({
      scout_date: date,
      platform: "x",
      source_name: post.sourceName,
      thread_url: post.url,
      thread_title: post.title,
      thread_excerpt: post.excerpt,
      draft_response: post.draft,
      relevance_score: post.score,
      status: "new",
    });
    if (error) {
      if (error.code === "23505") xSkipped += 1;
      continue;
    }
    existingUrls.add(url);
    xAdded += 1;
  }

  await db.from("growth_agent_runs").insert({
    agent_name: "Social Scout",
    run_date: date,
    input: JSON.stringify({ scout_date: date, subreddits: 4 }),
    output: JSON.stringify({ reddit: { added: redditAdded, skipped: redditSkipped }, x: { added: xAdded, skipped: xSkipped } }),
    status: "success",
    notes: `Reddit + X thread scout for ${date}`,
  });

  return { reddit: { added: redditAdded, skipped: redditSkipped }, x: { added: xAdded, skipped: xSkipped }, content: { added: 0 } };
}

export async function runContentStudio(draftDate?: string): Promise<{ added: number; platforms: string[] }> {
  const db = growthDb();
  if (!db) throw new Error("Database not configured.");

  const date = draftDate ?? todayIso();

  const [{ data: tasks }, { data: pipeline }, { count: waitlist }] = await Promise.all([
    db.from("growth_daily_tasks").select("*").eq("task_date", date),
    db
      .from("growth_content_pipeline")
      .select("behavior_id, behavior_title, category_title")
      .eq("blog_status", "not_started")
      .order("category_id", { ascending: true })
      .limit(1)
      .maybeSingle(),
    db.from("waitlist_signups").select("id", { count: "exact", head: true }),
  ]);

  const drafts = generateContentDrafts({
    draftDate: date,
    tasks: tasks ?? [],
    waitlistCount: waitlist ?? 0,
    behavior: pipeline ?? null,
  });

  let added = 0;
  const platforms: string[] = [];

  for (const draft of drafts) {
    const row = {
      draft_date: date,
      platform: draft.platform,
      content_type: draft.content_type,
      behavior_id: draft.behavior_id,
      behavior_title: draft.behavior_title,
      hook: draft.hook,
      body: draft.body,
      cta: draft.cta,
      image_prompts: draft.image_prompts,
      video_script: draft.video_script,
      source_task_title: draft.source_task_title,
      notes: draft.notes,
      status: "draft",
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await db
      .from("growth_content_drafts")
      .select("id")
      .eq("draft_date", date)
      .eq("platform", draft.platform)
      .eq("content_type", draft.content_type)
      .maybeSingle();

    if (existing?.id) {
      await db.from("growth_content_drafts").update(row).eq("id", existing.id);
    } else {
      const { error } = await db.from("growth_content_drafts").insert(row);
      if (error) continue;
    }
    added += 1;
    platforms.push(draft.platform);
  }

  await db.from("growth_agent_runs").insert({
    agent_name: "Content Studio",
    run_date: date,
    input: JSON.stringify({ draft_date: date, task_count: tasks?.length ?? 0 }),
    output: JSON.stringify({ platforms, count: added }),
    status: "success",
    notes: `Generated drafts for: ${platforms.join(", ") || "none scheduled today"}`,
  });

  return { added, platforms };
}

export async function runDailyGrowthAgents(scoutDate?: string): Promise<ScoutResult & { content: { added: number; platforms: string[] } }> {
  const scout = await runSocialScout(scoutDate);
  const content = await runContentStudio(scoutDate);
  return { ...scout, content };
}
