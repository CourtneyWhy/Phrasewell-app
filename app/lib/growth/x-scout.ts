import { POST_TEMPLATES } from "@/app/lib/growth/templates";
import type { SupabaseClient } from "@supabase/supabase-js";
import { customizeSocialReply, buildCustomXReply } from "@/app/lib/growth/reply-customizer";

const X_SEARCH_QUERIES = [
  "parenting meltdown what do I say",
  "foster parent behavior help",
  "adoptive parent meltdown",
  "special needs child tantrum parent",
  "trauma informed parenting words",
  "bedtime battle foster child",
] as const;

export type XScoutOpportunity = {
  title: string;
  url: string;
  excerpt: string;
  draft: string;
  score: number;
  sourceName: string;
};

/** Direct status URL only — skips profiles, search, hashtags. */
export function normalizeXStatusUrl(url: string): string | null {
  try {
    const u = new URL(url.replace("twitter.com", "x.com"));
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length >= 3 && parts[1] === "status" && /^\d+$/.test(parts[2]!)) {
      return `https://x.com/${parts[0]}/status/${parts[2]}`;
    }
  } catch {
    /* invalid */
  }
  return null;
}

function scoreXResult(title: string, snippet: string): number {
  const t = `${title} ${snippet}`.toLowerCase();
  let score = 0;
  const keywords = [
    "meltdown",
    "tantrum",
    "foster",
    "adopt",
    "parent",
    "help",
    "what to say",
    "bedtime",
    "hitting",
    "autism",
    "sensory",
    "trauma",
  ];
  for (const kw of keywords) {
    if (t.includes(kw)) score += 2;
  }
  if (t.includes("?")) score += 2;
  return score;
}

function buildXSearchUrl(query: string) {
  return `https://x.com/search?q=${encodeURIComponent(query)}&f=live`;
}

async function draftForPost(title: string, excerpt: string, url: string): Promise<string> {
  return customizeSocialReply({ platform: "x", title, excerpt, url });
}

/** Search X via Serper for direct status links. Falls back to search URLs only if Serper returns nothing. */
export async function fetchXOpportunities(limit = 5): Promise<XScoutOpportunity[]> {
  const serperKey = process.env.SERPER_API_KEY?.trim();
  if (serperKey) {
    const fromApi = await fetchXViaSerper(serperKey, limit);
    if (fromApi.length > 0) return fromApi;
  }

  return X_SEARCH_QUERIES.slice(0, limit).map((query, i) => ({
    title: `Search: ${query}`,
    url: buildXSearchUrl(query),
    excerpt: "Serper found no direct posts — open search and pick a recent thread with few replies.",
    draft: buildCustomXReply(query, "", `search-${i}`),
    score: 1,
    sourceName: "x_search",
  }));
}

async function fetchXViaSerper(apiKey: string, limit: number): Promise<XScoutOpportunity[]> {
  const candidates: XScoutOpportunity[] = [];
  const seen = new Set<string>();

  await Promise.all(
    X_SEARCH_QUERIES.map(async (query) => {
      try {
        const res = await fetch("https://google.serper.dev/search", {
          method: "POST",
          headers: {
            "X-API-KEY": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: `${query} (site:x.com OR site:twitter.com)`,
            num: 15,
            tbs: "qdr:w",
          }),
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          organic?: Array<{ title?: string; link?: string; snippet?: string }>;
        };
        for (const row of data.organic ?? []) {
          const normalized = normalizeXStatusUrl(row.link ?? "");
          if (!normalized || seen.has(normalized)) continue;
          seen.add(normalized);

          const title = row.title ?? "X post";
          const excerpt = row.snippet ?? "";
          const relevance = scoreXResult(title, excerpt);
          if (relevance < 2) continue;

          const draft = await draftForPost(title, excerpt, normalized);
          candidates.push({
            title,
            url: normalized,
            excerpt,
            draft,
            score: relevance,
            sourceName: "serper",
          });
        }
      } catch {
        /* skip query */
      }
    }),
  );

  return candidates.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function buildXPostDraft(dayNumber: number): string {
  return POST_TEMPLATES.xMarketing.replace(
    "[Share one specific moment: e.g. food hoarding, meltdown, hitting]",
    "Meltdowns when words won't come.",
  );
}

export function buildXBuildInPublicDraft(dayNumber: number, waitlistCount: number): string {
  return POST_TEMPLATES.xBuildInPublic
    .replace("[N]", String(dayNumber))
    .replace("[number]", String(waitlistCount))
    .replace("[one marketing thing — email, reel, testimonial]", "Reddit helpful comments + waitlist outreach")
    .replace("[one sentence about what parents responded to]", "Parents want exact words, not more theory.");
}

/** Remove search-link fallbacks and refresh customized drafts for today's X rows. */
export async function refreshTodayXFromSerper(
  db: SupabaseClient,
  scoutDate: string,
): Promise<{ updated: number }> {
  if (!process.env.SERPER_API_KEY?.trim()) {
    return { updated: 0 };
  }

  await db
    .from("growth_social_opportunities")
    .delete()
    .eq("scout_date", scoutDate)
    .eq("platform", "x")
    .eq("source_name", "x_search");

  const { data: existing } = await db
    .from("growth_social_opportunities")
    .select("id, thread_url, thread_title, thread_excerpt")
    .eq("scout_date", scoutDate)
    .eq("platform", "x");

  let updated = 0;
  for (const row of existing ?? []) {
    const draft = await customizeSocialReply({
      platform: "x",
      title: row.thread_title ?? "",
      excerpt: row.thread_excerpt ?? "",
      url: row.thread_url,
    });
    await db
      .from("growth_social_opportunities")
      .update({ draft_response: draft, updated_at: new Date().toISOString() })
      .eq("id", row.id);
    updated += 1;
  }

  return { updated };
}
