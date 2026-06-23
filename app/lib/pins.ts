/**
 * Pinning: localStorage only. Categories and behaviors (subcategories).
 * Key: phrasewell:pins:v1
 * Format: array of { type: "category" | "behavior", id: string, categoryId?: string }
 * - category: id = categoryId (e.g. "food_eating"); categoryId omitted
 * - behavior: id = behaviorId, categoryId = category id (for link building)
 */

const STORAGE_KEY = "phrasewell:pins:v1";

export type PinnedItem =
  | { type: "category"; id: string }
  | { type: "behavior"; id: string; categoryId: string };

function read(): PinnedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is PinnedItem => {
      if (!x || typeof x !== "object" || typeof (x as { type?: string }).type !== "string" || typeof (x as { id?: string }).id !== "string") return false;
      if ((x as { type: string }).type === "category") return true;
      if ((x as { type: string; categoryId?: string }).type === "behavior" && typeof (x as { categoryId?: string }).categoryId === "string") return true;
      return false;
    });
  } catch {
    return [];
  }
}

function write(items: PinnedItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function getPinned(): PinnedItem[] {
  return read();
}

export function isPinnedCategory(categoryId: string): boolean {
  return read().some((x) => x.type === "category" && x.id === categoryId);
}

export function isPinnedBehavior(behaviorId: string, categoryId: string): boolean {
  return read().some((x) => x.type === "behavior" && x.id === behaviorId && x.categoryId === categoryId);
}

export function togglePinnedCategory(categoryId: string): boolean {
  const items = read();
  const i = items.findIndex((x) => x.type === "category" && x.id === categoryId);
  if (i >= 0) {
    items.splice(i, 1);
    write(items);
    return false;
  }
  items.push({ type: "category", id: categoryId });
  write(items);
  return true;
}

export function togglePinnedBehavior(behaviorId: string, categoryId: string): boolean {
  const items = read();
  const i = items.findIndex((x) => x.type === "behavior" && x.id === behaviorId && x.categoryId === categoryId);
  if (i >= 0) {
    items.splice(i, 1);
    write(items);
    return false;
  }
  items.push({ type: "behavior", id: behaviorId, categoryId });
  write(items);
  return true;
}
