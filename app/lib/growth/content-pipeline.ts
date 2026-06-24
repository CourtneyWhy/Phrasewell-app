import { BEHAVIORS, CATEGORIES } from "@/app/lib/behavior-catalog";

export const PIPELINE_STAGES = [
  { id: "blog", label: "Blog" },
  { id: "newsletter", label: "Newsletter" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "x", label: "X" },
  { id: "facebook", label: "Facebook" },
  { id: "reddit", label: "Reddit" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "pinterest", label: "Pinterest" },
] as const;

export type PipelineStageId = (typeof PIPELINE_STAGES)[number]["id"];

export function getSeedContentPipeline() {
  const catMap = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.title]));
  return BEHAVIORS.map((b) => ({
    behavior_id: b.id,
    behavior_title: b.title,
    category_id: b.categoryId,
    category_title: catMap[b.categoryId] ?? b.categoryId,
    blog_status: "not_started",
    newsletter_status: "not_started",
    linkedin_status: "not_started",
    x_status: "not_started",
    facebook_status: "not_started",
    reddit_status: "not_started",
    instagram_status: "not_started",
    tiktok_status: "not_started",
    pinterest_status: "not_started",
    blog_url: null,
    notes: `Content pipeline for: ${b.title}. Start with blog → repurpose to all channels.`,
  }));
}

export function contentReuseChecklist(behaviorTitle: string, categoryTitle: string) {
  return [
    `Blog: "What to Say When ${behaviorTitle}"`,
    `Newsletter: Friday feature — ${behaviorTitle}`,
    `LinkedIn: Founder angle on ${categoryTitle}`,
    `X: Script card thread — ${behaviorTitle}`,
    `Facebook: Helpful group comment version`,
    `Reddit: Helpful comment, no link unless natural`,
    `Instagram: Script card carousel slide`,
    `TikTok: 15-sec "say this instead" hook`,
    `Pinterest: Script card pin — ${categoryTitle}`,
    `Canva: Cream background script card graphic`,
  ];
}
