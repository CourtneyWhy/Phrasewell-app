export const LAUNCH_DATE = "2026-07-28";

export const LAUNCH_PHASES = [
  {
    id: "beta",
    name: "Micro-Beta + Waitlist (accelerated)",
    start: "2026-07-01",
    end: "2026-07-13",
    goal: "15–25 handpicked parents for testimonials only. Waitlist gets content tease — no app login.",
  },
  {
    id: "warmup",
    name: "Pre-launch Warm-Up",
    start: "2026-07-14",
    end: "2026-07-27",
    goal: "Story emails, app reveal video, testimonials. No pricing page until Jul 28.",
  },
  {
    id: "launch",
    name: "Founder LTD Launch",
    start: "2026-07-28",
    end: "2026-08-03",
    goal: "2-tier LTD (Core $99 / Vision $169). Daily emails. No free trial this week.",
  },
  {
    id: "post",
    name: "Monthly + Reviews + Referrals",
    start: "2026-08-04",
    end: "2026-09-30",
    goal: "$12/mo subscription with 7-day trial opens. Trustpilot, referrals, SEO.",
  },
  {
    id: "appsumo",
    name: "AppSumo / Marketplace Prep",
    start: "2026-10-01",
    end: "2026-12-31",
    goal: "Prepare marketplace launch and scale distribution.",
  },
] as const;

export const LAUNCH_WEEK_PLAN: Record<
  string,
  { goal: string; tasks: string[]; content: string; community: string; creator: string; email: string; metrics: string }
> = {
  "2026-07-21": {
    goal: "How Founder access works — still no price",
    tasks: ["Email: how LTD works (no dollar amounts)", "X marketing: countdown", "Add 2 testimonials to landing"],
    content: "X script card + gotcha pitch",
    community: "Helpful comments in 3 groups",
    creator: "—",
    email: "Founder access mechanics — no price",
    metrics: "Log waitlist + testimonial count",
  },
  "2026-07-22": {
    goal: "Social proof week",
    tasks: ["Loom walkthrough live in email", "X: beta parent quote", "Test Stripe 2-tier checkout (hidden)"],
    content: "Testimonial quote graphic",
    community: "Reddit helpful comments",
    creator: "—",
    email: "Meet beta parents",
    metrics: "Log site visits",
  },
  "2026-07-23": {
    goal: "FAQ + objection handling",
    tasks: ["Publish FAQ page", "Email: founder story", "2 faceless reels in Buffer queue"],
    content: "Canva reel from script card",
    community: "FB comment help",
    creator: "—",
    email: "Why we built Phrasewell",
    metrics: "Feedback thumbs %",
  },
  "2026-07-24": {
    goal: "4 days out",
    tasks: ["Email countdown", "X: marketing lesson post", "Contact 1 group admin if needed"],
    content: "Countdown X post — no price",
    community: "Ask 2 admins",
    creator: "—",
    email: "4 days — still no price",
    metrics: "Email list size",
  },
  "2026-07-25": {
    goal: "Final prep",
    tasks: ["Test Stripe Core + Vision", "Schedule launch posts in Buffer", "Pre-write Jul 28 launch email"],
    content: "Queue launch day X + reels",
    community: "—",
    creator: "—",
    email: "Draft launch email in Klaviyo (schedule Jul 28 AM)",
    metrics: "Waitlist total",
  },
  "2026-07-26": {
    goal: "Launch prep",
    tasks: ["FAQ review", "Support reply templates", "Rest or Saturday batch if behind"],
    content: "—",
    community: "—",
    creator: "—",
    email: "Schedule eve-of-launch email (no price)",
    metrics: "—",
  },
  "2026-07-27": {
    goal: "Eve of launch — anticipation only",
    tasks: ["Email: opens tomorrow", "Final QA", "No pricing on site until midnight Jul 28"],
    content: "—",
    community: "—",
    creator: "—",
    email: "Tomorrow — Founder access (NO price in this email)",
    metrics: "—",
  },
  "2026-07-28": {
    goal: "LAUNCH DAY — first time price shown",
    tasks: ["Open 2-tier LTD checkout", "Launch email with Core $99 / Vision $169", "X + TikTok/IG + LinkedIn", "Reply to every buyer"],
    content: "Launch announcement all channels",
    community: "Share where rules allow",
    creator: "—",
    email: "LAUNCH — prices live",
    metrics: "Revenue + units hourly",
  },
};

export const LTD_TIERS = [
  { id: "core", name: "Founder Core", price: 99, description: "Lifetime — all categories live at launch" },
  { id: "vision", name: "Founder Vision", price: 169, description: "Lifetime — all current + future features" },
] as const;

