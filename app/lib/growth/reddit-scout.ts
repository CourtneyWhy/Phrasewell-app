import { POST_TEMPLATES } from "@/app/lib/growth/templates";

export const REDDIT_SCOUT_SUBREDDITS = [
  "SpecialNeedsChildren",
  "Mommit",
  "AdoptiveParents",
  "Parenting",
] as const;

const SCOUT_KEYWORDS = [
  "meltdown",
  "tantrum",
  "foster",
  "adopt",
  "adoptive",
  "kinship",
  "behavior",
  "hitting",
  "bedtime",
  "lying",
  "what do i say",
  "what to say",
  "help",
  "struggling",
  "trauma",
  "attachment",
  "sensory",
  "autism",
  "adhd",
  "defiance",
  "aggression",
  "overwhelmed",
  "words",
  "script",
];

const USER_AGENT = "PhrasewellGrowthScout/1.0 (+https://www.phrasewell.net)";

type RedditListing = {
  data?: {
    children?: Array<{
      data: {
        id: string;
        title: string;
        selftext: string;
        permalink: string;
        url: string;
        stickied: boolean;
        is_self: boolean;
        num_comments: number;
        created_utc: number;
        author: string;
        over_18: boolean;
      };
    }>;
  };
};

export type RedditScoutPost = {
  subreddit: string;
  title: string;
  excerpt: string;
  url: string;
  score: number;
  numComments: number;
  draft: string;
};

function normalizeUrl(url: string) {
  return url.replace(/\/$/, "").split("?")[0]!.toLowerCase();
}

function scorePost(title: string, body: string): number {
  const text = `${title} ${body}`.toLowerCase();
  let score = 0;
  for (const kw of SCOUT_KEYWORDS) {
    if (text.includes(kw)) score += 2;
  }
  if (text.includes("?")) score += 3;
  if (text.includes("what do") || text.includes("how do")) score += 2;
  if (text.includes("foster") || text.includes("adopt")) score += 3;
  return score;
}

function buildRedditDraft(title: string, excerpt: string): string {
  const snippet = excerpt.slice(0, 200).trim();
  return `That sounds really hard — you're not alone in this.

From what you shared about "${title.slice(0, 100)}${title.length > 100 ? "…" : ""}": one thing that's helped us is keeping it short. Safety first, fewer words, one clear next step.

For example: "I'm here. We're safe. Let's take one breath together."

${snippet ? `Re your situation: ${snippet}${excerpt.length > 200 ? "…" : ""}\n\n` : ""}${POST_TEMPLATES.redditSoft}`.trim();
}

export async function fetchRedditOpportunities(limit = 8): Promise<RedditScoutPost[]> {
  const candidates: RedditScoutPost[] = [];
  const seen = new Set<string>();
  const maxAgeSec = 7 * 24 * 60 * 60;
  const now = Date.now() / 1000;

  for (const sub of REDDIT_SCOUT_SUBREDDITS) {
    try {
      const res = await fetch(`https://www.reddit.com/r/${sub}/new.json?limit=40`, {
        headers: { "User-Agent": USER_AGENT },
        cache: "no-store",
      });
      if (!res.ok) continue;
      const json = (await res.json()) as RedditListing;
      for (const child of json.data?.children ?? []) {
        const p = child.data;
        if (p.stickied || p.over_18 || p.author === "AutoModerator") continue;
        if (!p.is_self && !p.selftext) continue;
        if (now - p.created_utc > maxAgeSec) continue;
        if (p.num_comments > 40) continue;

        const url = `https://www.reddit.com${p.permalink}`;
        const key = normalizeUrl(url);
        if (seen.has(key)) continue;

        const excerpt = (p.selftext || "").trim();
        const relevance = scorePost(p.title, excerpt);
        if (relevance < 4) continue;

        seen.add(key);
        candidates.push({
          subreddit: sub,
          title: p.title,
          excerpt: excerpt.slice(0, 500),
          url,
          score: relevance,
          numComments: p.num_comments,
          draft: buildRedditDraft(p.title, excerpt),
        });
      }
    } catch {
      /* skip subreddit on network error */
    }
  }

  return candidates.sort((a, b) => b.score - a.score).slice(0, limit);
}

export { normalizeUrl as normalizeThreadUrl };
