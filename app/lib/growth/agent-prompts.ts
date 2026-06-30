export const AGENT_PROMPTS = [
  {
    name: "Daily Founder Brief",
    purpose: "Generate the founder's daily task list.",
    input: "launch date, current phase, yesterday's metrics, unfinished tasks, content calendar",
    output: "top 5 tasks, posts to publish, communities to engage, creators to contact, metrics to update",
    template: `You are the Phrasewell founder ops assistant.

Launch date: July 28, 2026
Current phase: [phase]
Yesterday metrics: [metrics]
Unfinished tasks: [tasks]
Content scheduled: [content]

Generate today's top 5 tasks, posts to publish, communities to engage, creators to contact, and metrics to log.`,
  },
  {
    name: "Content Repurposer",
    purpose: "Turn one behavior into multiple posts.",
    input: "category, behavior, script, explanation",
    output: "X post, LinkedIn, Facebook group, Reddit comment, TikTok caption, Instagram caption, blog outline, Canva image prompt",
    template: `Repurpose this Phrasewell moment card into multi-platform content.

Gotcha pitch (use in every piece): Kids melting down. Tap the behavior. Get words to say instantly.

Category: [category]
Behavior: [behavior]
Say this: [script]
Helpful note: [explanation]

Output: X marketing post (parenting angle), TikTok/IG 5-slide slideshow script, LinkedIn post, Facebook group version, Reddit comment, Canva slide text, CapCut voiceover script.`,
  },
  {
    name: "Community Research Assistant",
    purpose: "Evaluate groups and communities.",
    input: "group URL or subreddit",
    output: "audience fit, rules summary, can post link, safest first action, first post recommendation",
    template: `Research this community for Phrasewell (foster/adoptive/kinship parenting app).

URL: [url]

Output: audience fit (high/medium/low), rules summary, can post link (yes/no/unknown), safest first action, first post recommendation.`,
  },
  {
    name: "Creator Outreach Assistant",
    purpose: "Prepare creator outreach.",
    input: "creator name, platform, niche, audience",
    output: "DM, follow-up message, collaboration idea, tracking task",
    template: `Prepare outreach for this creator.

Name: [name]
Platform: [platform]
Niche: [niche]
Audience: [audience]

Output: initial DM, follow-up message, collaboration idea, CRM tracking task.`,
  },
  {
    name: "Weekly Metrics Review",
    purpose: "Turn metrics into next actions.",
    input: "daily metrics from last 7 days",
    output: "what worked, what did not, what to do more of, next week focus, revenue pace",
    template: `Review Phrasewell's last 7 days of growth metrics.

Metrics: [weekly metrics]

Output: what worked, what didn't, what to do more of, next week's focus, revenue pace notes.`,
  },
  {
    name: "Email Marketing Manager",
    purpose: "Plan Klaviyo campaigns and email content for the week.",
    input: "launch phase, metrics, waitlist count, segment sizes, recent email performance",
    output: "this week's campaigns, emails to write, fastest-growing segments, subject lines, CTAs, graphics, revenue opportunities",
    template: `You are the Phrasewell Email Marketing Manager. Klaviyo is the send platform — you plan and draft, founder builds in Klaviyo.

Launch phase: [phase]
Waitlist: [count]
Beta active: [count]
LTD revenue: [revenue]
Email open rate: [open_rate]
Top segment: [segment]

Output:
1. This week's campaigns (with send dates)
2. Emails to write (subject + preview + graphic)
3. Segments growing fastest
4. 3 recommended subject lines
5. Recommended CTA per segment
6. Revenue opportunities for founder LTD launch
7. What NOT to automate (no spam, no mass sends)`,
  },
] as const;
