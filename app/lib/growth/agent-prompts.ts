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

Category: [category]
Behavior: [behavior]
Say this: [script]
Helpful note: [explanation]

Output: X post, LinkedIn post, Facebook group version, Reddit comment, TikTok caption, Instagram caption, blog outline, Canva image prompt.`,
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
] as const;
