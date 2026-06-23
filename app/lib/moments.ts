import type { MomentId } from "@/app/lib/contentLibrary";

/** User-facing header for moment context selection. */
export const MOMENT_CONTEXT_HEADER = "What do you need right now?";

/** UI labels — IDs unchanged for content library mapping. */
export const MOMENT_UI_LABELS: Record<MomentId, string> = {
  starting_to_escalate: "Calm this down.",
  unsafe_right_now: "Stop unsafe behavior.",
  after_it_happened: "Repair afterward",
};

export type MomentOption = {
  id: MomentId;
  label: string;
  safety?: boolean;
};

export const MOMENT_OPTIONS: MomentOption[] = [
  { id: "starting_to_escalate", label: MOMENT_UI_LABELS.starting_to_escalate },
  { id: "unsafe_right_now", label: MOMENT_UI_LABELS.unsafe_right_now, safety: true },
  { id: "after_it_happened", label: MOMENT_UI_LABELS.after_it_happened },
];

export const SEARCH_PLACEHOLDER =
  'Search what is happening, like "hitting," "refusing bedtime," or "hiding food"';

export function getMomentLabel(id: MomentId | string): string {
  const map: Record<string, string> = {
    ...MOMENT_UI_LABELS,
    early_escalation: MOMENT_UI_LABELS.starting_to_escalate,
    active_meltdown: MOMENT_UI_LABELS.unsafe_right_now,
    post_incident_repair: MOMENT_UI_LABELS.after_it_happened,
  };
  return map[id] ?? id;
}
