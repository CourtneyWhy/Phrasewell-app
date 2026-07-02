import { POST_TEMPLATES } from "@/app/lib/growth/templates";

const X_SEARCH_QUERIES = [
  "parenting meltdown foster OR adoptive",
  "foster parent behavior help",
  "adoptive parent what to say",
  "special needs child tantrum",
  "trauma informed parenting moment",
] as const;

export type XScoutOpportunity = {
  title: string;
  url: string;
  excerpt: string;
  draft: string;
  score: number;
  sourceName: string;
};

function buildXCommentDraft(topic: string): string {
  return `This resonates. In our house, the win is fewer words when everyone's flooded.

One line that's helped: "I'm here. We're safe. We can figure out the rest together."

Building Phrasewell for exactly these moments — calm scripts when your brain goes blank. No pitch unless you want the link.

(Re: ${topic.slice(0, 80)})`.trim();
}

function buildXSearchUrl(query: string) {
  return `https://x.com/search?q=${encodeURIComponent(query)}&f=live`;
}

/** Search X via Serper (optional). Falls back to live search links + draft templates. */
export async function fetchXOpportunities(limit = 5): Promise<XScoutOpportunity[]> {
  const serperKey = process.env.SERPER_API_KEY?.trim();
  if (serperKey) {
    const fromApi = await fetchXViaSerper(serperKey, limit);
    if (fromApi.length > 0) return fromApi;
  }

  return X_SEARCH_QUERIES.slice(0, limit).map((query, i) => ({
    title: `Live search: ${query}`,
    url: buildXSearchUrl(query),
    excerpt: "Open this search, pick a recent post with few replies, and use the draft comment below.",
    draft: buildXCommentDraft(query),
    score: 10 - i,
    sourceName: "x_search",
  }));
}

async function fetchXViaSerper(apiKey: string, limit: number): Promise<XScoutOpportunity[]> {
  const results: XScoutOpportunity[] = [];
  const seen = new Set<string>();

  for (const query of X_SEARCH_QUERIES) {
    if (results.length >= limit) break;
    try {
      const res = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: `${query} site:x.com OR site:twitter.com`,
          num: 10,
        }),
        cache: "no-store",
      });
      if (!res.ok) continue;
      const data = (await res.json()) as {
        organic?: Array<{ title?: string; link?: string; snippet?: string }>;
      };
      for (const row of data.organic ?? []) {
        const link = row.link ?? "";
        if (!link.includes("x.com/") && !link.includes("twitter.com/")) continue;
        if (link.includes("/search") || link.includes("/hashtag")) continue;
        const key = link.split("?")[0]!.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        results.push({
          title: row.title ?? "X post",
          url: link,
          excerpt: row.snippet ?? "",
          draft: buildXCommentDraft(row.title ?? row.snippet ?? query),
          score: 8,
          sourceName: "serper",
        });
        if (results.length >= limit) break;
      }
    } catch {
      /* try next query */
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function buildXPostDraft(dayNumber: number): string {
  return POST_TEMPLATES.xMarketing.replace("[Share one specific moment: e.g. food hoarding, meltdown, hitting]", "Meltdowns when words won't come.");
}

export function buildXBuildInPublicDraft(dayNumber: number, waitlistCount: number): string {
  return POST_TEMPLATES.xBuildInPublic
    .replace("[N]", String(dayNumber))
    .replace("[number]", String(waitlistCount))
    .replace("[one marketing thing — email, reel, testimonial]", "Reddit helpful comments + waitlist outreach")
    .replace("[one sentence about what parents responded to]", "Parents want exact words, not more theory.");
}
