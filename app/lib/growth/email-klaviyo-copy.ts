/** Paste-ready Klaviyo email blocks — subject, preview, body, CTA, graphic/Canva brief */

export type KlaviyoEmailFields = {
  subject: string;
  preview_text: string;
  body: string;
  cta: string;
  graphic_recommendation: string;
  send_timing?: string;
};

export function formatKlaviyoPasteBlock(e: KlaviyoEmailFields): string {
  return `=== KLAVIYO EMAIL ===
Send timing: ${e.send_timing ?? "See flow"}

SUBJECT LINE:
${e.subject}

PREVIEW TEXT:
${e.preview_text}

--- BODY (paste below subject in Klaviyo) ---

${e.body}

--- CTA BUTTON / LINK TEXT ---
${e.cta}
Link: https://www.phrasewell.net

--- GRAPHIC (no stock photos) ---
${e.graphic_recommendation}

CANVA BRIEF:
${graphicCanvaBrief(e.graphic_recommendation)}

=== END ===`;
}

function graphicCanvaBrief(recommendation: string): string {
  const base = "Size: 600×400px or full-width mobile. Background: #F5F3EE (cream). Text: #2B2825 (charcoal). Accent: #C9A876 (sand). Font: Lora for headings, clean sans for body.";
  if (recommendation.toLowerCase().includes("script card")) {
    return `${base}\nLayout: Phone mockup or card with "Say this" quote in large text. One behavior label at top. Phrasewell logo small bottom-right.`;
  }
  if (recommendation.toLowerCase().includes("screenshot")) {
    return `${base}\nLayout: iPhone frame showing phrasewell.net or app screen. Subtle shadow. No clutter.`;
  }
  if (recommendation.toLowerCase().includes("founder")) {
    return `${base}\nLayout: Handwritten-style note card. Sign "— Courtney". Warm, personal, not corporate.`;
  }
  if (recommendation.toLowerCase().includes("testimonial")) {
    return `${base}\nLayout: Quote in large Lora italic. First name + "Foster/adoptive parent" below. No stock faces — text only.`;
  }
  return `${base}\nLayout: ${recommendation}`;
}

