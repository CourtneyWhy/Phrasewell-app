import { BEHAVIORS, CATEGORIES } from "@/app/lib/behavior-catalog";
import { LANDING_DEMO_PHRASES } from "@/app/lib/landing-demo-phrases";
import { GOTCHA_PITCH } from "@/app/lib/growth/launch-strategy";
import { POST_TEMPLATES } from "@/app/lib/growth/templates";
import { buildXPostDraft } from "@/app/lib/growth/x-scout";
import type { GrowthDailyTask } from "@/app/lib/growth/types";

export type ContentDraftInput = {
  draftDate: string;
  tasks: GrowthDailyTask[];
  waitlistCount?: number;
  behavior?: { behavior_id: string; behavior_title: string; category_title: string } | null;
};

export type GeneratedContentDraft = {
  platform: string;
  content_type: string;
  behavior_id: string | null;
  behavior_title: string | null;
  hook: string | null;
  body: string;
  cta: string | null;
  image_prompts: string[];
  video_script: string | null;
  source_task_title: string | null;
  notes: string | null;
};

const PLATFORM_SPECS: Record<
  string,
  { contentTypes: string[]; defaultDays: number[]; postsPerDay: number }
> = {
  X: { contentTypes: ["post"], defaultDays: [0, 1, 2, 3, 4, 5, 6], postsPerDay: 1 },
  LinkedIn: { contentTypes: ["post"], defaultDays: [5], postsPerDay: 1 },
  TikTok: { contentTypes: ["video"], defaultDays: [3, 6], postsPerDay: 1 },
  Instagram: { contentTypes: ["reel"], defaultDays: [3, 6], postsPerDay: 1 },
  Pinterest: { contentTypes: ["pin"], defaultDays: [6], postsPerDay: 1 },
};

function dayOfWeek(isoDate: string) {
  return new Date(`${isoDate}T12:00:00`).getDay();
}

function pickBehavior(isoDate: string) {
  const idx = dayOfWeek(isoDate) % BEHAVIORS.length;
  const b = BEHAVIORS[idx]!;
  const cat = CATEGORIES.find((c) => c.id === b.categoryId);
  return {
    behavior_id: b.id,
    behavior_title: b.title,
    category_title: cat?.title ?? b.categoryId,
  };
}

function pickPhrase() {
  const idx = new Date().getDate() % LANDING_DEMO_PHRASES.length;
  return LANDING_DEMO_PHRASES[idx]!;
}

function taskWantsPlatform(tasks: GrowthDailyTask[], platform: string) {
  const p = platform.toLowerCase();
  return tasks.some(
    (t) =>
      t.platform?.toLowerCase() === p ||
      t.task_title.toLowerCase().includes(p === "x" ? " x " : p) ||
      t.task_title.toLowerCase().includes(platform.toLowerCase()),
  );
}

function shouldPostPlatform(isoDate: string, platform: string, tasks: GrowthDailyTask[]) {
  const spec = PLATFORM_SPECS[platform];
  if (!spec) return false;
  const dow = dayOfWeek(isoDate);
  if (taskWantsPlatform(tasks, platform)) return true;
  return spec.defaultDays.includes(dow);
}

function slidePrompts(behaviorTitle: string, phrase: (typeof LANDING_DEMO_PHRASES)[0]) {
  return [
    `Slide 1 — Hook: Cream background, Phrasewell logo small top corner. Bold text: "When ${behaviorTitle.toLowerCase()}…"`,
    `Slide 2 — Problem: Parent overwhelmed. Text: "Your brain goes blank."`,
    `Slide 3 — Script card: Large quote: "${phrase.sayThis}"`,
    `Slide 4 — Do this: "${phrase.doThis}"`,
    `Slide 5 — CTA: "${GOTCHA_PITCH}" + phrasewell.net`,
  ];
}

function videoScript(behaviorTitle: string, phrase: (typeof LANDING_DEMO_PHRASES)[0]) {
  return `[HOOK — 0-3s, on camera or text on screen]
"When ${behaviorTitle.toLowerCase()}, do you ever go blank on what to say?"

[PROBLEM — 3-8s]
"Theory is in your head. The words won't come."

[SOLUTION — 8-20s]
"Try this instead: ${phrase.sayThis}"

[DO THIS — 20-28s]
"${phrase.doThis}"

[CTA — 28-35s]
"${GOTCHA_PITCH} Waitlist: phrasewell.net"`;
}

