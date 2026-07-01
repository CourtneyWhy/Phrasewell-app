import { FLOWS } from "@/app/lib/growth/email-data";
import { getPhaseForDate } from "@/app/lib/growth/launch-phases";
import { enrichTask } from "@/app/lib/growth/task-guides";

export type PlaybookStep = {
  step: number;
  where: string;
  action: string;
};

export type DailyPlaybook = {
  id: string;
  title: string;
  dashboardTab: string;
  klaviyoLocation?: string;
  steps: PlaybookStep[];
};

/** One tab per weekday — exact steps for updating that part of Growth OS */
export const TAB_WEEKLY_PLAYBOOKS: Record<number, DailyPlaybook> = {
  1: {
    id: "monday-email",
    title: "Monday — Email Marketing + newsletter prep",
    dashboardTab: "Email Marketing",
    klaviyoLocation: "Klaviyo → Campaigns + Flows",
    steps: [
      { step: 1, where: "Email Marketing → Overview", action: "Check funnel counts. Update segment estimated counts if Klaviyo numbers changed." },
      { step: 2, where: "Email Marketing → Analytics", action: "Log yesterday's Klaviyo stats: subscribers, open %, click %, unsubscribes." },
      { step: 3, where: "Email Marketing → Flows", action: "Open the next flow with status 'Not started' or 'In Klaviyo'. Build one email in Klaviyo today." },
      { step: 4, where: "Email Marketing → Email Library", action: "Copy subject + preview + body outline for today's email into Klaviyo. Mark email status → In Klaviyo." },
      { step: 5, where: "Klaviyo", action: "Draft Friday newsletter topic. Save as draft campaign." },
      { step: 6, where: "Email Marketing → Flows", action: "When done in Klaviyo, update flow status and mark emails Live or Drafted in dashboard." },
    ],
  },
  2: {
    id: "tuesday-communities",
    title: "Tuesday — Communities + email automations",
    dashboardTab: "Communities",
    klaviyoLocation: "Klaviyo → Flows → Review",
    steps: [
      { step: 1, where: "Communities", action: "Update joined_status for 2 groups you engaged in. Add URLs for any Facebook groups you found." },
      { step: 2, where: "Communities", action: "Set last_engaged_date on 3 communities you commented in today." },
      { step: 3, where: "Email Marketing → Flows", action: "Review all Live flows in Klaviyo match dashboard. Fix any broken triggers." },
      { step: 4, where: "Klaviyo", action: "Check flow analytics: opens/clicks on Waitlist Welcome + Beta Invitation." },
      { step: 5, where: "Outreach", action: "Log 1 group admin message sent. Update status → Sent." },
    ],
  },
  3: {
    id: "wednesday-content-engine",
    title: "Wednesday — Content Engine pipeline",
    dashboardTab: "Content Engine",
    steps: [
      { step: 1, where: "Content Engine", action: "Pick one behavior with Blog = Not started. Click Plan → copy reuse checklist." },
      { step: 2, where: "Content Engine", action: "Draft blog outline. Set Blog → Drafted." },
      { step: 3, where: "Content → Calendar", action: "Schedule LinkedIn + X posts from that behavior for this week." },
      { step: 4, where: "Content Engine", action: "Update LinkedIn + X status → Drafted when copy is ready." },
      { step: 5, where: "Email Marketing → Campaign Calendar", action: "If blog is done, add Friday newsletter entry using that behavior." },
      { step: 6, where: "Canva + CapCut", action: "Screenshot script card → Canva slideshow reel → CapCut voiceover + captions → Buffer queue." },
    ],
  },
  4: {
    id: "thursday-outreach-prep",
    title: "Thursday — Outreach prep (pre-beta)",
    dashboardTab: "Outreach",
    steps: [
      { step: 1, where: "Outreach", action: "List 5 parents you would handpick for micro-beta. Do not invite until onboarding works." },
      { step: 2, where: "Communities", action: "Log groups where you left helpful comments this week. Update last_engaged_date." },
      { step: 3, where: "Communities", action: "Confirm phrasewell.net is in your X and Instagram bio." },
      { step: 4, where: "Email Marketing → Overview", action: "Glance at waitlist count. Note signups since last week." },
    ],
  },
  5: {
    id: "friday-newsletter",
    title: "Friday — Send newsletter + content publish",
    dashboardTab: "Email Marketing",
    klaviyoLocation: "Klaviyo → Campaigns → Send",
    steps: [
      { step: 1, where: "Email Marketing → Campaign Calendar", action: "Confirm today's newsletter subject, CTA, and graphic." },
      { step: 2, where: "Email Marketing → Email Library", action: "Copy final copy into Klaviyo campaign. Preview on mobile." },
      { step: 3, where: "Klaviyo", action: "Send newsletter to Waitlist + Beta Active segments." },
      { step: 4, where: "Email Marketing → Campaign Calendar", action: "Mark campaign Sent. Log any revenue in Revenue attributed field." },
      { step: 5, where: "Content Engine", action: "Mark published channels → Posted for this week's behavior." },
      { step: 6, where: "Metrics", action: "Log waitlist signups, email subscribers, and site visits for the week." },
    ],
  },
  6: {
    id: "saturday-batch",
    title: "Saturday — Batch content + Klaviyo prep",
    dashboardTab: "Content Engine",
    steps: [
      { step: 1, where: "Content Engine", action: "Pick 2 behaviors. Advance Blog + X + LinkedIn to Drafted for both." },
      { step: 2, where: "Content → Calendar", action: "Batch schedule 7 social posts in Buffer/Metricool." },
      { step: 3, where: "Email Marketing → Email Library", action: "Draft 2 emails for next week's flows. Mark Drafted." },
      { step: 4, where: "Klaviyo", action: "Build or schedule next waitlist welcome email if not Live yet." },
    ],
  },
  0: {
    id: "sunday-plan",
    title: "Sunday — Plan week + launch readiness",
    dashboardTab: "Launch Calendar",
    steps: [
      { step: 1, where: "Launch Calendar", action: "Read this week's phase goals. Expand each day Mon–Fri." },
      { step: 2, where: "Email Marketing → Campaign Calendar", action: "Plan next week's sends. Confirm LTD dates if in launch window." },
      { step: 3, where: "Today", action: "Generate next week's tasks (Mon morning)." },
      { step: 4, where: "Metrics + Revenue", action: "Review weekly numbers. Note gaps to target." },
      { step: 5, where: "Email Marketing → Overview", action: "Check funnel drop-offs. Decide one fix for next week." },
    ],
  },
};

