import { resolveEmailBody } from "@/app/lib/growth/email-klaviyo-copy";

export const LIFECYCLE_FUNNEL = [
  { id: "visitor", label: "Website Visitor", stage: 0 },
  { id: "waitlist", label: "Waitlist", stage: 1 },
  { id: "beta_invite", label: "Beta Invite", stage: 2 },
  { id: "beta_user", label: "Beta User", stage: 3 },
  { id: "highly_engaged", label: "Highly Engaged", stage: 4 },
  { id: "testimonial", label: "Testimonial", stage: 5 },
  { id: "founder_ltd", label: "Founder LTD", stage: 6 },
  { id: "power_user", label: "Power User", stage: 7 },
  { id: "referral", label: "Referral", stage: 8 },
  { id: "subscription", label: "Subscription", stage: 9 },
] as const;

export const SEGMENTS = [
  {
    slug: "waitlist",
    name: "Waitlist",
    definition: "Joined waitlist but never received beta invite.",
    lifecycle_stage: "waitlist",
    klaviyo_segment_name: "Waitlist — No Beta Invite",
    priority: "high",
  },
  {
    slug: "beta_invited",
    name: "Beta Invited",
    definition: "Received beta invitation email with app password.",
    lifecycle_stage: "beta_invite",
    klaviyo_segment_name: "Beta Invited",
    priority: "high",
  },
  {
    slug: "beta_active",
    name: "Beta Active",
    definition: "Has logged into and used Phrasewell.",
    lifecycle_stage: "beta_user",
    klaviyo_segment_name: "Beta Active",
    priority: "high",
  },
  {
    slug: "highly_engaged",
    name: "Highly Engaged",
    definition: "Viewed multiple scripts, submitted feedback, positive feedback.",
    lifecycle_stage: "highly_engaged",
    klaviyo_segment_name: "Highly Engaged Beta",
    priority: "high",
  },
  {
    slug: "testimonial_candidates",
    name: "Testimonial Candidates",
    definition: "Positive feedback and permission granted to use publicly.",
    lifecycle_stage: "testimonial",
    klaviyo_segment_name: "Testimonial Candidates",
    priority: "high",
  },
  {
    slug: "founder_ltd",
    name: "Founder LTD",
    definition: "Purchased Founder Lifetime Deal.",
    lifecycle_stage: "founder_ltd",
    klaviyo_segment_name: "Founder LTD Customers",
    priority: "high",
  },
  {
    slug: "monthly_subscriber",
    name: "Monthly Subscriber",
    definition: "Converted from LTD or waitlist to monthly subscription.",
    lifecycle_stage: "subscription",
    klaviyo_segment_name: "Monthly Subscribers",
    priority: "medium",
  },
  {
    slug: "former_ltd_promoters",
    name: "Former LTD Promoters",
    definition: "Referred another customer.",
    lifecycle_stage: "referral",
    klaviyo_segment_name: "LTD Promoters / Referrals",
    priority: "medium",
  },
  {
    slug: "inactive",
    name: "Inactive",
    definition: "No email opens in 30 days.",
    lifecycle_stage: "inactive",
    klaviyo_segment_name: "Inactive 30 Days",
    priority: "low",
  },
] as const;

type FlowEmail = {
  send_timing: string;
  subject: string;
  preview_text: string;
  body_outline: string;
  goal: string;
  cta: string;
  graphic_recommendation: string;
};

type FlowDef = {
  slug: string;
  name: string;
  purpose: string;
  trigger_description: string;
  goal: string;
  lifecycle_stage: string;
  klaviyo_flow_name: string;
  sort_order: number;
  emails: FlowEmail[];
};

