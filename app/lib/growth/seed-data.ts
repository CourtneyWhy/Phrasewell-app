import { BLOG_TITLES, BEHAVIOR_CATEGORIES, CREATOR_PITCH } from "@/app/lib/growth/templates";
import { LAUNCH_WEEK_PLAN, getPhaseForDate } from "@/app/lib/growth/launch-phases";
import { getEnhancedDailyTasks } from "@/app/lib/growth/daily-playbooks";
import { enrichTask } from "@/app/lib/growth/task-guides";

const PITCH = CREATOR_PITCH;

export function getSeedCommunities() {
  const reddit = [
    ["r/Fosterparents", "https://www.reddit.com/r/Fosterparents/"],
    ["r/fosterit", "https://www.reddit.com/r/fosterit/"],
    ["r/Adoption", "https://www.reddit.com/r/Adoption/"],
    ["r/AdoptiveParents", "https://www.reddit.com/r/AdoptiveParents/"],
    ["r/Parenting", "https://www.reddit.com/r/Parenting/"],
    ["r/Mommit", "https://www.reddit.com/r/Mommit/"],
    ["r/Daddit", "https://www.reddit.com/r/Daddit/"],
    ["r/AttachmentParenting", "https://www.reddit.com/r/AttachmentParenting/"],
    ["r/SpecialNeedsChildren", "https://www.reddit.com/r/SpecialNeedsChildren/"],
    ["r/Autism_Parenting", "https://www.reddit.com/r/Autism_Parenting/"],
  ].map(([name, url]) => ({
    platform: "Reddit",
    name,
    url,
    audience_type: "Foster/adoptive/kinship parents",
    estimated_size: "Verify",
    priority: name.includes("Foster") || name.includes("Adopt") ? "high" : "medium",
    joined_status: "not_joined",
    promo_rules: "Read sub rules. Helpful comments first. Link only when natural.",
    best_post_angle: "Helpful comment first. Soft mention: building a script tool for hard moments.",
    notes: "First action: lurk and comment. No direct selling.",
  }));

  const facebook = [
    "TBRI for Adoptive Parents",
    "Foster and Adoptive Parents Support Group",
    "Foster Parent Support Group",
    "Foster Parent Help and Support Group",
    "Therapeutic Foster Parents Support Group",
    "Adoptive Parents Support Group",
    "Parenting Kids with Trauma and Attachment Challenges",
    "Trauma Informed Parenting",
    "Connected Parenting Community",
    "Foster the Family Community",
    "Kinship Caregivers Support Group",
    "Relative and Kinship Caregivers",
    "Foster Care and Adoption Support",
    "RAD Parents Network",
    "Reactive Attachment Disorder Support Group",
    "Parenting Children with Trauma Histories",
    "Trust-Based Relational Intervention / TBRI parent groups",
    "Local Georgia foster/adoptive parent support groups",
    "Cobb County foster/adoptive parent groups",
    "Atlanta foster parent support groups",
  ].map((name) => ({
    platform: "Facebook",
    name,
    url: null,
    audience_type: "Foster/adoptive/kinship",
    estimated_size: "Research URL",
    priority: "high",
    joined_status: "not_joined",
    promo_rules: "Ask admin before link. No direct selling. Feedback angle only.",
    best_post_angle: "I'm building this and need feedback from parents who live this.",
    notes: "Verify URL and rules. First action: lurk or ask admin.",
  }));

  return [...reddit, ...facebook];
}

