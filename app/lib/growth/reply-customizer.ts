import { POST_TEMPLATES } from "@/app/lib/growth/templates";
import { hasOpenAI } from "@/app/lib/growth/openai-images";

export type ReplyContext = {
  platform: "reddit" | "x";
  title: string;
  excerpt: string;
  url: string;
};

type Topic =
  | "meltdown"
  | "bedtime"
  | "hitting"
  | "foster"
  | "school"
  | "sensory"
  | "lying"
  | "food"
  | "defiance"
  | "general";

const OPENERS: Record<Topic, string[]> = {
  meltdown: [
    "When the meltdown is that loud, your nervous system is getting hit too.",
    "That level of dysregulation is exhausting for everyone in the room.",
  ],
  bedtime: [
    "Bedtime battles are so draining when everyone is already tired.",
    "The loop at night can feel endless when sleep is the thing you need most.",
  ],
  hitting: [
    "When safety is on the line, your body goes into protect mode fast.",
    "Hitting in the moment is scary — you're not wrong for freezing or yelling.",
  ],
  foster: [
    "Foster and adoptive parents carry a lot that most people never see.",
    "Kinship and foster moments need extra grace — you're doing hard work.",
  ],
  school: [
    "School calls and public meltdowns add a whole other layer of stress.",
    "When behavior spills into school, it can feel like you're on trial as a parent.",
  ],
  sensory: [
    "Sensory overload can look like \"bad behavior\" from the outside.",
    "When their body is overwhelmed, logic often lands too late.",
  ],
  lying: [
    "Lying in trauma-affected kids often comes from fear, not manipulation.",
    "The lying piece is so painful when you're trying to build trust.",
  ],
  food: [
    "Food struggles tap deep survival stuff for a lot of kids.",
    "Hoarding or sneaking food is more common than people admit.",
  ],
  defiance: [
    "Defiance is often a control bid when they feel small or unsafe.",
    "Power struggles eat up the whole evening before you realize it.",
  ],
  general: [
    "This sounds really hard — you're not alone in it.",
    "Parenting in these moments is brutal when the words won't come.",
  ],
};

const SCRIPTS: Record<Topic, string> = {
  meltdown: `"I'm here. We're safe. We can calm together first, talk second."`,
  bedtime: `"It's bedtime. I'll stay close. You don't have to like it."`,
  hitting: `"I won't let you hit. I'm moving us to safety."`,
  foster: `"You're safe with me. We'll figure this out together."`,
  school: `"We'll handle school tomorrow. Right now we're getting through this moment."`,
  sensory: `"Your body is having a hard time. Let's lower the noise and slow down."`,
  lying: `"I want the truth, and you're not in trouble for telling me."`,
  food: `"Food is available on our schedule. You will eat again."`,
  defiance: `"The answer is no. I'm not arguing — I'm staying calm."`,
  general: `"I'm here. We're safe. Let's take one breath together."`,
};

function detectTopic(title: string, excerpt: string): Topic {
  const t = `${title} ${excerpt}`.toLowerCase();
  if (/meltdown|tantrum|sobbing|scream/.test(t)) return "meltdown";
  if (/bedtime|sleep|night|won't go to bed/.test(t)) return "bedtime";
  if (/hit|kick|bite|aggress|violent/.test(t)) return "hitting";
  if (/foster|adopt|kinship|trauma|attachment/.test(t)) return "foster";
  if (/school|teacher|iep|classroom/.test(t)) return "school";
  if (/sensory|autism|adhd|overstim/.test(t)) return "sensory";
  if (/lying|lie|dishonest/.test(t)) return "lying";
  if (/food|eat|hoard|snack/.test(t)) return "food";
  if (/defian|refus|won't listen|control/.test(t)) return "defiance";
  return "general";
}

function pickVariant<T>(items: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash + seed.charCodeAt(i) * (i + 1)) % 2147483647;
  return items[hash % items.length]!;
}

function pullQuote(title: string, excerpt: string): string {
  const combined = `${title}. ${excerpt}`.trim();
  const sentences = combined.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 20);
  if (sentences.length === 0) return title.slice(0, 120);
  return sentences[0]!.slice(0, 140);
}

export function buildCustomRedditReply(title: string, excerpt: string, url: string): string {
  const topic = detectTopic(title, excerpt);
  const opener = pickVariant(OPENERS[topic], url);
  const script = SCRIPTS[topic];
  const quote = pullQuote(title, excerpt);
  const detail = excerpt.trim().slice(0, 180);

  return `${opener}

You wrote about "${quote}" — that tracks.

What helped us in similar moments: fewer words, safety first, then one clear script like: ${script}

${detail ? `Re your post: ${detail}${excerpt.length > 180 ? "…" : ""}\n\n` : ""}${POST_TEMPLATES.redditSoft}`.trim();
}

export function buildCustomXReply(title: string, excerpt: string, url: string): string {
  const topic = detectTopic(title, excerpt);
  const opener = pickVariant(OPENERS[topic], url + title);
  const script = SCRIPTS[topic];
  const quote = pullQuote(title, excerpt);

  return `${opener}

Re: "${quote}"

One line we use: ${script}

Happy to share more if useful — building calm scripts for these exact moments.`.trim();
}

async function enhanceWithOpenAI(ctx: ReplyContext, ruleBased: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return ruleBased;

  const platformRules =
    ctx.platform === "reddit"
      ? "Reddit comment. Helpful first. No link. No product mention unless natural. 4-6 sentences."
      : "X reply. Under 280 chars if possible. Warm, specific to their post. No hashtag spam. Light mention you build parenting scripts only if natural.";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.85,
      messages: [
        {
          role: "system",
          content: `You write unique foster/adoptive/parenting community replies for Courtney (Phrasewell founder). ${platformRules} No em dashes. Each reply must reference something specific from their post. Never reuse the same opening line.`,
        },
        {
          role: "user",
          content: `Platform: ${ctx.platform}
Post title: ${ctx.title}
Post excerpt: ${ctx.excerpt || "(none)"}
URL: ${ctx.url}

Draft to improve (make more specific, still authentic):
${ruleBased}`,
        },
      ],
    }),
    cache: "no-store",
  });

  if (!res.ok) return ruleBased;
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const text = data.choices?.[0]?.message?.content?.trim();
  return text && text.length > 40 ? text : ruleBased;
}

export async function customizeSocialReply(ctx: ReplyContext): Promise<string> {
  const ruleBased =
    ctx.platform === "reddit"
      ? buildCustomRedditReply(ctx.title, ctx.excerpt, ctx.url)
      : buildCustomXReply(ctx.title, ctx.excerpt, ctx.url);

  if (!hasOpenAI()) return ruleBased;
  try {
    return await enhanceWithOpenAI(ctx, ruleBased);
  } catch {
    return ruleBased;
  }
}