export const FLOWS: FlowDef[] = [
  {
    slug: "waitlist_welcome",
    name: "Waitlist Welcome",
    purpose: "Welcome new waitlist signups and build anticipation for beta.",
    trigger_description: "Joined waitlist (Klaviyo list signup or API event)",
    goal: "Build anticipation and trust before beta invite.",
    lifecycle_stage: "waitlist",
    klaviyo_flow_name: "Waitlist Welcome Series",
    sort_order: 1,
    emails: [
      {
        send_timing: "Immediately",
        subject: "You're on the Phrasewell waitlist",
        preview_text: "Calm scripts for hard parenting moments — here's what happens next.",
        body_outline: "Welcome. What Phrasewell is (exact words for hard behavior moments). What happens next (beta waves, founder access July 28).",
        goal: "Confirm signup and set expectations",
        cta: "Reply with your hardest parenting moment",
        graphic_recommendation: "Landing page screenshot — warm cream palette, no stock photos",
      },
      {
        send_timing: "Day 2",
        subject: "The hardest part of trauma-informed parenting",
        preview_text: "It's not the theory. It's the moment your brain goes blank.",
        body_outline: "Founder story: theory vs in-the-moment words. Why scripts matter for foster/adoptive/kinship parents.",
        goal: "Emotional connection",
        cta: "Read one script example on phrasewell.net",
        graphic_recommendation: "Founder note — handwritten-style card on cream background",
      },
      {
        send_timing: "Day 5",
        subject: "One real Phrasewell script",
        preview_text: "What to say when food hoarding shows up again.",
        body_outline: "Share one script card (food/eating or meltdown). Explain Say this / Do this format.",
        goal: "Show product value before beta",
        cta: "Join waitlist friends — forward this email",
        graphic_recommendation: "Script card — phone screenshot of Moment Card",
      },
      {
        send_timing: "Day 8",
        subject: "Behind the scenes: building Phrasewell",
        preview_text: "Why I built this as an adoptive mom.",
        body_outline: "Build-in-public update. App is built. Beta waves coming. Founder LTD July 28.",
        goal: "Trust and transparency",
        cta: "Follow on LinkedIn for updates",
        graphic_recommendation: "Behind-the-scenes product screenshot",
      },
      {
        send_timing: "Day 12",
        subject: "We're inviting beta parents soon",
        preview_text: "Small groups first — foster, adoptive, and kinship parents.",
        body_outline: "Beta invite timeline. Who we're looking for. What feedback we need.",
        goal: "Prepare for beta invitation",
        cta: "Update your preferences — reply with parent type",
        graphic_recommendation: "Beta tester request — simple illustration of parent + phone",
      },
    ],
  },
  {
    slug: "beta_invitation",
    name: "Beta Invitation",
    purpose: "Get waitlist members into the app.",
    trigger_description: "Added to Beta Invited segment (manual or automated)",
    goal: "Get app usage and first session.",
    lifecycle_stage: "beta_invite",
    klaviyo_flow_name: "Beta Invitation Flow",
    sort_order: 2,
    emails: [
      {
        send_timing: "Immediately",
        subject: "Your Phrasewell beta invite is here",
        preview_text: "The app is ready. Here's your access.",
        body_outline: "Invitation. Link to phrasewell.net/app. Password instructions. What to try first.",
        goal: "First login",
        cta: "Open Phrasewell app",
        graphic_recommendation: "Phone screenshot — home screen with category tiles",
      },
      {
        send_timing: "Day 1 if no login",
        subject: "Quick reminder — your beta access",
        preview_text: "Takes 2 minutes to try your first script.",
        body_outline: "Reminder with password. Suggest one behavior to try tonight.",
        goal: "Recover non-openers",
        cta: "Open app and try one Moment Card",
        graphic_recommendation: "Script card close-up",
      },
      {
        send_timing: "Day 3 if no login",
        subject: "Need help getting in?",
        preview_text: "Reply to this email — I'll help you personally.",
        body_outline: "Second reminder. Offer personal help. FAQ: password, mobile, categories.",
        goal: "Remove friction",
        cta: "Reply for help",
        graphic_recommendation: "Founder note",
      },
      {
        send_timing: "Day 7 after first session",
        subject: "How is Phrasewell working for you?",
        preview_text: "Your feedback shapes what we build next.",
        body_outline: "Feedback request. Thumbs up/down in app. What categories missing?",
        goal: "Collect product feedback",
        cta: "Leave feedback on one Moment Card",
        graphic_recommendation: "Beta insight — feedback UI screenshot",
      },
    ],
  },
  {
    slug: "beta_nurture",
    name: "Beta Nurture",
    purpose: "Deepen usage and collect feedback from active beta users.",
    trigger_description: "First app session recorded",
    goal: "Collect feedback and increase script views.",
    lifecycle_stage: "beta_user",
    klaviyo_flow_name: "Beta Nurture Flow",
    sort_order: 3,
    emails: [
      {
        send_timing: "Day 1 after first session",
        subject: "How to get the most out of Phrasewell",
        preview_text: "Pin favorites. Search. Use in the moment.",
        body_outline: "Tips: pin categories, search behaviors, read Say this before Do this, use at bedtime/ meltdown.",
        goal: "Increase engagement",
        cta: "Pin your top 3 categories",
        graphic_recommendation: "Phone screenshot — pinned favorites",
      },
      {
        send_timing: "Day 4",
        subject: "Most-used categories from beta parents",
        preview_text: "Food, meltdowns, and bedtime top the list.",
        body_outline: "Share popular categories. Suggest exploring one they haven't tried.",
        goal: "Expand usage",
        cta: "Try one new behavior category",
        graphic_recommendation: "Category tiles screenshot",
      },
      {
        send_timing: "Day 8",
        subject: "Need help with a specific moment?",
        preview_text: "Reply — tell me what's missing.",
        body_outline: "Offer support. Ask what behavior they wish was covered.",
        goal: "Product insight",
        cta: "Reply with a missing behavior",
        graphic_recommendation: "Founder note",
      },
      {
        send_timing: "Day 14",
        subject: "Quick feedback reminder",
        preview_text: "30 seconds in the app — helps us a lot.",
        body_outline: "Feedback reminder. Founder LTD coming July 28 for waitlist.",
        goal: "Feedback before launch",
        cta: "Leave feedback on any card",
        graphic_recommendation: "Beta testimonial quote (if available)",
      },
    ],
  },
  {
    slug: "testimonial_request",
    name: "Testimonial Request",
    purpose: "Collect landing page testimonials from happy beta users.",
    trigger_description: "Positive feedback (helpful = yes) in app",
    goal: "Landing page testimonials with permission.",
    lifecycle_stage: "testimonial",
    klaviyo_flow_name: "Testimonial Request Flow",
    sort_order: 4,
    emails: [
      {
        send_timing: "Immediately",
        subject: "Would you mind sharing your experience?",
        preview_text: "Helps other foster and adoptive parents find us.",
        body_outline: "Thank them for positive feedback. Ask for 2-3 sentences. Permission to use name/first name only.",
        goal: "Get testimonial text",
        cta: "Reply with your testimonial",
        graphic_recommendation: "Beta testimonial card template",
      },
      {
        send_timing: "Day 5 if no reply",
        subject: "Thank you — no pressure",
        preview_text: "Your feedback already helped.",
        body_outline: "Soft follow-up. Thank you regardless. Still invite to founder access.",
        goal: "Close loop warmly",
        cta: "Optional: reply if you change your mind",
        graphic_recommendation: "Founder note",
      },
    ],
  },
  {
    slug: "trustpilot",
    name: "Trustpilot",
    purpose: "Collect public reviews after launch (20+ happy users first).",
    trigger_description: "Happy customer segment — post-LTD or highly engaged",
    goal: "Collect Trustpilot reviews.",
    lifecycle_stage: "founder_ltd",
    klaviyo_flow_name: "Trustpilot Review Flow",
    sort_order: 5,
    emails: [
      {
        send_timing: "Immediately",
        subject: "Would you leave a quick review?",
        preview_text: "Helps other parents find Phrasewell.",
        body_outline: "Review request. Link to Trustpilot (when live). Why reviews matter for small founder brand.",
        goal: "Get review",
        cta: "Leave a Trustpilot review",
        graphic_recommendation: "Simple illustration — stars + phone",
      },
      {
        send_timing: "Day 7",
        subject: "Reminder — review Phrasewell",
        preview_text: "2 minutes. Means a lot.",
        body_outline: "Reminder. Thank you.",
        goal: "Recover non-responders",
        cta: "Leave review",
        graphic_recommendation: "Founder note",
      },
      {
        send_timing: "After review",
        subject: "Thank you for your review",
        preview_text: "You're helping other parents find calm words.",
        body_outline: "Thank you. Refer a friend option.",
        goal: "Gratitude + referral seed",
        cta: "Tell a friend about Phrasewell",
        graphic_recommendation: "Thank you — warm script card",
      },
    ],
  },
  {
    slug: "founder_ltd_launch",
    name: "Founder LTD Launch",
    purpose: "Convert waitlist and beta users to Founder Lifetime Deal.",
    trigger_description: "July 1 — segment: waitlist + micro-beta, exclude purchased",
    goal: "Story → reveal → convert Jul 28 – Aug 3. No price before Jul 28.",
    lifecycle_stage: "founder_ltd",
    klaviyo_flow_name: "Founder LTD Launch Sequence",
    sort_order: 6,
    emails: [
      { send_timing: "July 1", subject: "Why your brain goes blank in hard moments", preview_text: "It's not the theory. It's the words.", body_outline: "Story only — foster/adoptive parent struggle. No app screenshots. No price.", goal: "Curiosity", cta: "Reply with your hardest moment", graphic_recommendation: "Founder note — cream card" },
      { send_timing: "July 4", subject: "One real script — when food hoarding shows up again", preview_text: "Say this / Do this format.", body_outline: "Share one script card IMAGE in email. Still no app login. No price.", goal: "Value tease", cta: "See more on phrasewell.net", graphic_recommendation: "Script card screenshot" },
      { send_timing: "July 8", subject: "The old way vs what parents actually need", preview_text: "Courses vs words in 10 seconds.", body_outline: "Contrast theory-heavy advice with instant scripts. Gotcha pitch. No price.", goal: "Positioning", cta: "Join waitlist", graphic_recommendation: "Before/after text graphic" },
      { send_timing: "July 15", subject: "First look at Phrasewell", preview_text: "Kids melting down. Tap the behavior. Get words instantly.", body_outline: "REVEAL — Loom walkthrough link. What's in v1. Honest about what's coming. NO PRICE.", goal: "Reveal", cta: "Watch 3-min walkthrough", graphic_recommendation: "App screenshot — Moment Card" },
      { send_timing: "July 18", subject: "Meet parents who tried it", preview_text: "Real quotes from micro-beta.", body_outline: "Testimonials from ≤25 beta parents. No price.", goal: "Proof", cta: "Read their words", graphic_recommendation: "Testimonial quotes" },
      { send_timing: "July 22", subject: "How Founder access will work", preview_text: "Opens July 28. Limited window.", body_outline: "Explain 2 tiers conceptually (Core vs Vision) WITHOUT dollar amounts. Cap + deadline. No refunds policy.", goal: "Mechanics", cta: "Mark your calendar", graphic_recommendation: "Countdown graphic" },
      { send_timing: "July 27", subject: "Tomorrow — Founder access opens", preview_text: "Waitlist gets first access.", body_outline: "Eve of launch. FAQ link. STILL NO PRICE in this email.", goal: "Anticipation", cta: "Get ready", graphic_recommendation: "Countdown — script card" },
      { send_timing: "July 28", subject: "Founder access is open", preview_text: "Core $99 / Vision $169 — limited window.", body_outline: "LAUNCH. First time prices shown. Core $99 lifetime / Vision $169 all future features. Link checkout.", goal: "Convert", cta: "Get Founder Access", graphic_recommendation: "Pricing page screenshot" },
      { send_timing: "July 29", subject: "Your questions answered", preview_text: "FAQ — pricing, access, what's included.", body_outline: "Objection handling FAQ.", goal: "Remove friction", cta: "Get Founder access", graphic_recommendation: "FAQ snippet" },
      { send_timing: "July 31", subject: "Halfway through Founder access", preview_text: "Social proof + reminder.", body_outline: "Mid-window update. Testimonials. Units sold (if comfortable).", goal: "Urgency", cta: "Join before window closes", graphic_recommendation: "Testimonial collage" },
      { send_timing: "August 2", subject: "48 hours left — Founder access", preview_text: "Closes August 3.", body_outline: "Final urgency.", goal: "Convert stragglers", cta: "Get lifetime access", graphic_recommendation: "Script card + countdown" },
      { send_timing: "August 3", subject: "Last chance — Founder access closes tonight", preview_text: "Final email in this window.", body_outline: "Last chance. Thank you regardless.", goal: "Final conversion", cta: "Get Founder access now", graphic_recommendation: "Landing page screenshot" },
    ],
  },
  {
    slug: "post_purchase",
    name: "Post Purchase",
    purpose: "Onboard LTD customers and drive referrals.",
    trigger_description: "Purchased Founder LTD (Stripe webhook → Klaviyo event)",
    goal: "Activation, retention, referrals.",
    lifecycle_stage: "founder_ltd",
    klaviyo_flow_name: "Post Purchase Onboarding",
    sort_order: 7,
    emails: [
      { send_timing: "Immediately", subject: "Welcome to Phrasewell — Founder access", preview_text: "You're in. Here's how to start.", body_outline: "Welcome. Login. Pin favorites. Support email.", goal: "Activation", cta: "Open the app", graphic_recommendation: "Welcome — phone home screen" },
      { send_timing: "Day 2", subject: "How to pin your favorite scripts", preview_text: "Build your go-to list for hard moments.", body_outline: "Pin tutorial.", goal: "Engagement", cta: "Pin 3 Moment Cards", graphic_recommendation: "Pinned favorites screenshot" },
      { send_timing: "Day 5", subject: "Best scripts to start with", preview_text: "Top categories from foster and adoptive parents.", body_outline: "Curated starter list by category.", goal: "Value", cta: "Try these scripts", graphic_recommendation: "Script card grid" },
      { send_timing: "Day 10", subject: "Need help?", preview_text: "Reply anytime — I read every email.", body_outline: "Support offer.", goal: "Reduce churn", cta: "Reply with questions", graphic_recommendation: "Founder note" },
      { send_timing: "Day 21", subject: "Tell a friend about Phrasewell", preview_text: "Know a foster or adoptive parent who needs this?", body_outline: "Referral ask. Share link.", goal: "Referrals", cta: "Forward this email", graphic_recommendation: "Simple share graphic" },
    ],
  },
];