export const LTD_SCENARIOS = [
  { price: 99, tier: "Core", sales100k: 1011, sales200k: 2021 },
  { price: 169, tier: "Vision", sales100k: 592, sales200k: 1183 },
  { price: 134, tier: "50/50 blend", sales100k: 746, sales200k: 1493 },
];

export const MRR_SCENARIOS = [
  { price: 10, subs: 1000 },
  { price: 12, subs: 834 },
  { price: 15, subs: 667 },
];

export const ANNUAL_1M_SCENARIOS = [
  { label: "$12/mo subscribers", value: 6945 },
  { label: "$15/mo subscribers", value: 5556 },
  { label: "$99/yr subscribers", value: 10101 },
  { label: "Core LTD $99", value: 10101 },
  { label: "Vision LTD $169", value: 5929 },
];

export const AUTOMATION_RECOMMENDATIONS = [
  "Canva — slideshow reels from script card screenshots (free / Pro $13)",
  "CapCut — voiceover + auto captions on reels (free)",
  "Buffer — queue X + TikTok + IG for the week (free tier)",
  "Klaviyo — batch + schedule pre-launch emails (have it)",
  "Loom — one app walkthrough for reveal week (free)",
  "F5Bot — Reddit keyword alerts (free)",
  "Stripe — 2-tier LTD + monthly after Aug 4",
  "Content Engine + Claude — hooks and slide copy from behaviors",
];

export const AUTOMATION_DONT = [
  "Do not auto-post into Facebook groups",
  "Do not spam Reddit with links",
  "Do not show price before July 28",
  "Do not offer free trial during LTD window",
  "Do not open beta to everyone — max 25 handpicked parents",
];

const PHASE_GUIDANCE: Record<
  string,
  { tasks: string; content: string; community: string; creator: string; email: string; metrics: string }
> = {
  beta: {
    tasks: "Reddit + FB help, daily X marketing post, micro-beta testimonial chase, 2 reels/week, log metrics",
    content: "Script card screenshots + faceless reels — tease, no app access for public",
    community: "Helpful comments — no selling. Invite ≤25 parents to micro-beta only.",
    creator: "You = UGC for now. 1 micro-influencer max if time.",
    email: "Start story sequence NOW — batch in Klaviyo on Mondays",
    metrics: "Waitlist, micro-beta count (≤25), testimonial quotes collected",
  },
  warmup: {
    tasks: "Reveal app in email, collect testimonials on landing, prep launch emails — still no price",
    content: "Loom walkthrough, countdown, proof graphics, 2 reels/week",
    community: "Ask admins before sharing links",
    creator: "—",
    email: "Reveal week + proof emails — schedule all in Klaviyo",
    metrics: "Email list growth, testimonial count (goal 10)",
  },
  launch: {
    tasks: "Daily launch emails with 2-tier pricing, monitor checkout, reply to all buyers",
    content: "Launch announcement + daily social proof on X + reels",
    community: "Share where rules allow",
    creator: "—",
    email: "Daily launch emails — Core $99 / Vision $169",
    metrics: "Revenue, units by tier, conversion",
  },
  post: {
    tasks: "Open $12/mo + 7-day trial, referrals, reviews, SEO blog",
    content: "Testimonials, case studies",
    community: "Ongoing helpful engagement",
    creator: "Consider 1–2 creators post-LTD if revenue allows",
    email: "Transition waitlist to monthly offer",
    metrics: "MRR, churn, NPS",
  },
  appsumo: {
    tasks: "Marketplace prep, assets, support docs",
    content: "Deal page copy, demo videos",
    community: "—",
    creator: "—",
    email: "—",
    metrics: "Pipeline metrics",
  },
};

export function getPhaseForDate(iso: string) {
  return LAUNCH_PHASES.find((p) => iso >= p.start && iso <= p.end) ?? LAUNCH_PHASES[LAUNCH_PHASES.length - 1];
}

export function getLaunchCalendarDays(fromIso: string, toIso = "2026-10-31") {
  const days: Array<{
    date: string;
    phase: (typeof LAUNCH_PHASES)[number];
    plan?: (typeof LAUNCH_WEEK_PLAN)[string];
    guidance: (typeof PHASE_GUIDANCE)[string];
  }> = [];
  const cur = new Date(fromIso + "T12:00:00");
  const end = new Date(toIso + "T12:00:00");
  while (cur <= end) {
    const date = cur.toISOString().slice(0, 10);
    const phase = getPhaseForDate(date);
    days.push({
      date,
      phase,
      plan: LAUNCH_WEEK_PLAN[date],
      guidance: PHASE_GUIDANCE[phase.id] ?? PHASE_GUIDANCE.beta,
    });
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}
