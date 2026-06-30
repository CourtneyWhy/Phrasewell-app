"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AgeBand } from "@/app/lib/contentLibrary";
import { normalizeAgeBand } from "@/app/lib/contentLibrary";
import { setAppDefaults } from "@/app/lib/app-defaults";
import {
  REQUIRED_ONBOARDING_VERSION,
  type ProfilePayload,
  type UserChild,
  type UserProfile,
} from "@/app/lib/profile/constants";

type ProfileContextValue = {
  loading: boolean;
  profile: UserProfile | null;
  children: UserChild[];
  activeChildren: UserChild[];
  selectedChildId: string | null;
  setSelectedChildId: (id: string | null) => void;
  selectedChild: UserChild | null;
  needsOnboarding: boolean;
  refresh: () => Promise<void>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
  addChild: (input: { name: string; age_band: AgeBand; relationship: string }) => Promise<UserChild | null>;
  updateChild: (id: string, patch: Partial<Pick<UserChild, "name" | "age_band" | "relationship">>) => Promise<void>;
  removeChild: (id: string) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children: reactChildren }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [childList, setChildList] = useState<UserChild[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  const activeChildren = useMemo(
    () => childList.filter((c) => !c.removed_at),
    [childList],
  );

  const selectedChild = useMemo(
    () => activeChildren.find((c) => c.id === selectedChildId) ?? activeChildren[0] ?? null,
    [activeChildren, selectedChildId],
  );

  const needsOnboarding = useMemo(() => {
    if (!profile) return false;
    return (profile.onboarding_version ?? 0) < REQUIRED_ONBOARDING_VERSION;
  }, [profile]);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.status === 401) {
        setProfile(null);
        setChildList([]);
        return;
      }
      if (!res.ok) return;
      const data = (await res.json()) as ProfilePayload;
      setProfile(data.profile);
      setChildList(data.children);
      const defaultId =
        data.profile.default_child_id ??
        data.children.find((c) => !c.removed_at)?.id ??
        null;
      setSelectedChildId(defaultId);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (selectedChild?.age_band) {
      setAppDefaults({ ageBand: normalizeAgeBand(selectedChild.age_band) });
    }
  }, [selectedChild?.age_band, selectedChild?.id]);

  const updateProfile = useCallback(async (patch: Partial<UserProfile>) => {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error("Could not save profile");
    const data = (await res.json()) as { profile: UserProfile };
    setProfile(data.profile);
  }, []);

  const addChild = useCallback(async (input: { name: string; age_band: AgeBand; relationship: string }) => {
    const res = await fetch("/api/profile/children", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Could not add child");
    const data = (await res.json()) as { child: UserChild };
    setChildList((prev) => [...prev, data.child]);
    setSelectedChildId(data.child.id);
    return data.child;
  }, []);

  const updateChild = useCallback(
    async (id: string, patch: Partial<Pick<UserChild, "name" | "age_band" | "relationship">>) => {
      const res = await fetch(`/api/profile/children/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error("Could not update child");
      const data = (await res.json()) as { child: UserChild };
      setChildList((prev) => prev.map((c) => (c.id === id ? data.child : c)));
    },
    [],
  );

  const removeChild = useCallback(async (id: string) => {
    const res = await fetch(`/api/profile/children/${id}/remove`, { method: "POST" });
    if (!res.ok) throw new Error("Could not remove child");
    setChildList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, removed_at: new Date().toISOString() } : c)),
    );
    if (selectedChildId === id) {
      const remaining = activeChildren.filter((c) => c.id !== id);
      setSelectedChildId(remaining[0]?.id ?? null);
    }
    await refresh();
  }, [activeChildren, refresh, selectedChildId]);

  const value = useMemo<ProfileContextValue>(
    () => ({
      loading,
      profile,
      children: childList,
      activeChildren,
      selectedChildId,
      setSelectedChildId,
      selectedChild,
      needsOnboarding,
      refresh,
      updateProfile,
      addChild,
      updateChild,
      removeChild,
    }),
    [
      loading,
      profile,
      childList,
      activeChildren,
      selectedChildId,
      selectedChild,
      needsOnboarding,
      refresh,
      updateProfile,
      addChild,
      updateChild,
      removeChild,
    ],
  );

  return <ProfileContext.Provider value={value}>{reactChildren}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
