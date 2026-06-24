/** Step-by-step guides for every daily task — zero guesswork for founder or helper */

export type TaskGuide = {
  tabId: string;
  tabLabel: string;
  minutes: number;
  steps: string[];
  doneWhen: string;
  tip?: string;
};

type TaskLike = {
  task_title: string;
  task_type: string | null;
  platform: string | null;
};

function titleHas(task: TaskLike, ...words: string[]) {
  const t = task.task_title.toLowerCase();
  return words.some((w) => t.includes(w.toLowerCase()));
}

export function getTaskGuide(task: TaskLike): TaskGuide {
  if (titleHas(task, "reddit") || (task.task_type === "community" && task.platform === "Reddit")) {
    return {
      tabId: "communities",
      tabLabel: "Communities",
      minutes: 30,
      steps: [
        "Click Open Communities → — you'll see a list of subreddits (start with r/Fosterparents or r/Adoption).",
        "Click the ↗ link next to a subreddit to open it in Reddit (use Reddit in browser, not app, first time).",
        "Sort by New. Find a post where a parent is asking for help — not ads, not politics.",
        "Write 3–5 sentences of real help from your experience. Be warm, specific, and useful.",
        "Do NOT mention Phrasewell or post phrasewell.net unless someone directly asks for a tool.",
        "Repeat until you've left 5 helpful comments (~6 min each = 30 min).",
        "Optional: back on Communities tab, note which subs you used today.",
      ],
      doneWhen: "5 helpful Reddit comments posted, no spam links.",
      tip: "Copy a comment style from Outreach tab → Reddit soft mention — only if it fits naturally.",
    };
  }

  if (titleHas(task, "facebook") || (task.task_type === "community" && task.platform === "Facebook")) {
    return {
      tabId: "communities",
      tabLabel: "Communities",
      minutes: 30,
      steps: [
        "Click Open Communities →. Filter or scroll to Facebook groups.",
        "Open 3 groups you've joined (or join 1 new group — read rules first, lurk before posting).",
        "In each group: find 1–2 posts where you can leave a genuinely helpful comment.",
        "Do NOT post phrasewell.net unless group rules allow it AND you've commented helpfully before.",
        "If a group has no URL yet, search Facebook for the group name and paste URL into Communities tab later.",
        "Update joined_status on Communities tab when you join a new group.",
      ],
      doneWhen: "Thoughtful comments in 3 Facebook groups, no rule-breaking promo.",
      tip: "Facebook group post template is in Content tab → post templates, or Outreach tab.",
    };
  }

  if (titleHas(task, "x post", "publish 1 x") || (task.task_type === "content" && task.platform === "X")) {
    return {
      tabId: "content",
      tabLabel: "Content Calendar",
      minutes: 15,
      steps: [
        "Click Open Content Calendar → — scroll to Post templates at the top.",
        "Copy the X post template OR pick today's row in the content calendar (filter Platform = X).",
        "Fill in [behavior] and [script] from a Phrasewell moment card or Content Engine behavior.",
        "Paste into X (twitter.com) — post from your founder account.",
        "Back on Content tab: find today's row and change status to Posted.",
      ],
      doneWhen: "1 X post published and marked Posted in calendar.",
    };
  }

  if (titleHas(task, "linkedin") || (task.task_type === "content" && task.platform === "LinkedIn")) {
    return {
      tabId: "content",
      tabLabel: "Content Calendar",
      minutes: 20,
      steps: [
        "Click Open Content Calendar → — use the LinkedIn post template at the top.",
        "Personalize 1–2 sentences with your foster/adoptive parent story.",
        "Post on LinkedIn from your personal profile (not a company page yet).",
        "Mark the matching content calendar row as Posted.",
      ],
      doneWhen: "1 LinkedIn founder post live.",
    };
  }

  if (titleHas(task, "beta feedback", "review beta") || task.task_type === "product") {
    return {
      tabId: "feedback",
      tabLabel: "Beta Feedback",
      minutes: 10,
      steps: [
        "Click Open Beta Feedback →.",
        "Read the 5 most recent comments — note any repeated 'not really' themes.",
        "Check thumbs up % at the top. If a category looks problematic, write it down.",
        "Flag can_use_publicly on any quote you'd want on the landing page.",
        "If someone gave great feedback, click Create testimonial request task (or email them).",
      ],
      doneWhen: "Reviewed latest feedback, flagged any testimonials.",
    };
  }

  if (titleHas(task, "creator", "group admin", "outreach") || task.task_type === "outreach") {
    return {
      tabId: "outreach",
      tabLabel: "Outreach",
      minutes: 25,
      steps: [
        "Click Open Outreach → — copy Group admin or Creator DM template.",
        "Click Open Creators tab — pick 2 people with status Not contacted.",
        "Personalize template with their name. Send via Instagram DM, email, or LinkedIn.",
        "Back on Creators tab: change status to Contacted.",
        "Back on Outreach tab: log the message with status Sent (add row if empty — or note in Creators).",
      ],
      doneWhen: "2 outreach messages sent and status updated.",
      tip: "Creators tab has handles and URLs. Don't mass-DM — quality over quantity.",
    };
  }

  if (titleHas(task, "log daily metrics", "metrics") || task.task_type === "metrics") {
    return {
      tabId: "metrics",
      tabLabel: "Metrics",
      minutes: 5,
      steps: [
        "Click Open Metrics →.",
        "Enter today's numbers: website visits, waitlist signups, beta active, Reddit comments, etc.",
        "Use your best estimate — exact numbers can come from Plausible, Supabase waitlist, or manual count.",
        "Click Save metrics at the bottom.",
      ],
      doneWhen: "Today's row saved in Metrics tab.",
    };
  }

  if (titleHas(task, "revenue", "stripe") || task.task_type === "revenue") {
    return {
      tabId: "revenue",
      tabLabel: "Revenue Tracker",
      minutes: 3,
      steps: [
        "Click Open Revenue →.",
        "Enter yesterday's revenue (0 is fine pre-launch).",
        "Units sold, price, refunds → Save revenue.",
      ],
      doneWhen: "Prior-day revenue logged (even if $0).",
    };
  }

  if (titleHas(task, "klaviyo analytics", "klaviyo sync") || (task.task_type === "email" && titleHas(task, "klaviyo"))) {
    return {
      tabId: "email",
      tabLabel: "Email Marketing",
      minutes: 5,
      steps: [
        "Open Klaviyo → Analytics (external site). Note subscribers, open %, click %, unsubscribes.",
        "Click Open Email Marketing → → Analytics sub-tab.",
        "Enter those numbers. Click Save email analytics.",
        "Glance at Overview sub-tab — any funnel stage drop sharply?",
      ],
      doneWhen: "Klaviyo stats logged in Email Marketing → Analytics.",
    };
  }

  if (titleHas(task, "newsletter") || (task.task_type === "email" && task.platform === "Klaviyo")) {
    return {
      tabId: "email",
      tabLabel: "Email Marketing",
      minutes: 30,
      steps: [
        "Click Open Email Marketing → Campaign Calendar sub-tab.",
        "Confirm today's newsletter subject and copy from Email Library.",
        "Copy full Klaviyo block → paste into Klaviyo campaign.",
        "Send in Klaviyo. Mark campaign Sent in Campaign Calendar.",
      ],
      doneWhen: "Newsletter sent and marked Sent.",
    };
  }

  if (task.task_type === "klaviyo-setup") {
    return {
      tabId: "email",
      tabLabel: "Email Marketing",
      minutes: 45,
      steps: [
        "Click Open Email Marketing → → Flows sub-tab.",
        "Find today's flow in the list. Expand it — each email has a Copy button.",
        "In Klaviyo: create segment + flow per the steps in this task's notes below.",
        "Copy each email's full Klaviyo block into Klaviyo.",
        "Test with your own email. Mark flow In Klaviyo → Live when done.",
      ],
      doneWhen: "One full flow built and tested in Klaviyo.",
      tip: "Email Library sub-tab has all copy if Flows is overwhelming.",
    };
  }

  if (task.task_type === "content-engine" || titleHas(task, "content engine")) {
    return {
      tabId: "content-engine",
      tabLabel: "Content Engine",
      minutes: 40,
      steps: [
        "Click Open Content Engine →.",
        "Pick one behavior with Blog = Not started. Click Plan for the reuse checklist.",
        "Draft a short blog or social post. Mark Blog → Drafted.",
        "Copy to Content tab calendar for X + LinkedIn scheduling.",
      ],
      doneWhen: "One behavior moved from Not started to Drafted or Posted.",
    };
  }

  if (titleHas(task, "tab update", "dashboard") || task.task_type === "dashboard") {
    return {
      tabId: "today",
      tabLabel: "Today",
      minutes: 15,
      steps: [
        "Follow the weekday playbook card above this checklist.",
        "Complete each step for today's focus tab.",
        "Check off tasks as you finish them.",
      ],
      doneWhen: "Today's focus tab updated per playbook.",
    };
  }

  if (titleHas(task, "batch", "canva", "buffer") || task.task_type === "content" && titleHas(task, "batch")) {
    return {
      tabId: "content-engine",
      tabLabel: "Content Engine",
      minutes: 60,
      steps: [
        "Content Engine: mark 2 behaviors as Drafted for the week.",
        "Content tab: schedule 7 posts in Buffer/Metricool.",
        "Canva: create 3 script card images (cream background).",
      ],
      doneWhen: "Week of content batched.",
    };
  }

  if (titleHas(task, "weekly metrics", "launch readiness", "plan next") || task.task_type === "planning") {
    return {
      tabId: "launch",
      tabLabel: "Launch Calendar",
      minutes: 20,
      steps: [
        "Open Launch Calendar — read this week's phase and goals.",
        "Open Metrics + Revenue — note waitlist and revenue vs target.",
        "Email Marketing → Campaign Calendar: confirm next week's sends.",
      ],
      doneWhen: "Next week planned, numbers reviewed.",
    };
  }

  if (task.task_type === "launch") {
    return {
      tabId: "launch",
      tabLabel: "Launch Calendar",
      minutes: 20,
      steps: [
        "Open Launch Calendar — find today's date and expand it.",
        "Do each item listed for today (email, content, community, etc.).",
        "Use other tabs as linked from each launch day task.",
      ],
      doneWhen: "Today's launch calendar items complete.",
    };
  }

  // Default
  return {
    tabId: "today",
    tabLabel: "Today",
    minutes: 15,
    steps: [
      "Read the task title above.",
      "Check other tabs if unsure: Communities, Content, Email Marketing, Metrics.",
      "Mark done when complete.",
    ],
    doneWhen: "Task completed.",
  };
}

export function enrichTask<T extends { task_title: string; task_type: string; platform: string; notes?: string; link?: string }>(
  task: T,
): T & { link: string; notes: string } {
  const guide = getTaskGuide(task);
  const notes = [
    `⏱ About ${guide.minutes} min · Tab: ${guide.tabLabel}`,
    "",
    ...guide.steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    `✅ Done when: ${guide.doneWhen}`,
    guide.tip ? `\n💡 Tip: ${guide.tip}` : "",
  ].join("\n");

  return {
    ...task,
    link: `/admin/growth?tab=${guide.tabId}`,
    notes: task.notes && task.task_type === "klaviyo-setup"
      ? `${notes}\n\n--- Klaviyo build steps ---\n${task.notes}`
      : notes,
  };
}

export function formatGuideSteps(guide: TaskGuide): string {
  return guide.steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
}