export const FUTURE_FLOWS = [
  { slug: "winback", name: "Winback Flow", purpose: "Re-engage inactive subscribers", trigger_description: "No opens 60+ days", status: "planned" },
  { slug: "referral", name: "Referral Flow", purpose: "Reward referrals from LTD promoters", trigger_description: "Referral link used", status: "planned" },
  { slug: "subscription_upsell", name: "Subscription Upsell", purpose: "Convert LTD users to subscription add-ons or renewals", trigger_description: "Post-LTD window", status: "planned" },
  { slug: "feature_announcement", name: "Feature Announcement", purpose: "New behaviors, categories, or features", trigger_description: "Product release", status: "planned" },
  { slug: "holiday_campaigns", name: "Holiday Campaigns", purpose: "Seasonal parenting moments", trigger_description: "Calendar dates", status: "planned" },
  { slug: "abandoned_checkout", name: "Abandoned Checkout", purpose: "Recover Stripe checkout abandoners", trigger_description: "Started checkout, no purchase", status: "planned" },
  { slug: "price_increase", name: "Price Increase Announcement", purpose: "Grandfather LTD before price change", trigger_description: "Pricing change date", status: "planned" },
];

export const EMAIL_TEMPLATES = {
  newsletterIntro: `Subject: [Friday Newsletter] {{topic}}

Preview: {{one_line_hook}}

Body structure:
- Opening: one parenting moment this week
- Main content: {{blog | script | founder update | feature | beta insight}}
- Soft CTA: phrasewell.net
- Graphic: {{phone screenshot | script card | founder note}}`,

  klaviyoBuildChecklist: `Klaviyo build checklist:
1. Create segment in Klaviyo (match dashboard segment name)
2. Build flow with trigger event
3. Copy subject + preview from Email Library
4. Paste body outline into Klaviyo template
5. Add graphic per recommendation (no stock photos)
6. Set status to Live in dashboard when deployed
7. Log send in Campaign Calendar`,

  contentReuse: `From one blog post, create:
- 1 newsletter section
- 1 X thread (5 tweets)
- 1 LinkedIn post
- 1 Facebook group version (helpful, no hard sell)
- 1 Reddit comment (helpful first)
- 1 Canva script card graphic`,
};