export function getSeedCreators() {
  const instagram = [
    ["Laura / Foster Parent Partner", "@foster.parenting", "https://www.instagram.com/foster.parenting/"],
    ["Real Life Foster Mom", "@reallifefostermom", null],
    ["Jamie Finn / Foster the Family", "@fosterthefamilyblog", null],
    ["The Forgotten Initiative", null, null],
    ["Creating a Family", null, "https://www.creatingafamily.org/"],
    ["Kristin Berry / Honestly Adoption", null, null],
    ["Nicole T. Barlow / Foster Parent Well", null, null],
    ["Peter Mutabazi / Now I Am Known", null, null],
    ["TBRI / Karyn Purvis Institute", null, "https://child.tcu.edu/about-us/tbri/"],
    ["Empowered to Connect", null, null],
    ["Robyn Gobbel", "@robyngobbel", null],
    ["Dr. Becky / Good Inside", "@drbeckyatgoodinside", null],
    ["Seed and Sew", null, null],
    ["The Occuplaytional Therapist", null, null],
    ["Mr. Chazz", null, null],
    ["Destini Ann", null, null],
    ["Curious Parenting", null, null],
    ["Attachment Nerd", null, null],
  ];

  const podcasts = [
    "Foster Parent Well",
    "The Empowered Parent Podcast",
    "Honestly Adoption",
    "The Forgotten Podcast",
    "Creating a Family Podcast",
    "The Adoption and Fostering Podcast",
    "What to Expect While Fostering and Adopting",
    "The Adoption and Foster Care Journey",
    "Fearless Fostering",
    "Foster Care: An Unparalleled Journey",
  ];

  const creators = instagram.map(([name, handle, url]) => ({
    platform: "Instagram",
    name,
    handle,
    url,
    niche: "Foster/adoptive parenting",
    audience_fit: "High — verify follower count",
    estimated_followers: "Verify",
    priority: "high" as const,
    contact_method: "DM",
    contact_status: "not_contacted" as const,
    outreach_angle: PITCH,
    notes: "Verify URL and audience before outreach.",
  }));

  const podcastRows = podcasts.map((name) => ({
    platform: "Podcast",
    name,
    handle: null,
    url: null,
    niche: "Foster/adoption",
    audience_fit: "High",
    estimated_followers: null,
    priority: "medium" as const,
    contact_method: "Email",
    contact_status: "not_contacted" as const,
    outreach_angle: PITCH,
    notes: "Find show URL and host contact.",
  }));

  const linkedin = [
    "Foster care trainers",
    "Adoption agency directors",
    "CASA leaders",
    "Child welfare professionals",
    "Trauma-informed parenting educators",
    "Therapists — foster/adoptive families",
    "Parent coaches — adoption/foster care",
  ].map((name) => ({
    platform: "LinkedIn",
    name,
    handle: null,
    url: null,
    niche: "Professional / educator",
    audience_fit: "Medium–high",
    estimated_followers: null,
    priority: "medium" as const,
    contact_method: "LinkedIn message",
    contact_status: "not_contacted" as const,
    outreach_angle: PITCH,
    notes: "Research specific people in each category.",
  }));

  return [...creators, ...podcastRows, ...linkedin];
}

const CONTENT_TYPES = [
  "Script card",
  "What to say when…",
  "Founder build-in-public",
  "Parenting myth reframe",
  "Beta tester request",
  "Behind-the-scenes",
  "Blog post",
  "Creator DM",
  "Group admin DM",
];

const PLATFORMS_ROTATION = ["X", "X", "LinkedIn", "Facebook", "Reddit", "Blog", "X", "Instagram"];

export function generateContentCalendar(startDate = "2026-06-23", days = 35) {
  const items = [];
  const start = new Date(startDate + "T12:00:00");

  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const publish_date = d.toISOString().slice(0, 10);
    const day = d.getDay();
    const category = BEHAVIOR_CATEGORIES[i % BEHAVIOR_CATEGORIES.length];
    const type = CONTENT_TYPES[i % CONTENT_TYPES.length];
    let platform = PLATFORMS_ROTATION[i % PLATFORMS_ROTATION.length];
    if (platform === "LinkedIn" && ![1, 3, 5].includes(day)) platform = "X";
    if (platform === "Blog" && day !== 1 && day !== 4) platform = "X";

    const topic =
      type === "Blog post"
        ? BLOG_TITLES[i % BLOG_TITLES.length]
        : `${category}: what to say in the moment`;

    items.push({
      publish_date,
      platform,
      content_type: type,
      topic,
      hook: `Hard moment: ${category.toLowerCase()}`,
      body: null,
      cta:
        i < 20
          ? "Phrasewell is in beta now. Join the waitlist at phrasewell.net."
          : i < 30
            ? "I'm inviting foster/adoptive/kinship parents to test it and tell me what's missing."
            : "Founder lifetime access opens July 28 for the waitlist.",
      image_prompt: `Phrasewell script card — ${category}, cream background, charcoal text`,
      status: "idea" as const,
      notes: null,
    });
  }
  return items;
}

