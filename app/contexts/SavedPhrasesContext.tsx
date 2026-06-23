"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getSavedEntries,
  saveEntry,
  removeSavedEntry,
  getSavedEntryById,
  type SavedEntry,
} from "@/app/lib/saved-phrases";

type SavedPhrasesContextValue = {
  savedEntries: SavedEntry[];
  addSaved: (entry: Omit<SavedEntry, "id" | "savedAt">) => SavedEntry;
  removeSaved: (id: string) => void;
  getById: (id: string) => SavedEntry | null;
  findByPhrase: (behaviorId: string, phrase: string) => SavedEntry | null;
  findByCardId: (behaviorId: string, cardId: string) => SavedEntry | null;
  refresh: () => void;
};

const SavedPhrasesContext = createContext<SavedPhrasesContextValue | null>(null);

export function SavedPhrasesProvider({ children }: { children: React.ReactNode }) {
  const [savedEntries, setSavedEntries] = useState<SavedEntry[]>([]);

  const refresh = useCallback(() => {
    setSavedEntries(getSavedEntries());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addSaved = useCallback(
    (entry: Omit<SavedEntry, "id" | "savedAt">) => {
      const saved = saveEntry(entry);
      setSavedEntries(getSavedEntries());
      return saved;
    },
    []
  );

  const removeSaved = useCallback((id: string) => {
    removeSavedEntry(id);
    setSavedEntries(getSavedEntries());
  }, []);

  const getById = useCallback((id: string) => getSavedEntryById(id), []);
  const findByPhrase = useCallback(
    (behaviorId: string, phrase: string) => {
      return savedEntries.find((e) => e.behaviorId === behaviorId && e.phrase === phrase) ?? null;
    },
    [savedEntries]
  );
  const findByCardId = useCallback(
    (behaviorId: string, cardId: string) => {
      return (
        savedEntries.find((e) => e.behaviorId === behaviorId && e.cardId === cardId) ?? null
      );
    },
    [savedEntries]
  );

  const value: SavedPhrasesContextValue = {
    savedEntries,
    addSaved,
    removeSaved,
    getById,
    findByPhrase,
    findByCardId,
    refresh,
  };

  return (
    <SavedPhrasesContext.Provider value={value}>
      {children}
    </SavedPhrasesContext.Provider>
  );
}

export function useSavedPhrases() {
  const ctx = useContext(SavedPhrasesContext);
  if (!ctx) {
    return {
      savedEntries: [] as SavedEntry[],
      addSaved: (_: Omit<SavedEntry, "id" | "savedAt">) => ({} as SavedEntry),
      removeSaved: (_: string) => {},
      getById: (_: string) => null as SavedEntry | null,
      findByPhrase: (_: string, __: string) => null as SavedEntry | null,
      findByCardId: (_: string, __: string) => null as SavedEntry | null,
      refresh: () => {},
    };
  }
  return ctx;
}
