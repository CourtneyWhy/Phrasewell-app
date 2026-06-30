"use client";

import { createContext, useContext } from "react";
import { useProfile } from "@/app/contexts/ProfileContext";

export type Child = {
  id: string;
  name: string;
};

type ChildrenContextValue = {
  children: Child[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  addChild: (name: string) => Child;
};

const ChildrenContext = createContext<ChildrenContextValue | null>(null);

/** Bridges ProfileContext children for legacy ChildCarousel / SelectedChildName */
export function ChildrenProvider({ children: reactChildren }: { children: React.ReactNode }) {
  const profile = useProfile();
  const list: Child[] = profile.activeChildren.map((c) => ({ id: c.id, name: c.name }));

  const value: ChildrenContextValue = {
    children: list.length ? list : [{ id: "placeholder", name: "Add a child in Profile" }],
    selectedId: profile.selectedChildId,
    setSelectedId: profile.setSelectedChildId,
    addChild: (name) => {
      void profile.addChild({ name, age_band: "4-7", relationship: "Biological child" });
      return { id: "pending", name };
    },
  };

  return <ChildrenContext.Provider value={value}>{reactChildren}</ChildrenContext.Provider>;
}

const fallbackValue: ChildrenContextValue = {
  children: [{ id: "1", name: "My Child" }],
  selectedId: "1",
  setSelectedId: () => {},
  addChild: () => ({ id: "1", name: "My Child" }),
};

export function useChildren() {
  const ctx = useContext(ChildrenContext);
  return ctx ?? fallbackValue;
}