/** Full draft body copy keyed by flow_slug + step number */
export const EMAIL_BODY_COPY: Record<string, string> = {
  waitlist_welcome_1: `Hi,

Thank you for joining the Phrasewell waitlist.

Phrasewell is a simple app for foster, adoptive, and kinship parents who need calm, practical words in hard parenting moments — things like food hoarding, meltdowns, lying, aggression, and bedtime battles.

Not another course. Not a 300-page book.

Just: "Say this right now."

The app is already built. I'm inviting small groups of parents to beta test and tell me what's missing. Founder lifetime access opens July 28, 2026 for waitlist members.

What happens next:
• You'll get a personal beta invite when we're ready for the next wave
• I'll share real scripts and behind-the-scenes updates
• You can reply anytime — I read every email

If you're open to it, hit reply and tell me: what's the hardest parenting moment you're dealing with right now?`,

  waitlist_welcome_2: `Hi,

When we adopted, I read the books. I knew the theory — trauma-informed parenting, connection before correction, all of it.

But at 9pm, when my child was melting down over something that looked "small" on the outside, my brain didn't give me words. It gave me panic.

The hardest part of trauma-informed parenting isn't knowing what to do.

It's having the right words when your nervous system is flooded.

That's why I built Phrasewell — short scripts you can actually use in the moment.

If this resonates, you're in the right place.`,

  waitlist_welcome_3: `Hi,

Here's one real script from Phrasewell — for when food hoarding shows up again:

Say this:
"I'm not taking food away. You are safe. There will be more food."

Do this:
Keep your voice low. Offer one small snack now + name the next meal time.

This is the format inside the app: Say this / Do this / a short note on why it works.

Phrasewell covers food and eating, aggression, lying, meltdowns, defiance, bedtime, and more — all built for foster, adoptive, and kinship families.

Beta is open now at phrasewell.net if you want to explore.`,

  waitlist_welcome_4: `Hi,

Quick behind-the-scenes update from me, Courtney — adoptive mom and Phrasewell founder.

The app is live for beta. I'm collecting feedback from parents who actually live this — not focus groups, not generic parenting audiences.

What's working: parents tell me the scripts are short enough to use when they're overwhelmed.

What I'm building next: more behaviors, better search, and launch prep for Founder lifetime access on July 28.

Thank you for being early. It matters.`,

  waitlist_welcome_5: `Hi,

We're getting ready to invite the next wave of beta parents — foster, adoptive, and kinship caregivers who want to test Phrasewell and tell me what's missing.

If that's you, keep an eye on your inbox.

If you'd like to help me place you correctly, reply with:
• Foster, adoptive, or kinship?
• Ages of kids at home?
• The #1 behavior moment you wish you had words for?

Small group. Real feedback. No spam.`,

  beta_invitation_1: `Hi,

Your Phrasewell beta invite is ready.

Open the app: https://www.phrasewell.net/app

You'll need the beta password from this email (or your invite). The app works on your phone — save it to your home screen for hard moments.

Where to start:
1. Pick one category (food, meltdowns, bedtime, etc.)
2. Open a Moment Card
3. Read "Say this" first — use those words before anything else

Try it once tonight if you can. Then tap Yes / Not really on any card — your feedback goes directly to me.

Thank you for testing this with me.
— Courtney`,

  beta_invitation_2: `Hi,

Just a quick reminder — your Phrasewell beta access is waiting.

https://www.phrasewell.net/app

Pick one hard moment you've had this week. Search for it. Read the script out loud once.

Takes about 2 minutes. Helps me more than you know.`,

  beta_invitation_3: `Hi,

Having trouble getting into the beta? Reply to this email and I'll help you personally.

Common fixes:
• Use the password exactly as sent (case-sensitive)
• Try on your phone browser — add to home screen
• Start with one category instead of browsing everything

No question is too small.`,

  beta_invitation_4: `Hi,

You've had a chance to try Phrasewell — thank you.

When you open any Moment Card, you'll see Yes / Not really at the bottom. That feedback goes straight to me and shapes what we build next.

Which category is missing? Which script almost worked but didn't?

30 seconds in the app. Huge help for a small founder-built product.`,

  founder_ltd_launch_5: `Hi,

Founder lifetime access to Phrasewell is open — for waitlist members first.

This is the full app: calm scripts for hard behavior moments, built for foster, adoptive, and kinship parents.

Founder pricing is available for a limited window (through August 3).

Get Founder access: https://www.phrasewell.net

If you have questions about what's included, reply — I'm here.

— Courtney`,
};

export function resolveEmailBody(
  flowSlug: string,
  stepNumber: number,
  bodyOutline: string,
  cta: string,
): string {
  const key = `${flowSlug}_${stepNumber}`;
  if (EMAIL_BODY_COPY[key]) return EMAIL_BODY_COPY[key];

  return `Hi,

I'm Courtney — adoptive mom and founder of Phrasewell.

${bodyOutline}

${cta}

https://www.phrasewell.net

Warmly,
Courtney`;
}

export function buildKlaviyoBlockFromFlowEmail(
  flowSlug: string,
  stepNumber: number,
  e: {
    send_timing: string;
    subject: string;
    preview_text: string;
    body_outline: string;
    cta: string;
    graphic_recommendation: string;
  },
): string {
  return formatKlaviyoPasteBlock({
    send_timing: e.send_timing,
    subject: e.subject,
    preview_text: e.preview_text,
    body: resolveEmailBody(flowSlug, stepNumber, e.body_outline, e.cta),
    cta: e.cta,
    graphic_recommendation: e.graphic_recommendation,
  });
}