export function generateContentDrafts(input: ContentDraftInput): GeneratedContentDraft[] {
  const behavior = input.behavior ?? pickBehavior(input.draftDate);
  const phrase = pickPhrase();
  const dayNum = Math.max(1, Math.floor((Date.parse(input.draftDate) - Date.parse("2026-01-01")) / 86400000) + 1);
  const drafts: GeneratedContentDraft[] = [];

  const linkedTask = (platform: string) =>
    input.tasks.find((t) => t.platform === platform || t.task_title.toLowerCase().includes(platform.toLowerCase()))
      ?.task_title ?? null;

  if (shouldPostPlatform(input.draftDate, "X", input.tasks)) {
    drafts.push({
      platform: "X",
      content_type: "post",
      behavior_id: behavior.behavior_id,
      behavior_title: behavior.behavior_title,
      hook: GOTCHA_PITCH,
      body: buildXPostDraft(dayNum).replace(
        "Meltdowns when words won't come.",
        `${behavior.behavior_title} — when words won't come.`,
      ),
      cta: "phrasewell.net",
      image_prompts: [],
      video_script: null,
      source_task_title: linkedTask("X"),
      notes: "Daily X post. Reply to scouts in Social Scout tab to grow following.",
    });
  }

  if (shouldPostPlatform(input.draftDate, "LinkedIn", input.tasks)) {
    drafts.push({
      platform: "LinkedIn",
      content_type: "post",
      behavior_id: behavior.behavior_id,
      behavior_title: behavior.behavior_title,
      hook: "When theory is in your head but the words won't come.",
      body: POST_TEMPLATES.linkedin.replace(
        "hard moments",
        `moments like ${behavior.behavior_title.toLowerCase()}`,
      ),
      cta: "Join the waitlist: phrasewell.net",
      image_prompts: [
        `LinkedIn graphic: calm cream background, quote card "${phrase.sayThis}", Phrasewell branding`,
      ],
      video_script: null,
      source_task_title: linkedTask("LinkedIn"),
      notes: "Founder story angle. 1× per week default (Fridays).",
    });
  }

  if (shouldPostPlatform(input.draftDate, "TikTok", input.tasks)) {
    drafts.push({
      platform: "TikTok",
      content_type: "video",
      behavior_id: behavior.behavior_id,
      behavior_title: behavior.behavior_title,
      hook: `What to say when ${behavior.behavior_title.toLowerCase()}`,
      body: phrase.sayThis,
      cta: "Link in bio → phrasewell.net",
      image_prompts: slidePrompts(behavior.behavior_title, phrase),
      video_script: videoScript(behavior.behavior_title, phrase),
      source_task_title: linkedTask("TikTok"),
      notes: "Use Canva slides → CapCut voiceover. Wed/Sat default or when reel task is on checklist.",
    });
  }

  if (shouldPostPlatform(input.draftDate, "Instagram", input.tasks)) {
    drafts.push({
      platform: "Instagram",
      content_type: "reel",
      behavior_id: behavior.behavior_id,
      behavior_title: behavior.behavior_title,
      hook: phrase.moment,
      body: `${phrase.sayThis}\n\n${phrase.doThis}`,
      cta: "Waitlist in bio — phrasewell.net",
      image_prompts: slidePrompts(behavior.behavior_title, phrase),
      video_script: videoScript(behavior.behavior_title, phrase),
      source_task_title: linkedTask("Instagram") ?? linkedTask("TikTok"),
      notes: "Repost TikTok reel or remake as IG Reel. Same slide deck works.",
    });
  }

  if (shouldPostPlatform(input.draftDate, "Pinterest", input.tasks)) {
    drafts.push({
      platform: "Pinterest",
      content_type: "pin",
      behavior_id: behavior.behavior_id,
      behavior_title: behavior.behavior_title,
      hook: `Calm script: ${behavior.behavior_title}`,
      body: `${phrase.sayThis}\n\nTip: ${phrase.helpfulNote}`,
      cta: "phrasewell.net",
      image_prompts: [
        `Pinterest pin 1000×1500: vertical script card, "${phrase.sayThis}", category ${behavior.category_title}, soft cream palette`,
      ],
      video_script: null,
      source_task_title: linkedTask("Pinterest"),
      notes: "Saturday batch default. Link to waitlist or blog when live.",
    });
  }

  return drafts;
}