export const LTD_CAMPAIGN_DATES = [
  "2026-07-21", "2026-07-23", "2026-07-25", "2026-07-27", "2026-07-28",
  "2026-07-29", "2026-07-31", "2026-08-02", "2026-08-03",
];

export const EMAIL_DAILY_TASKS = [
  { task_title: "Review Klaviyo analytics (opens, clicks, unsubscribes)", task_type: "email", platform: "Klaviyo", priority: "high" },
  { task_title: "Check segment growth in Klaviyo vs dashboard", task_type: "email", platform: "Klaviyo", priority: "medium" },
];

export const EMAIL_WEEKLY_TASKS: Record<number, { task_title: string; task_type: string; platform: string; priority: string }> = {
  1: { task_title: "Write next newsletter", task_type: "email", platform: "Klaviyo", priority: "high" },
  2: { task_title: "Review Klaviyo automations", task_type: "email", platform: "Klaviyo", priority: "high" },
  3: { task_title: "Clean email list (inactive, bounces)", task_type: "email", platform: "Klaviyo", priority: "medium" },
  4: { task_title: "Review email analytics + top/worst performers", task_type: "email", platform: "Klaviyo", priority: "high" },
  5: { task_title: "Send Friday newsletter", task_type: "email", platform: "Klaviyo", priority: "high" },
  0: { task_title: "Plan next week's email campaigns", task_type: "email", platform: "Dashboard", priority: "high" },
};

