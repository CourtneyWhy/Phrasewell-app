import aggressionLibrary from "@/app/data/phrasewell_aggression_safety_risks_v2_universal_3variants.json";
import bigFeelingsLibrary from "@/app/data/phrasewell_big_feelings_meltdowns_v1_universal_3variants.json";
import defianceLibrary from "@/app/data/phrasewell_defiance_control_v1_universal_3variants.json";
import nighttimeSleepLibrary from "@/app/data/phrasewell_nighttime_sleep_v1_universal_3variants.json";
import sensoryBodyLibrary from "@/app/data/phrasewell_sensory_body_struggles_v1_universal_3variants.json";
import foodEatingLibrary from "@/app/data/phrasewell_food_eating_v1_universal_3variants.json";
import lyingRealityLibrary from "@/app/data/phrasewell_lying_reality_distortion_v1_universal_3variants.json";
import stealingTakingLibrary from "@/app/data/phrasewell_stealing_taking_things_v2_universal_3variants.json";

export type MomentId =
  | "starting_to_escalate"
  | "unsafe_right_now"
  | "after_it_happened";

export type AgeBand = "0-3" | "4-7" | "8-12" | "Teen";

export type MomentCard = {
  id: string;
  category_id: string;
  category_name: string;
  category_subtitle: string;
  behavior_id: string;
  behavior_name: string;
  legacy_behavior_id?: string | null;
  age_band_id?: string;
  age_band: AgeBand;
  moment_id: MomentId;
  moment_label: string;
  variant_number?: number;
  say_this: string;
  do_this: string;
  helpful_note: string;
  safety_note?: string;
  safety_step?: string;
  tags: string[];
  search_terms: string[];
  is_approved: boolean;
  content_version: string;
  runtime_ai_generation_allowed: boolean;
};

export type MomentDefinition = {
  id: MomentId;
  label: string;
};

export type SearchResult = {
  card: MomentCard;
  score: number;
  catalogBehaviorId: string;
  catalogCategoryId: string;
};

type RawCard = Partial<MomentCard> & {
  is_approved?: boolean;
  approved?: boolean;
  runtime_ai_generation_allowed?: boolean;
  context_id?: string;
  context_label?: string;
  legacy_moment_id?: string;
  category_label?: string;
  behavior_label?: string;
  age_band_label?: string;
  age_label?: string;
  card_id?: string;
  behavior_aliases?: string[];
  variant?: number;
  safety_note?: string | null;
};

type RawBehavior = {
  id?: string;
  behavior_id?: string;
  legacy_behavior_id?: string | null;
  search_aliases?: string[];
  aliases?: string[];
  search_terms?: string[];
};

type ContentBehavior = {
  id: string;
  legacy_behavior_id?: string | null;
  search_aliases?: string[];
};

type ContentLibrarySource = {
  cards: unknown[];
  behaviors?: RawBehavior[];
  category?: {
    behaviors?: Array<{
      id: string;
      legacy_behavior_id?: string | null;
      aliases?: string[];
      search_aliases?: string[];
    }>;
  };
};

/** Map app route IDs → content library behavior IDs */
const CATALOG_BEHAVIOR_TO_CONTENT: Record<string, string> = {
  hitting_kicking_angry: "hitting_kicking_when_angry",
  biting_overwhelmed: "biting_when_overwhelmed",
  threatening_hurt_others: "threatening_to_hurt_others",
  objects_as_weapons: "using_objects_as_weapons",
  running_unsafe_areas: "running_into_unsafe_areas",
  hurting_siblings: "hurting_another_child",
  sobbing_meltdown: "complete_sobbing_meltdown",
  screaming_long_periods: "screaming_for_long_periods",
  not_my_real_mom_dad: "you_are_not_my_real_parent",
  running_away_house: "running_away_in_house",
  shutdown_refusal_speak: "shutdown_refusal_to_speak",
  says_no_everything: "saying_no_to_everything",
  power_struggle_small: "power_struggle_over_small_things",
  refusing_transition: "refusing_to_transition",
  ignoring_adult_public: "ignoring_adult_in_public",
  manipulating_adults: "manipulating_adults_against_each_other",
  demanding_control_schedule: "demanding_control_of_schedule",
  getting_out_bed_repeatedly: "getting_out_of_bed_repeatedly",
  afraid_of_dark: "afraid_of_the_dark",
  hoarding_items_bed: "hoarding_items_in_bed",
  sneaking_out_night: "sneaking_out_at_night",
  refusing_sleep_alone: "refusing_to_sleep_alone",
  early_waking_roaming: "early_waking_and_roaming",
  clothing_seams_tags: "clothing_seams_or_tags_meltdown",
  refusing_brush_teeth: "refusing_to_brush_teeth",
  refusing_bath_shower: "refusing_bath_or_shower",
  hoarding_food_room: "hoarding_food_in_room",
  hiding_food: "hiding_food_under_bed_or_drawers",
  asking_food_constantly: "asking_for_food_constantly",
  gorging_hiding_wrappers: "gorging_then_hiding_wrappers",
  stealing_food_night: "stealing_food_at_night",
  refusing_served: "refusing_to_eat_what_is_served",
  throwing_food_upset: "throwing_food_when_upset",
  gorging_vomiting: "gorging_then_vomiting",
  anxiety_not_enough_food: "anxiety_about_not_enough_food",
  eating_fast_panicked: "eating_extremely_fast_and_panicked",
  didnt_do_it_obvious: "obvious_denial",
  lying_homework: "lying_about_homework",
  taking_from_school: "taking_items_from_school",
  taking_adult_items: "taking_adult_items_secretly",
};