const THURSDAY_BETA_PLAYBOOK: DailyPlaybook = {
  id: "thursday-creators-feedback",
  title: "Thursday — Beta feedback + creators",
  dashboardTab: "Beta Feedback",
  klaviyoLocation: "Klaviyo → Lists & Segments",
  steps: [
    { step: 1, where: "Beta Feedback", action: "Review new feedback. Skip if no beta parents invited yet." },
    { step: 2, where: "Beta Feedback", action: "Flag can_use_publicly on any strong testimonial." },
    { step: 3, where: "Creators", action: "Update contact_status on 2 creators you contacted. Add follow-up notes." },
    { step: 4, where: "Email Marketing → Segments", action: "Sync segment counts from Klaviyo into dashboard." },
    { step: 5, where: "Email Marketing → Analytics", action: "Note top + worst email this week. Log in analytics tab." },
  ],
};

function getWeeklyPlaybook(day: number, isoDate: string): DailyPlaybook | undefined {
  if (day === 4) {
    const phase = getPhaseForDate(isoDate);
    return phase.id === "prep" ? TAB_WEEKLY_PLAYBOOKS[4] : THURSDAY_BETA_PLAYBOOK;
  }
  return TAB_WEEKLY_PLAYBOOKS[day];
}

/** Steps to build one Klaviyo flow — used in task notes */
export function getKlaviyoFlowSetupSteps(flowSlug: string): PlaybookStep[] {
  const flow = FLOWS.find((f) => f.slug === flowSlug);
  if (!flow) return [];

  const steps: PlaybookStep[] = [
    { step: 1, where: "Klaviyo → Lists & Segments", action: `Create segment matching dashboard: "${flow.lifecycle_stage}" audience for ${flow.name}.` },
    { step: 2, where: "Klaviyo → Flows → Create", action: `New flow: "${flow.klaviyo_flow_name}". Trigger: ${flow.trigger_description}` },
    { step: 3, where: "Email Marketing → Email Library", action: `Filter by flow ${flow.name}. Copy each email's subject, preview, body, CTA, and graphic note.` },
  ];

  flow.emails.forEach((e, i) => {
    steps.push({
      step: steps.length + 1,
      where: `Klaviyo → Flow email ${i + 1}`,
      action: `${e.send_timing}: "${e.subject}" — Graphic: ${e.graphic_recommendation}. Set delay in flow.`,
    });
  });

  steps.push(
    { step: steps.length + 1, where: "Klaviyo", action: "Test flow with your own email. Confirm trigger fires." },
    { step: steps.length + 1, where: "Email Marketing → Flows", action: `Set flow status → Live. Mark each email Live in dashboard.` },
    { step: steps.length + 1, where: "Email Marketing → Segments", action: "Update estimated_count after first sends." },
  );

  return steps;
}

