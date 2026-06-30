import type { AgeBand } from "@/app/lib/contentLibrary";
import { CATEGORIES } from "@/app/lib/behavior-catalog";

/** Bump to 2 at LTD launch to re-show onboarding for paid users */
export const REQUIRED_ONBOARDING_VERSION = 1;

export const PARENT_TYPES = [
  "Foster parent",
  "Adoptive parent",
  "Kinship caregiver",
  "Biological parent",
  "Stepparent",
  "Grandparent caregiver",
  "Professional supporting parents",
  "Other",
] as const;

export type ParentType = (typeof PARENT_TYPES)[number];

export const CHILD_RELATIONSHIPS = [
  "Biological child",
  "Foster child",
  "Adoptive child",
  "Kinship / relative child",
  "Stepchild",
  "Other child in my care",
] as const;

export type ChildRelationship = (typeof CHILD_RELATIONSHIPS)[number];

export const KID_COUNT_OPTIONS = ["1", "2", "3", "4+"] as const;

export const AGE_BAND_OPTIONS: { id: AgeBand; label: string }[] = [
  { id: "0-3", label: "0–3" },
  { id: "4-7", label: "4–7" },
  { id: "8-12", label: "8–12" },
  { id: "Teen", label: "Teen" },
];

export const CHALLENGE_OPTIONS = CATEGORIES.map((c) => ({
  id: c.id,
  label: c.title,
}));

export type UserProfile = {
  id: string;
  email: string;
  first_name: string | null;
  parent_types: string[];
  challenge_tags: string[];
  onboarding_version: number;
  onboarding_completed_at: string | null;
  default_child_id: string | null;
};

export type UserChild = {
  id: string;
  user_id: string;
  name: string;
  age_band: AgeBand;
  relationship: string;
  sort_order: number;
  removed_at: string | null;
};

export type ProfilePayload = {
  profile: UserProfile;
  children: UserChild[];
};