const CONTENT_BEHAVIOR_TO_CATALOG: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(CATALOG_BEHAVIOR_TO_CONTENT).map(([catalog, content]) => [content, catalog])
  ),
};

const CATALOG_CATEGORY_TO_CONTENT: Record<string, string> = {
  aggression_safety: "aggression_safety_risks",
  big_feelings: "big_feelings_meltdowns",
  sensory_body: "sensory_body_struggles",
  lying_reality: "lying_reality_distortion",
  stealing_taking: "stealing_taking_things",
};

const CONTENT_CATEGORY_TO_CATALOG: Record<string, string> = {
  aggression_safety_risks: "aggression_safety",
  big_feelings_meltdowns: "big_feelings",
  sensory_body_struggles: "sensory_body",
  lying_reality_distortion: "lying_reality",
  stealing_taking_things: "stealing_taking",
};

const MOMENT_ID_MAP: Record<string, MomentId> = {
  calm_this_down: "starting_to_escalate",
  stop_unsafe_behavior: "unsafe_right_now",
  repair_afterward: "after_it_happened",
  starting_to_escalate: "starting_to_escalate",
  unsafe_right_now: "unsafe_right_now",
  after_it_happened: "after_it_happened",
  early_escalation: "starting_to_escalate",
  active_meltdown: "unsafe_right_now",
  post_incident_repair: "after_it_happened",
};

function normalizeMomentId(value: string): MomentId {
  return MOMENT_ID_MAP[value] ?? "unsafe_right_now";
}

const AGE_BAND_FROM_ID: Record<string, AgeBand> = {
  "0_3": "0-3",
  "4_7": "4-7",
  "8_12": "8-12",
  teen: "Teen",
};

function ageBandFromRaw(raw: RawCard): AgeBand {
  const bandKey = raw.age_band_id ?? raw.age_band;
  if (bandKey && AGE_BAND_FROM_ID[bandKey]) {
    return AGE_BAND_FROM_ID[bandKey];
  }
  if (raw.age_band) return normalizeAgeBand(raw.age_band);
  if (raw.age_band_label) return normalizeAgeBand(raw.age_band_label);
  if (raw.age_label) return normalizeAgeBand(raw.age_label);
  return "4-7";
}