export function generateDailyTasks(fromDate = "2026-07-01", toDate = "2026-08-03") {
  const tasks: Array<{
    task_date: string;
    task_title: string;
    task_type: string;
    platform: string;
    priority: string;
    status: string;
  }> = [];

  const start = new Date(fromDate + "T12:00:00");
  const end = new Date(toDate + "T12:00:00");

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const task_date = d.toISOString().slice(0, 10);
    const day = d.getDay();
    const isWeekend = day === 0 || day === 6;

    if (isWeekend) {
      if (day === 6) {
        tasks.push(
          { task_date, task_title: "Batch: 2 faceless reels (Canva + CapCut) + Buffer queue", task_type: "content", platform: "Canva", priority: "high", status: "not_started" },
          { task_date, task_title: "Batch: queue 7 X marketing posts in Buffer", task_type: "content", platform: "X", priority: "high", status: "not_started" },
          { task_date, task_title: "Review community tracker", task_type: "community", platform: "All", priority: "medium", status: "not_started" },
        );
      } else {
        tasks.push(
          { task_date, task_title: "Review weekly metrics", task_type: "metrics", platform: "Dashboard", priority: "high", status: "not_started" },
          { task_date, task_title: "Update launch readiness", task_type: "planning", platform: "Dashboard", priority: "high", status: "not_started" },
          { task_date, task_title: "Plan next week — or skip if needed", task_type: "planning", platform: "Dashboard", priority: "low", status: "not_started" },
        );
      }
      continue;
    }

    const weekday = getTodayChecklist(task_date).map((t) => ({
      task_title: t.task_title,
      task_type: t.task_type ?? "general",
      platform: t.platform ?? "Dashboard",
      priority: t.priority ?? "medium",
    }));

    if (day === 1) {
      weekday.push({ task_title: "Monday batch: schedule 2 weeks of Klaviyo emails", task_type: "email", platform: "Klaviyo", priority: "high" });
    }

    if (day === 3 || day === 6) {
      weekday.push({ task_title: "Faceless reel: Canva slideshow + CapCut voiceover → TikTok/IG", task_type: "content", platform: "TikTok", priority: "high" });
    }

    if (day === 5) {
      weekday.push({ task_title: "LinkedIn founder post (1/week)", task_type: "content", platform: "LinkedIn", priority: "medium" });
    }

    if (day >= 1 && day <= 5) {
      weekday.push({ task_title: "Log prior-day revenue ($0 OK pre-launch)", task_type: "revenue", platform: "Stripe", priority: "low" });
    }

    const launchPlan = LAUNCH_WEEK_PLAN[task_date];
    if (launchPlan) {
      launchPlan.tasks.forEach((t) => {
        weekday.push({ task_title: t, task_type: "launch", platform: "All", priority: "high" });
      });
    }

    getEnhancedDailyTasks(task_date).forEach((t) => weekday.push(t));

    weekday.forEach((t) => tasks.push({ ...enrichTask(t), task_date, status: "not_started" }));
  }

  return tasks;
}

export function getTodayChecklist(isoDate?: string) {
  const phase = getPhaseForDate(isoDate ?? new Date().toISOString().slice(0, 10));

  const base = [
    { task_title: "30 min Reddit/community help (5 comments)", task_type: "community", platform: "Reddit", priority: "high" },
    { task_title: "30 min Facebook group engagement (3 groups)", task_type: "community", platform: "Facebook", priority: "high" },
    { task_title: "X marketing post — parenting angle", task_type: "content", platform: "X", priority: "high" },
    { task_title: "Log daily metrics", task_type: "metrics", platform: "Dashboard", priority: "high" },
  ];

  const preInvite = [
    {
      task_title: "Handpicked beta: list 5 parents you would invite by name",
      task_type: "planning",
      platform: "Outreach",
      priority: "medium",
    },
    {
      task_title: "Handpicked beta: invite 1–3 people you know (beta password + phrasewell.net/app/login)",
      task_type: "product",
      platform: "App",
      priority: "high",
    },
  ];

  if (phase.id === "prep") {
    return [
      ...base,
      ...preInvite,
      {
        task_title: "Waitlist: confirm phrasewell.net is in X + IG bio",
        task_type: "waitlist",
        platform: "Social",
        priority: "medium",
      },
    ].map((t) => enrichTask(t));
  }

  if (phase.id === "beta") {
    return [
      ...base,
      ...preInvite,
      {
        task_title: "Micro-beta: chase 1 testimonial (only after they used the app)",
        task_type: "product",
        platform: "App",
        priority: "medium",
      },
    ].map((t) => enrichTask(t));
  }

  return [
    ...base,
    {
      task_title: "Micro-beta: chase 1 testimonial quote (≤25 parents)",
      task_type: "product",
      platform: "App",
      priority: "medium",
    },
  ].map((t) => enrichTask(t));
}

/** @deprecated use getTodayChecklist(isoDate) */
export const TODAY_CHECKLIST = getTodayChecklist();
