import type { AgeBand, MomentId } from "@/app/lib/contentLibrary";
import { normalizeAgeBand, intensityToMomentId } from "@/app/lib/contentLibrary";

const STORAGE_KEY = "phrasewell:defaults:v1";

export type AppDefaults = {
  ageBand: AgeBand;
  momentId: MomentId;
};

const FALLBACK: AppDefaults = {
  ageBand: "4-7",
  momentId: "unsafe_right_now",
};

export function getAppDefaults(): AppDefaults {
  if (typeof window === "undefined") return FALLBACK;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return FALLBACK;
    const parsed = JSON.parse(raw) as Partial<AppDefaults>;
    return {
      ageBand: normalizeAgeBand(parsed.ageBand ?? FALLBACK.ageBand),
      momentId: intensityToMomentId(parsed.momentId ?? FALLBACK.momentId),
    };
  } catch {
    return FALLBACK;
  }
}

export function setAppDefaults(partial: Partial<AppDefaults>): AppDefaults {
  const next: AppDefaults = {
    ...getAppDefaults(),
    ...partial,
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("storage"));
  }
  return next;
}

export function buildBehaviorHref(
  behaviorId: string,
  categoryId: string,
  opts?: { momentId?: MomentId; ageBand?: AgeBand; cardId?: string }
): string {
  const params = new URLSearchParams();
  params.set("categoryId", categoryId);
  if (opts?.momentId) params.set("moment", opts.momentId);
  if (opts?.ageBand) params.set("ageBand", opts.ageBand);
  if (opts?.cardId) params.set("cardId", opts.cardId);
  return `/app/behavior/${behaviorId}?${params.toString()}`;
}

export function buildCategoryHref(categoryId: string, opts?: { momentId?: MomentId; ageBand?: AgeBand }): string {
  const params = new URLSearchParams();
  if (opts?.momentId) params.set("moment", opts.momentId);
  if (opts?.ageBand) params.set("ageBand", opts.ageBand);
  const qs = params.toString();
  return qs ? `/app/category/${categoryId}?${qs}` : `/app/category/${categoryId}`;
}