/** Microsoft Style Guide polish for parent-facing card copy. */
function polishDisplayText(text: string): string {
  let out = text.trim();
  out = out
    .replace(/\u2019/g, "'")
    .replace(/\u2018/g, "'")
    .replace(/\u201c/g, '"')
    .replace(/\u201d/g, '"');
  out = out.replace(/(^|[.!?]\s+|[,;]\s+|\s)i(\s|'|[,.!?]|$)/g, "$1I$2");
  out = out.replace(/^i(\s|'|[,.!?])/g, "I$1");
  out = out.replace(/\s{2,}/g, " ");
  return out;
}

function normalizeCard(raw: RawCard): MomentCard | null {
  if (raw.is_approved === false || raw.approved === false || raw.runtime_ai_generation_allowed === true) {
    return null;
  }
  const id = raw.id ?? raw.card_id;
  if (!id || !raw.category_id || !raw.behavior_id || !raw.say_this || !raw.do_this) return null;

  const momentSource =
    raw.moment_id ?? raw.context_id ?? raw.legacy_moment_id ?? "unsafe_right_now";
  const moment_id = normalizeMomentId(momentSource);

  return {
    id,
    category_id: raw.category_id,
    category_name: raw.category_name ?? raw.category_label ?? "",
    category_subtitle: raw.category_subtitle ?? "",
    behavior_id: raw.behavior_id,
    behavior_name: raw.behavior_name ?? raw.behavior_label ?? "",
    legacy_behavior_id: raw.legacy_behavior_id,
    age_band_id: raw.age_band_id,
    age_band: ageBandFromRaw(raw),
    moment_id,
    moment_label: raw.moment_label ?? raw.context_label ?? "",
    variant_number: raw.variant_number ?? raw.variant,
    say_this: polishDisplayText(raw.say_this),
    do_this: polishDisplayText(raw.do_this),
    helpful_note: raw.helpful_note ? polishDisplayText(raw.helpful_note) : "",
    safety_note: raw.safety_note?.trim() ? polishDisplayText(raw.safety_note.trim()) : undefined,
    safety_step: raw.safety_step,
    tags: raw.tags ?? [],
    search_terms: raw.search_terms ?? [],
    is_approved: true,
    content_version: raw.content_version ?? "",
    runtime_ai_generation_allowed: false,
  };
}

function loadCardsFromLibrary(library: ContentLibrarySource): MomentCard[] {
  return (library.cards as RawCard[])
    .map(normalizeCard)
    .filter((c): c is MomentCard => c !== null)
    .sort((a, b) => (a.variant_number ?? 0) - (b.variant_number ?? 0));
}

function extractBehaviors(library: ContentLibrarySource): ContentBehavior[] {
  if (library.behaviors?.length) {
    const behaviors: ContentBehavior[] = [];
    for (const b of library.behaviors) {
      const id = b.id ?? b.behavior_id;
      if (!id) continue;
      behaviors.push({
        id,
        legacy_behavior_id: b.legacy_behavior_id,
        search_aliases: b.search_aliases ?? b.aliases ?? b.search_terms ?? [],
      });
    }
    return behaviors;
  }
  if (library.category?.behaviors?.length) {
    return library.category.behaviors.map((b) => ({
      id: b.id,
      legacy_behavior_id: b.legacy_behavior_id,
      search_aliases: b.search_aliases ?? b.aliases ?? [],
    }));
  }
  return [];
}

function buildLegacyBehaviorMap(libraries: ContentLibrarySource[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const lib of libraries) {
    for (const b of extractBehaviors(lib)) {
      if (b.legacy_behavior_id) map[b.legacy_behavior_id] = b.id;
    }
  }
  return map;
}

function buildSearchAliases(libraries: ContentLibrarySource[]): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const lib of libraries) {
    for (const b of extractBehaviors(lib)) {
      map[b.id] = b.search_aliases ?? [];
    }
  }
  return map;
}

const CONTENT_LIBRARIES = [
  aggressionLibrary,
  bigFeelingsLibrary,
  defianceLibrary,
  nighttimeSleepLibrary,
  sensoryBodyLibrary,
  foodEatingLibrary,
  lyingRealityLibrary,
  stealingTakingLibrary,
] as ContentLibrarySource[];

const LEGACY_BEHAVIOR_TO_CONTENT = buildLegacyBehaviorMap(CONTENT_LIBRARIES);
const BEHAVIOR_SEARCH_ALIASES = buildSearchAliases(CONTENT_LIBRARIES);

const APPROVED_CARDS: MomentCard[] = CONTENT_LIBRARIES.flatMap(loadCardsFromLibrary);

export const MOMENTS: MomentDefinition[] = [
  { id: "starting_to_escalate", label: "Calm this down." },
  { id: "unsafe_right_now", label: "Stop unsafe behavior." },
  { id: "after_it_happened", label: "Repair afterward" },
];

export const AGE_BANDS: AgeBand[] = ["0-3", "4-7", "8-12", "Teen"];

export function normalizeAgeBand(value: string): AgeBand {
  const normalized = value.replace(/–/g, "-").trim();
  if (normalized.toLowerCase() === "teen") return "Teen";
  if (normalized === "0-3" || normalized === "4-7" || normalized === "8-12") return normalized;
  return "4-7";
}

export function intensityToMomentId(intensity: string): MomentId {
  return normalizeMomentId(intensity);
}

export function toContentBehaviorId(catalogBehaviorId: string): string {
  return (
    CATALOG_BEHAVIOR_TO_CONTENT[catalogBehaviorId] ??
    LEGACY_BEHAVIOR_TO_CONTENT[catalogBehaviorId] ??
    catalogBehaviorId
  );
}

export function toCatalogBehaviorId(contentBehaviorId: string): string {
  return CONTENT_BEHAVIOR_TO_CATALOG[contentBehaviorId] ?? contentBehaviorId;
}

export function toContentCategoryId(catalogCategoryId: string): string {
  return CATALOG_CATEGORY_TO_CONTENT[catalogCategoryId] ?? catalogCategoryId;
}

export function toCatalogCategoryId(contentCategoryId: string): string {
  return CONTENT_CATEGORY_TO_CATALOG[contentCategoryId] ?? contentCategoryId;
}

export function hasApprovedContent(catalogBehaviorId: string): boolean {
  const contentBehaviorId = toContentBehaviorId(catalogBehaviorId);
  return APPROVED_CARDS.some((c) => c.behavior_id === contentBehaviorId);
}

export function getCardsByBehaviorAgeAndMoment(
  catalogBehaviorId: string,
  ageBand: string,
  momentId: MomentId | string
): MomentCard[] {
  const contentBehaviorId = toContentBehaviorId(catalogBehaviorId);
  const band = normalizeAgeBand(ageBand);
  const moment = normalizeMomentId(momentId);
  return APPROVED_CARDS.filter(
    (c) =>
      c.behavior_id === contentBehaviorId &&
      c.age_band === band &&
      c.moment_id === moment
  );
}

export function getVariantCount(
  catalogBehaviorId: string,
  ageBand: string,
  momentId: MomentId | string
): number {
  return getCardsByBehaviorAgeAndMoment(catalogBehaviorId, ageBand, momentId).length;
}

export function getCardById(cardId: string): MomentCard | null {
  return APPROVED_CARDS.find((c) => c.id === cardId) ?? null;
}

export function getDefaultCard(
  catalogBehaviorId: string,
  ageBand: string,
  momentId: MomentId | string
): MomentCard | null {
  const cards = getCardsByBehaviorAgeAndMoment(catalogBehaviorId, ageBand, momentId);
  return cards[0] ?? null;
}

export function getAnotherCard(
  currentCardId: string,
  catalogBehaviorId: string,
  ageBand: string,
  momentId: MomentId | string
): MomentCard | null {
  const cards = getCardsByBehaviorAgeAndMoment(catalogBehaviorId, ageBand, momentId);
  if (cards.length === 0) return null;
  if (cards.length === 1) return cards[0];
  const idx = cards.findIndex((c) => c.id === currentCardId);
  const nextIdx = idx >= 0 ? (idx + 1) % cards.length : 0;
  return cards[nextIdx];
}

export function getSafetyStep(card: MomentCard): string | null {
  const explicit = card.safety_note?.trim() || card.safety_step?.trim();
  if (explicit) return explicit;
  const isHighRisk =
    card.moment_id === "unsafe_right_now" ||
    card.tags.some((t) => t.toLowerCase().includes("immediate safety"));
  if (!isHighRisk) return null;
  const first = card.do_this.split(/(?<=[.!?])\s+/)[0]?.trim();
  return first || null;
}

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "is", "it", "he", "she", "they", "his", "her", "again", "my",
]);

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function scoreCard(card: MomentCard, query: string, tokens: string[]): number {
  const q = query.toLowerCase().trim();
  const aliases = BEHAVIOR_SEARCH_ALIASES[card.behavior_id] ?? [];
  let score = 0;

  for (const term of card.search_terms) {
    const t = term.toLowerCase();
    if (t === q) score += 14;
    else if (t.includes(q) || q.includes(t)) score += 10;
  }
  for (const alias of aliases) {
    const a = alias.toLowerCase();
    if (a === q) score += 12;
    else if (a.includes(q) || q.includes(a)) score += 8;
  }
  for (const tag of card.tags) {
    const t = tag.toLowerCase();
    if (t.includes(q)) score += 3;
  }

  if (card.behavior_name.toLowerCase().includes(q)) score += 8;
  if (card.category_name.toLowerCase().includes(q)) score += 5;

  if (tokens.length === 0) return score;

  for (const token of tokens) {
    if (card.behavior_name.toLowerCase().includes(token)) score += 4;
    if (card.category_name.toLowerCase().includes(token)) score += 2;

    for (const term of card.search_terms) {
      const t = term.toLowerCase();
      if (t === token) score += 5;
      else if (t.includes(token) || token.includes(t)) score += 2;
    }

    for (const alias of aliases) {
      const a = alias.toLowerCase();
      if (a === token) score += 6;
      else if (a.includes(token) || token.includes(a)) score += 3;
    }

    for (const tag of card.tags) {
      if (tag.toLowerCase().includes(token)) score += 1;
    }
  }

  return score;
}

/** Classification/retrieval search — never generates new advice. */
export function searchMoments(query: string): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const tokens = tokenize(trimmed);
  const qLower = trimmed.toLowerCase();

  const scored: SearchResult[] = [];

  for (const card of APPROVED_CARDS) {
    const score = scoreCard(card, qLower, tokens);
    if (score <= 0) continue;
    scored.push({
      card,
      score,
      catalogBehaviorId: toCatalogBehaviorId(card.behavior_id),
      catalogCategoryId: toCatalogCategoryId(card.category_id),
    });
  }

  scored.sort((a, b) => b.score - a.score);

  const byBehavior = new Map<string, SearchResult>();
  for (const result of scored) {
    const key = result.card.behavior_id;
    if (!byBehavior.has(key)) byBehavior.set(key, result);
  }

  return Array.from(byBehavior.values()).slice(0, 12);
}

export const SEARCH_NO_MATCH_MESSAGE =
  "I couldn't find a close match yet. Try choosing the closest category.";
