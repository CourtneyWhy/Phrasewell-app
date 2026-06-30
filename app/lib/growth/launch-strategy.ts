/** 2026 launch strategy — solo founder, ~1–2 hr/day, accelerated from Jul 1 */

export const GOTCHA_PITCH =
  "Kids melting down. Tap the behavior. Get words to say instantly.";

export const GOTCHA_PITCH_LONG = `${GOTCHA_PITCH} Phrasewell gives foster, adoptive, and kinship parents exact words for hard moments — no theory, no guessing.`;

export const ACCESS_STRATEGY = {
  waitlist: "No app login. Story emails + script-card images + landing demo only.",
  microBeta: "15–25 handpicked foster/adoptive parents. Password invite. Closes Jul 13. Goal: 10 testimonials.",
  publicSocial: "Tease with screenshots and reels — never full app access.",
  ltdBuyers: "First paid access at scale. Jul 28 – Aug 3. LTD buyers = feedback + referrals.",
} as const;

export const PRICING_MODEL = {
  /** No free trial during LTD window — scarcity + committed buyers (Starter Story playbook) */
  ltdWindow: { start: "2026-07-28", end: "2026-08-03", freeTrial: false },
  tiers: [
    {
      id: "founder_core",
      name: "Founder Core",
      price: 99,
      description: "Lifetime access to every category live at launch.",
      role: "Entry — for parents who want help now without betting on the roadmap.",
    },
    {
      id: "founder_vision",
      name: "Founder Vision",
      price: 169,
      description: "Core + all future categories and features forever.",
      role: "Recommended — best value for parents who believe in the long-term library.",
    },
  ],
  /** Opens after LTD window — lower barrier for middle-class foster families */
  postLaunchSubscription: {
    starts: "2026-08-04",
    monthly: 12,
    annual: 99,
    trialDays: 7,
    note: "7-day free trial on monthly only (not on LTD). Message: LTD was the founder deal; monthly is always available after Aug 4.",
  },
  rules: [
    "Never show dollar amounts before July 28, 2026.",
    "No free trial during the Jul 28 – Aug 3 LTD window.",
    "Cap LTD spots (e.g. 300–500) + hard Aug 3 deadline.",
    "Clear no-refund policy during LTD (filters committed users).",
    "Monthly $12/mo is the safety net for parents who miss LTD.",
  ],
} as const;

export const X_MARKETING_ANGLES = [
  "Marketing lesson: sell the moment, not the app — script cards beat feature lists.",
  "Waitlist update + gotcha pitch — no price, no login link yet.",
  "Screenshot of a Moment Card + one line: what I’d say instead of yelling.",
  "Why foster/adoptive parents don’t need another course — they need words in 10 seconds.",
  "Build in public: what I shipped this week (marketing ops, not vibe-coding).",
  "Countdown to Jul 28 — tease Founder access, still no price.",
  "Beta parent quote (with permission) — social proof post.",
  "Contrarian: most founder Twitter is about building. I’m documenting distribution for a parenting app.",
] as const;

export const LAUNCH_TOOLS = [
  {
    category: "UGC video (screenshot → reel)",
    name: "Canva",
    url: "https://www.canva.com",
    cost: "Free (Pro ~$13/mo saves time)",
    use: "Slideshow video: 5 slides (hook → problem → script card screenshot → CTA). Mobile mockup templates. Animate pages → Export MP4.",
  },
  {
    category: "UGC video (screenshot → reel)",
    name: "CapCut",
    url: "https://www.capcut.com",
    cost: "Free",
    use: "Import Canva slides or app screenshots → record your voiceover → Auto captions → Export for TikTok/IG.",
  },
  {
    category: "UGC video (screenshot → reel)",
    name: "Loom",
    url: "https://www.loom.com",
    cost: "Free tier",
    use: "One 3–5 min app walkthrough for email reveal week (Jul 15–21). Not for daily reels.",
  },
  {
    category: "Scheduling (work ahead)",
    name: "Buffer",
    url: "https://buffer.com",
    cost: "Free (3 channels)",
    use: "Queue X + TikTok + IG for the week in one sitting. Husband can post from queue.",
  },
  {
    category: "Email (batch campaigns)",
    name: "Klaviyo",
    url: "https://www.klaviyo.com",
    cost: "Have it",
    use: "Write 2 weeks of emails → Schedule sends. Pre-launch story sequence starts now.",
  },
  {
    category: "Copy from behaviors",
    name: "Content Engine + Claude",
    url: "",
    cost: "Have it",
    use: "Pick behavior → paste into Claude: '5-slide TikTok script + caption using gotcha pitch'.",
  },
  {
    category: "Script card images",
    name: "phrasewell.net demo",
    url: "https://www.phrasewell.net",
    cost: "Free",
    use: "Screenshot landing phrase rotator or beta app Moment Card for Canva slides.",
  },
  {
    category: "Reddit alerts",
    name: "F5Bot",
    url: "https://f5bot.com",
    cost: "Free",
    use: "Email when keywords hit in foster/adopt subreddits — saves scrolling time.",
  },
] as const;

export const BATCH_WORKFLOWS = [
  {
    id: "monday-email",
    title: "Monday — batch 2 weeks of emails",
    minutes: 60,
    steps: [
      "Email Marketing → Email Library: open next 4 pre-launch emails.",
      "Klaviyo → Campaigns: create + schedule story emails (no price until Jul 28).",
      "Attach one script-card image per email from Canva or app screenshot.",
      "Schedule sends for Mon/Thu for next 2 weeks.",
    ],
  },
  {
    id: "saturday-social",
    title: "Saturday — batch social for the week",
    minutes: 90,
    steps: [
      "Content Engine: pick 3 behaviors → Claude → hooks + captions + slide text.",
      "Canva: 2 slideshow reels (5 slides each) from script card screenshots.",
      "CapCut: voiceover + auto captions on both reels.",
      "Buffer: queue 7 X posts (marketing angles) + 2 reels (Wed + Sat slots) + 1 LinkedIn.",
    ],
  },
  {
    id: "sunday-metrics",
    title: "Sunday — light review (optional)",
    minutes: 20,
    steps: [
      "Metrics tab: log week totals.",
      "Launch Calendar: read next week phase goal.",
      "Skip if kids need you — batch work carries the week.",
    ],
  },
] as const;

/** Accelerated pre-launch email milestones (start immediately) */
export const PRE_LAUNCH_EMAIL_MILESTONES = [
  { week: "Jul 1–6", focus: "Story only", showApp: false, showPrice: false, subject: "Why your brain goes blank in hard moments" },
  { week: "Jul 7–13", focus: "Script cards in email", showApp: false, showPrice: false, subject: "One real script — food hoarding / meltdown" },
  { week: "Jul 14–20", focus: "Reveal app", showApp: true, showPrice: false, subject: "First look at Phrasewell + Loom walkthrough" },
  { week: "Jul 21–27", focus: "Proof + how LTD works", showApp: true, showPrice: false, subject: "Beta parents + how Founder access works (no price yet)" },
  { week: "Jul 28–Aug 3", focus: "LAUNCH", showApp: true, showPrice: true, subject: "Founder access open — Core $99 / Vision $169" },
] as const;
