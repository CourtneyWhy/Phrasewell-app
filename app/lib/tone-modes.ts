export type ToneMode = "calm_reset" | "firm_boundary" | "immediate_safety";

export const TONE_MODES: { id: ToneMode; label: string; safety?: boolean }[] = [
  { id: "calm_reset", label: "Calm reset" },
  { id: "firm_boundary", label: "Firm boundary" },
  { id: "immediate_safety", label: "Immediate safety", safety: true },
];

export function getToneLabel(id: ToneMode): string {
  return TONE_MODES.find((t) => t.id === id)?.label ?? "Calm reset";
}