export function formatStepsAsNotes(steps: PlaybookStep[]): string {
  return steps.map((s) => `${s.step}. [${s.where}] ${s.action}`).join("\n");
}

export function getTodayPlaybooks(isoDate: string): DailyPlaybook[] {
  const day = new Date(isoDate + "T12:00:00").getDay();
  const playbooks: DailyPlaybook[] = [];

  const weekly = getWeeklyPlaybook(day, isoDate);
  if (weekly) playbooks.push(weekly);

  playbooks.push({
    id: "daily-klaviyo-check",
    title: "Every day — Klaviyo + dashboard sync",
    dashboardTab: "Email Marketing",
    klaviyoLocation: "Klaviyo → Analytics",
    steps: [
      { step: 1, where: "Klaviyo → Analytics", action: "Check yesterday's campaign/flow performance (2 min)." },
      { step: 2, where: "Email Marketing → Analytics", action: "Log subscribers, open rate, click rate, unsubscribes." },
      { step: 3, where: "Email Marketing → Overview", action: "Glance at funnel — any stage drop sharply?" },
    ],
  });

  const phase = getPhaseForDate(isoDate);
  if (phase.id === "warmup" || phase.id === "launch") {
    playbooks.push({
      id: "launch-email-prep",
      title: "Launch phase — LTD email readiness",
      dashboardTab: "Email Marketing → Campaign Calendar",
      klaviyoLocation: "Klaviyo → Campaigns",
      steps: [
        { step: 1, where: "Email Marketing → Campaign Calendar", action: "Confirm next LTD send date and subject are Drafted or Scheduled." },
        { step: 2, where: "Klaviyo", action: "Verify Founder LTD Launch flow is Live. Exit condition: purchased." },
        { step: 3, where: "Email Marketing → Campaign Calendar", action: "After send, mark Sent + log revenue attributed." },
      ],
    });
  }

  return playbooks;
}

type TaskSeed = {
  task_title: string;
  task_type: string;
  platform: string;
  priority: string;
  notes?: string;
  link?: string;
};

export function getTabMaintenanceTask(isoDate: string): TaskSeed {
  const day = new Date(isoDate + "T12:00:00").getDay();
  const playbook = getWeeklyPlaybook(day, isoDate);
  if (!playbook) {
    return {
      task_title: "Update Growth OS dashboard tabs",
      task_type: "dashboard",
      platform: "Dashboard",
      priority: "medium",
      notes: "Review Today, Metrics, and Email Marketing tabs.",
    };
  }
  return {
    task_title: `Tab update: ${playbook.dashboardTab} (${playbook.title.split("—")[0].trim()})`,
    task_type: "dashboard",
    platform: playbook.dashboardTab,
    priority: "high",
    notes: formatStepsAsNotes(playbook.steps),
    link: tabLink(playbook.dashboardTab),
  };
}

export function getKlaviyoDailyTask(flowSlug: string, flowName: string): TaskSeed {
  const steps = getKlaviyoFlowSetupSteps(flowSlug);
  const nextSteps = steps.slice(0, 4);
  return {
    task_title: `Klaviyo setup: ${flowName} (continue building flow)`,
    task_type: "klaviyo-setup",
    platform: "Klaviyo",
    priority: "high",
    notes: formatStepsAsNotes(nextSteps) + `\n\nFull flow has ${steps.length} steps — Email Marketing → Flows for all emails.`,
    link: "/admin/growth?tab=email",
  };
}

