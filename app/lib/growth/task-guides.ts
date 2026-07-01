/** Step-by-step guides for every daily task — zero guesswork for founder or helper */

import { GOTCHA_PITCH } from "@/app/lib/growth/launch-strategy";
import { OUTREACH_TEMPLATES } from "@/app/lib/growth/templates";

export type TaskGuide = {
  tabId: string;
  tabLabel: string;
  minutes: number;
  steps: string[];
  doneWhen: string;
  tip?: string;
  copyText?: string;
  copyLabel?: string;
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

  if (titleHas(task, "x marketing", "x post", "publish 1 x") || (task.task_type === "content" && task.platform === "X")) {
    return {
      tabId: "tools",
      tabLabel: "Tools & Plan",
      minutes: 10,
      steps: [
        "Open Tools & Plan tab → copy gotcha pitch. Use it in every X post.",
        "Content tab → Post templates → use xMarketing or xBuildInPublic (NOT vibe-coding posts).",
        "Pick one angle: script card screenshot, waitlist milestone, marketing lesson, or beta quote.",
        "Paste into X OR pull from Buffer queue if you batched on Saturday.",
        "Mark Posted in Content calendar if you logged a row.",
      ],
      doneWhen: "1 X marketing post live (parenting/distribution angle).",
      tip: "Heavy X is good for build-in-public + career — focus on marketing for parents, not tech stack.",
    };
  }

  if (titleHas(task, "faceless reel", "canva slideshow", "tiktok") || (task.task_type === "content" && task.platform === "TikTok")) {
    return {
      tabId: "tools",
      tabLabel: "Tools & Plan",
      minutes: 35,
      steps: [
        "Open Tools & Plan → UGC reel recipe (full steps).",
        "Content Engine → pick 1 behavior → copy Say this + hook.",
        "Screenshot Moment Card from app or phrasewell.net demo.",
        "Canva → Video → Slideshow: hook slide → problem → screenshot → gotcha pitch → waitlist CTA. Export MP4.",
        "CapCut → import → record your voice reading the script → Auto captions → Export.",
        "Buffer → queue to TikTok + Instagram (same file).",
      ],
      doneWhen: "1 reel queued or posted on TikTok + IG.",
      tip: "Save one Canva template — future reels take ~15 min.",
    };
  }

  if (titleHas(task, "monday batch", "schedule 2 weeks", "klaviyo emails") || (task.task_type === "email" && titleHas(task, "batch"))) {
    return {
      tabId: "email",
      tabLabel: "Email Marketing",
      minutes: 60,
      steps: [
        "Open Tools & Plan → Email milestones table — see what to send this week (no price before Jul 28).",
        "Email Marketing → Email Library → open next 2–4 emails in the pre-launch sequence.",
        "Klaviyo → Campaigns → create + SCHEDULE (not send live one-by-one).",
        "Attach script-card image per email from Canva or screenshot.",
        "Schedule Mon + Thu sends for next 2 weeks.",
      ],
      doneWhen: "At least 4 emails scheduled in Klaviyo.",
      tip: "Do this on good days — skips daily email work on busy kid days.",
    };
  }

  if (titleHas(task, "batch:", "buffer queue", "7 x marketing") || (task.platform === "Canva" && titleHas(task, "batch"))) {
    return {
      tabId: "tools",
      tabLabel: "Tools & Plan",
      minutes: 90,
      steps: [
        "Open Tools & Plan → Saturday batch workflow.",
        "Content Engine → 3 behaviors → Claude → hooks + captions.",
        "Canva → 2 slideshow reels. CapCut → voiceover + captions.",
        "Buffer → queue 7 X posts + 2 reels + 1 LinkedIn for the week.",
      ],
      doneWhen: "Week of social queued in Buffer.",
    };
  }

  if (titleHas(task, "list 5 parents")) {
    return {
      tabId: "outreach",
      tabLabel: "Outreach",
      minutes: 10,
      steps: [
        "Open Outreach tab → Log outreach → Type: Beta invite.",
        "Write down 5 parents you would trust with early feedback (name only — no message yet).",
        "Include your spouse/partner, a foster parent friend, kinship caregiver, or someone from your network.",
        "Set status to Not sent for now. You'll text them in the next task.",
        "Do not post the app link in Facebook groups or Reddit. Handpicked only.",
      ],
      doneWhen: "5 names logged in Outreach (status Not sent is fine).",
      tip: "Pick people who will tell you the truth, not just cheer you on.",
    };
  }

  if (titleHas(task, "handpicked beta", "invite", "text 1")) {
    return {
      tabId: "outreach",
      tabLabel: "Outreach",
      minutes: 15,
      steps: [
        "Copy the text script below. Replace [name] with their first name.",
        "Replace [paste your BETA_APP_PASSWORD from Vercel] with your real beta password (Vercel → Settings → Environment Variables).",
        "Send by text or iMessage to 1–3 people from your list — start with someone you know well (spouse counts as tester #1).",
        "Open Outreach tab → Log outreach for each person: who, Text/SMS, paste what you sent, status Sent.",
        "Tell them to check spam for the sign-in email after they enter their address on the login page.",
        "Do not post phrasewell.net/app/login in groups or Reddit yet.",
      ],
      doneWhen: "At least 1 personal text sent and logged in Outreach.",
      tip: "Warm and short beats polished. They know you — write like you're texting a friend.",
      copyText: OUTREACH_TEMPLATES.handpickedBetaText,
      copyLabel: "Copy text to send",
    };
  }

  if (titleHas(task, "micro-beta", "testimonial", "chase 1") || (task.task_type === "product" && titleHas(task, "micro"))) {
    return {
      tabId: "feedback",
      tabLabel: "Beta Feedback",
      minutes: 15,
      steps: [
        "Skip this task if you have not emailed handpicked beta parents yet.",
        "You should have ≤25 micro-beta parents total — not open to everyone.",
        "Open Beta Feedback → read latest. DM 1 beta parent who had a good experience.",
        "Ask: 'Can I use one sentence about how it helped?' (written quote is enough.)",
        "Flag can_use_publicly on strong quotes in Beta Feedback tab.",
        "If under 10 quotes collected after invites are out, prioritize this over new outreach.",
      ],
      doneWhen: "1 testimonial chase sent OR skipped because no beta invites yet.",
      tip: "Waitlist does NOT get app access — only handpicked parents you email directly.",
    };
  }

  if (titleHas(task, "linkedin") || (task.task_type === "content" && task.platform === "LinkedIn")) {
    return {
      tabId: "content",
      tabLabel: "Content Calendar",
      minutes: 20,
      steps: [
        "Content tab → Post templates → LinkedIn template.",
        "Personalize 1–2 sentences with your foster/adoptive parent story.",
        "Include gotcha pitch: Kids melting down. Tap the behavior. Get words to say instantly.",
        "Post on LinkedIn from your personal profile.",
        "Mark content calendar row as Posted.",
      ],
      doneWhen: "1 LinkedIn founder post live.",
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

  if (titleHas(task, "batch", "canva", "buffer") && !titleHas(task, "faceless reel", "klaviyo")) {
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
    tabId: "tools",
    tabLabel: "Tools & Plan",
    minutes: 15,
    steps: [
      `Gotcha pitch: ${GOTCHA_PITCH}`,
      "Read the task title above.",
      "Check Tools & Plan tab for recipes, or Communities / Content / Email as needed.",
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