export const FRIDAY_NEWSLETTER_IDEAS = [
  "Blog post recap",
  "One Phrasewell script card",
  "Founder build-in-public update",
  "New feature or behavior category",
  "Beta parent insight or testimonial",
];

export function getSeedSegments() {
  return SEGMENTS.map((s) => ({
    ...s,
    status: "active",
    estimated_count: 0,
    notes: "Build matching segment in Klaviyo. Update count manually or via Klaviyo API later.",
  }));
}

export function getSeedFlows() {
  return FLOWS.map((f) => ({
    slug: f.slug,
    name: f.name,
    purpose: f.purpose,
    trigger_description: f.trigger_description,
    goal: f.goal,
    lifecycle_stage: f.lifecycle_stage,
    klaviyo_flow_name: f.klaviyo_flow_name,
    sort_order: f.sort_order,
    status: "not_started",
    owner: "Courtney",
    notes: null,
  }));
}

export function getSeedFlowEmails() {
  return FLOWS.flatMap((f) =>
    f.emails.map((e, i) => ({
      flow_slug: f.slug,
      step_number: i + 1,
      ...e,
      body_outline: resolveEmailBody(f.slug, i + 1, e.body_outline, e.cta),
      status: "idea",
      notes: `Graphic: ${e.graphic_recommendation}`,
    })),
  );
}