export function getContentEngineTask(behaviorTitle: string, categoryTitle: string): TaskSeed {
  return {
    task_title: `Content Engine: Produce assets for "${behaviorTitle}"`,
    task_type: "content-engine",
    platform: "Content Engine",
    priority: "high",
    notes: [
      "1. [Content Engine] Open behavior row → click Plan for reuse checklist",
      "2. [Content Engine] Draft blog → set Blog → Drafted",
      "3. [Content] Add X + LinkedIn posts to content calendar",
      "4. [Content Engine] Mark Newsletter, X, LinkedIn → Drafted when copy ready",
      "5. [Canva] Script card graphic — cream bg, no stock photos",
      "6. [Email Marketing → Campaign Calendar] Add to Friday newsletter if blog done",
      `Category: ${categoryTitle}`,
    ].join("\n"),
    link: "/admin/growth?tab=content-engine",
  };
}

export function getKlaviyoBacklogTasks(startDate: string): Array<TaskSeed & { task_date: string }> {
  const tasks: Array<TaskSeed & { task_date: string }> = [];
  const start = new Date(startDate + "T12:00:00");

  FLOWS.forEach((flow, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const steps = getKlaviyoFlowSetupSteps(flow.slug);
    tasks.push({
      task_date: d.toISOString().slice(0, 10),
      task_title: `Klaviyo: Build "${flow.name}" flow (${flow.emails.length} emails)`,
      task_type: "klaviyo-setup",
      platform: "Klaviyo",
      priority: "high",
      notes: formatStepsAsNotes(steps),
      link: "/admin/growth?tab=email",
    });
  });

  return tasks.map((t) => enrichTask(t));
}

function tabLink(tabLabel: string): string {
  const map: Record<string, string> = {
    "Email Marketing": "/admin/growth?tab=email",
    Communities: "/admin/growth?tab=communities",
    "Content Engine": "/admin/growth?tab=content-engine",
    "Beta Feedback": "/admin/growth?tab=feedback",
    Outreach: "/admin/growth?tab=outreach",
    Creators: "/admin/growth?tab=creators",
    "Launch Calendar": "/admin/growth?tab=launch",
    Metrics: "/admin/growth?tab=metrics",
  };
  return map[tabLabel] ?? "/admin/growth";
}

export function getEnhancedDailyTasks(isoDate: string, opts?: {
  nextFlow?: { slug: string; name: string } | null;
  nextBehavior?: { behavior_title: string; category_title: string } | null;
}) {
  const day = new Date(isoDate + "T12:00:00").getDay();
  const tasks: TaskSeed[] = [];

  tasks.push(getTabMaintenanceTask(isoDate));

  tasks.push({
    task_title: "Klaviyo sync: log analytics + check funnel",
    task_type: "email",
    platform: "Klaviyo",
    priority: "high",
    notes: formatStepsAsNotes(getTodayPlaybooks(isoDate).find((p) => p.id === "daily-klaviyo-check")!.steps),
    link: "/admin/growth?tab=email",
  });

  if (opts?.nextFlow) {
    tasks.push(getKlaviyoDailyTask(opts.nextFlow.slug, opts.nextFlow.name));
  }

  if (day === 3 || day === 6) {
    if (opts?.nextBehavior) {
      tasks.push(getContentEngineTask(opts.nextBehavior.behavior_title, opts.nextBehavior.category_title));
    } else {
      tasks.push({
        task_title: "Content Engine: advance one behavior in pipeline",
        task_type: "content-engine",
        platform: "Content Engine",
        priority: "high",
        notes: "1. [Content Engine] Filter by category\n2. [Content Engine] Pick one Not started behavior\n3. [Content Engine] Move Blog → Drafted, then repurpose to X + LinkedIn",
        link: "/admin/growth?tab=content-engine",
      });
    }
  }

  if (day === 1) {
    tasks.push({
      task_title: "Email: write/draft Friday newsletter in Klaviyo",
      task_type: "email",
      platform: "Klaviyo",
      priority: "high",
      notes: "1. [Email Marketing → Campaign Calendar] Pick topic\n2. [Email Marketing → Email Library] Copy template\n3. [Klaviyo] Draft campaign for Friday send",
      link: "/admin/growth?tab=email",
    });
  }

  if (day === 5) {
    tasks.push({
      task_title: "Email: send Friday newsletter + mark campaign Sent",
      task_type: "email",
      platform: "Klaviyo",
      priority: "high",
      notes: formatStepsAsNotes(TAB_WEEKLY_PLAYBOOKS[5].steps.slice(0, 4)),
      link: "/admin/growth?tab=email",
    });
  }

  return tasks.map((t) => enrichTask(t));
}
