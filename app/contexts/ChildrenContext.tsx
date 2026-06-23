"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type Child = {
  id: string;
  name: string;
};

const defaultChildren: Child[] = [
  { id: "1", name: "My Child" },
];

type ChildrenContextValue = {
  children: Child[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  addChild: (name: string) => Child;
};

const ChildrenContext = createContext<ChildrenContextValue | null>(null);

export function ChildrenProvider({ children: reactChildren }: { children: React.ReactNode }) {
  const [children, setChildren] = useState<Child[]>(defaultChildren);
  const [selectedId, setSelectedId] = useState<string | null>(defaultChildren[0]?.id ?? null);

  const addChild = useCallback((name: string) => {
    const id = `child-${Date.now()}`;
    const child: Child = { id, name };
    setChildren((prev) => [...prev, child]);
    setSelectedId(id);
    return child;
  }, []);

  const value = useMemo<ChildrenContextValue>(
    () => ({ children, selectedId, setSelectedId, addChild }),
    [children, selectedId, addChild]
  );

  return (
    <ChildrenContext.Provider value={value}>
      {reactChildren}
    </ChildrenContext.Provider>
  );
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
