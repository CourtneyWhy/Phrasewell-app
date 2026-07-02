import { GOTCHA_PITCH } from "@/app/lib/growth/launch-strategy";
import type { DemoPhrase } from "@/app/lib/landing-demo-phrases";

/** Glam Up–style viral TikTok format adapted for Phrasewell (before/after script slideshow). */
export type ViralSlideSpec = {
  slide: number;
  label: string;
  dallePrompt: string;
  onScreenText: string;
};

export type ViralTikTokPack = {
  onScreenHook: string;
  caption: string;
  hashtags: string;
  audioSuggestion: string;
  slides: ViralSlideSpec[];
  videoScript: string;
};

const AUDIO_ROTATION = [
  "Soft trending emotional piano (TikTok search: sad piano)",
  "Calm lo-fi beat under 30s",
  "Trending 'storytime' ambient track",
];

const HASHTAG_SETS = [
  "#fostercare #adoptiveparent #momtok #parentingtips #meltdown #phrasewell",
  "#adoption #kinshipcare #specialneedsparent #parentinghack #toddlermom #waitlist",
  "#fostermom #fosterdad #traumainformed #gentleparenting #scripts #phrasewell",
];

function pickByDate<T>(items: T[], isoDate: string): T {
  const day = parseInt(isoDate.slice(8, 10), 10) || 1;
  return items[day % items.length]!;
}

const STYLE =
  "Vertical 9:16 mobile TikTok slide. Cream off-white background #F5F0E8. Minimal calm aesthetic. No photorealistic children faces. Illustration or abstract. Large readable text. Small Phrasewell wordmark top corner.";

export function buildViralTikTokPack(
  behaviorTitle: string,
  phrase: DemoPhrase,
  draftDate: string,
): ViralTikTokPack {
  const hook = `When ${behaviorTitle.toLowerCase()} and your brain goes blank 😭`;
  const wrongLine = "I used to say: \"Stop it right now!\"";
  const rightLine = `Now I say: "${phrase.sayThis}"`;

  const slides: ViralSlideSpec[] = [
    {
      slide: 1,
      label: "Hook",
      onScreenText: hook,
      dallePrompt: `${STYLE} Small hook text upper-left (not centered): "${hook}". Subtle stressed parent silhouette in background. No faces.`,
    },
    {
      slide: 2,
      label: "Before",
      onScreenText: "Your brain goes blank.",
      dallePrompt: `${STYLE} Text: "Your brain goes blank." Abstract chaotic scribbles around edges. Overwhelmed parent energy. Muted brown and cream.`,
    },
    {
      slide: 3,
      label: "Before — old words",
      onScreenText: wrongLine,
      dallePrompt: `${STYLE} Text card: ${wrongLine}. Crossed out or faded styling. Regretful tone.`,
    },
    {
      slide: 4,
      label: "After — app moment",
      onScreenText: "Tap the behavior. Get words.",
      dallePrompt: `${STYLE} Phone mockup showing simple parenting app UI: behavior list and a calm script card. Text overlay: "Tap the behavior. Get words." Clean UI, cream and brown.`,
    },
    {
      slide: 5,
      label: "After — script",
      onScreenText: rightLine,
      dallePrompt: `${STYLE} Large quote card, elegant serif: ${rightLine}. Calm green check or soft glow. Peaceful.`,
    },
    {
      slide: 6,
      label: "CTA",
      onScreenText: "Waitlist in bio → phrasewell.net",
      dallePrompt: `${STYLE} Bold CTA text: "Join the waitlist" and "phrasewell.net". ${GOTCHA_PITCH} as subtitle. Warm inviting.`,
    },
  ];

  const caption = `${hook}

${phrase.sayThis}

${GOTCHA_PITCH}

Waitlist in bio — link won't work in captions so check bio 🔗`;

  return {
    onScreenHook: hook,
    caption,
    hashtags: pickByDate(HASHTAG_SETS, draftDate),
    audioSuggestion: pickByDate(AUDIO_ROTATION, draftDate),
    slides,
    videoScript: `[0-3s HOOK on screen] "${hook}"
[3-8s] Swipe to before slides. Voiceover: "Theory is in your head. The words won't come."
[8-15s] "${wrongLine}"
[15-22s] Show app slide. "I built Phrasewell for this."
[22-30s] "${rightLine}"
[30-35s] "Waitlist in bio. phrasewell.net"`,
  };
}