export function getSeedEmailLibrary() {
  return FLOWS.flatMap((f) =>
    f.emails.map((e, i) => ({
      slug: `${f.slug}_${i + 1}`,
      subject: e.subject,
      preview_text: e.preview_text,
      goal: e.goal,
      cta: e.cta,
      graphic_recommendation: e.graphic_recommendation,
      body_outline: resolveEmailBody(f.slug, i + 1, e.body_outline, e.cta),
      status: "idea",
      campaign: f.name,
      flow_slug: f.slug,
      lifecycle_stage: f.lifecycle_stage,
      notes: `Graphic: ${e.graphic_recommendation}`,
    })),
  );
}

export function getSeedCampaigns() {
  const ltdFlow = FLOWS.find((f) => f.slug === "founder_ltd_launch")!;
  return ltdFlow.emails.map((e, i) => ({
    send_date: LTD_CAMPAIGN_DATES[i] ?? null,
    campaign_name: `LTD Launch — ${e.subject}`,
    campaign_type: "launch",
    segment_slug: "waitlist",
    subject: e.subject,
    preview_text: e.preview_text,
    goal: e.goal,
    cta: e.cta,
    graphic_recommendation: e.graphic_recommendation,
    status: "planned",
    flow_slug: "founder_ltd_launch",
    notes: "Remove from flow on purchase in Klaviyo.",
  }));
}

export function getEmailTasksForDay(dayOfWeek: number) {
  const tasks = [...EMAIL_DAILY_TASKS];
  const weekly = EMAIL_WEEKLY_TASKS[dayOfWeek];
  if (weekly) tasks.push(weekly);
  if (dayOfWeek === 5) {
    tasks.push({
      task_title: "Approve tomorrow's newsletter (if scheduled)",
      task_type: "email",
      platform: "Klaviyo",
      priority: "high",
    });
  }
  return tasks;
}
