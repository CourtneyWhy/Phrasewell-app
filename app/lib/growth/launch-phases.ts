export const LAUNCH_DATE = "2026-07-28";

export const LAUNCH_PHASES = [
  {
    id: "beta",
    name: "Beta + Waitlist Growth",
    start: "2026-06-23",
    end: "2026-07-13",
    goal: "Grow waitlist, run beta waves, collect phrase feedback.",
  },
  {
    id: "warmup",
    name: "Pre-launch Warm-Up",
    start: "2026-07-14",
    end: "2026-07-27",
    goal: "Hype, testimonials, pricing page, launch emails drafted.",
  },
  {
    id: "launch",
    name: "Founder LTD Launch",
    start: "2026-07-28",
    end: "2026-08-03",
    goal: "Open Founder LTD, daily launch emails, track revenue to $100k–$200k.",
  },
  {
    id: "post",
    name: "Post-Launch Reviews + Referrals",
    start: "2026-08-04",
    end: "2026-09-30",
    goal: "Trustpilot, referrals, content SEO, path to $10k MRR.",
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
    goal: "Tease founder access",
    tasks: ["Email waitlist: opens July 28", "LinkedIn build story", "Contact 5 creators"],
    content: "LinkedIn founder post",
    community: "Helpful comments in 3 groups",
    creator: "DM 5 creators",
    email: "Waitlist tease email",
    metrics: "Log waitlist + outreach count",
  },
  "2026-07-22": {
    goal: "Publish authority content",
    tasks: ["Publish blog", "X script card", "Ask 3 beta users for testimonials"],
    content: "Blog post + X card",
    community: "Reddit helpful comments",
    creator: "Follow up 2 creators",
    email: "—",
    metrics: "Log site visits",
  },
  "2026-07-23": {
    goal: "Social proof",
    tasks: ["Add testimonials to landing", "Checkout test", "Beta insight post"],
    content: "Testimonial quote graphic",
    community: "FB comment help",
    creator: "—",
    email: "—",
    metrics: "Feedback thumbs %",
  },
  "2026-07-24": {
    goal: "4 days out",
    tasks: ["Email waitlist countdown", "Contact group admins for permission"],
    content: "Countdown X post",
    community: "Ask 2 admins",
    creator: "—",
    email: "4 days email",
    metrics: "Email list size",
  },
  "2026-07-25": {
    goal: "Final fixes",
    tasks: ["Final beta fixes", "Test Stripe", "Schedule launch posts"],
    content: "Schedule Buffer posts",
    community: "—",
    creator: "—",
    email: "—",
    metrics: "Beta active users",
  },
  "2026-07-26": {
    goal: "Launch prep",
    tasks: ["Review pricing", "Create FAQ", "Support reply templates"],
    content: "FAQ page",
    community: "—",
    creator: "—",
    email: "—",
    metrics: "—",
  },
  "2026-07-27": {
    goal: "Eve of launch",
    tasks: ["Email: opens tomorrow", "Final QA", "Rest"],
    content: "—",
    community: "—",
    creator: "—",
    email: "Tomorrow email",
    metrics: "—",
  },
  "2026-07-28": {
    goal: "LAUNCH DAY",
    tasks: ["Open Founder LTD", "Launch email", "X + LinkedIn", "Monitor checkout", "Reply to all"],
    content: "Launch announcement all channels",
    community: "Where allowed, share feedback request",
    creator: "Notify partnered creators",
    email: "Launch announcement",
    metrics: "Revenue + units hourly",
  },
};

export const LTD_SCENARIOS = [
  { price: 99, sales100k: 1011, sales200k: 2021 },
  { price: 149, sales100k: 672, sales200k: 1343 },
  { price: 199, sales100k: 503, sales200k: 1006 },
];

export const MRR_SCENARIOS = [
  { price: 10, subs: 1000 },
  { price: 12, subs: 834 },
  { price: 15, subs: 667 },
];

export const ANNUAL_1M_SCENARIOS = [
  { label: "$12/mo subscribers", value: 6945 },
  { label: "$15/mo subscribers", value: 5556 },
  { label: "$19/mo subscribers", value: 4386 },
  { label: "$149 LTD sales", value: 6712 },
  { label: "$199 LTD sales", value: 5026 },
];

export const AUTOMATION_RECOMMENDATIONS = [
  "Supabase — source of truth for waitlist, feedback, growth ops",
  "Loops or Klaviyo — marketing email campaigns",
  "Resend — transactional beta invite emails",
  "Buffer or Metricool — schedule X/LinkedIn posts",
  "F5Bot — Reddit keyword alerts",
  "Plausible or Vercel Analytics — site visits",
  "Stripe — LTD revenue tracking",
  "Trustpilot — after 20+ happy users",
];

export const AUTOMATION_DONT = [
  "Do not auto-post into Facebook groups",
  "Do not spam Reddit with links",
  "Do not mass-DM creators",
  "Do not overbuild analytics before launch",
];

const PHASE_GUIDANCE: Record<
  string,
  { tasks: string; content: string; community: string; creator: string; email: string; metrics: string }
> = {
  beta: {
    tasks: "5 Reddit comments, 3 FB groups, 1 X post, LinkedIn Mon/Wed/Fri, contact 2 creators, review feedback, log metrics",
    content: "Script cards, build-in-public, beta tester asks",
    community: "Join groups, read rules, comment helpfully — no selling",
    creator: "Research + DM 2 targets/week",
    email: "Batch beta invites weekly",
    metrics: "Waitlist, beta active, feedback thumbs %",
  },
  warmup: {
    tasks: "Increase outreach, collect testimonials, prep launch emails",
    content: "Countdown posts, social proof, FAQ content",
    community: "Ask admins before sharing links",
    creator: "Partner conversations, podcast pitches",
    email: "Draft launch sequence",
    metrics: "Email list growth, site visits",
  },
  launch: {
    tasks: "Daily launch emails, monitor checkout, reply to all buyers",
    content: "Launch announcement + daily social proof",
    community: "Share where rules allow",
    creator: "Notify partners",
    email: "Daily launch emails to waitlist",
    metrics: "Revenue, units, conversion",
  },
  post: {
    tasks: "Referrals, reviews, SEO blog posts, subscription prep",
    content: "Testimonials, case studies, blog SEO",
    community: "Ongoing helpful engagement",
    creator: "Affiliate/partner follow-ups",
    email: "Transition to subscription messaging",
    metrics: "MRR path, churn, NPS",
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
