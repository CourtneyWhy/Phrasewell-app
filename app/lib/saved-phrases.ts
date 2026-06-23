const STORAGE_KEY = "phrasewell_saved";

export type SavedEntry = {
  id: string;
  cardId?: string;
  categoryId: string;
  behaviorId: string;
  categoryLabel: string;
  behaviorLabel: string;
  phrasePreview: string;
  phrase: string;
  do_this: string;
  helpful_note: string;
  ageBand: string;
  momentId?: string;
  /** @deprecated use momentId */
  intensity: string;
  savedAt: number;
};

export function getSavedEntries(): SavedEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isValidEntry) : [];
  } catch {
    return [];
  }
}

function isValidEntry(e: unknown): e is SavedEntry {
  return (
    typeof e === "object" &&
    e !== null &&
    "id" in e &&
    "behaviorId" in e &&
    "phrase" in e &&
    "savedAt" in e
  );
}

export function saveEntry(entry: Omit<SavedEntry, "id" | "savedAt">): SavedEntry {
  const full: SavedEntry = {
    ...entry,
    id: `saved-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    savedAt: Date.now(),
  };
  const list = getSavedEntries();
  list.unshift(full);
  setSavedEntries(list);
  return full;
}

export function removeSavedEntry(id: string): void {
  const list = getSavedEntries().filter((e) => e.id !== id);
  setSavedEntries(list);
}

export function getSavedEntryById(id: string): SavedEntry | null {
  return getSavedEntries().find((e) => e.id === id) ?? null;
}

export function findSavedByPhrase(behaviorId: string, phrase: string): SavedEntry | null {
  const list = getSavedEntries();
  return list.find((e) => e.behaviorId === behaviorId && e.phrase === phrase) ?? null;
}

export function findSavedByCardId(behaviorId: string, cardId: string): SavedEntry | null {
  const list = getSavedEntries();
  return list.find((e) => e.behaviorId === behaviorId && e.cardId === cardId) ?? null;
}

function setSavedEntries(list: SavedEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}
