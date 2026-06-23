export type DemoPhrase = {
  moment: string;
  sayThis: string;
  doThis: string;
  helpfulNote: string;
};

/** Fixed marketing examples — default index 0 is shown first. */
export const LANDING_DEMO_PHRASES: DemoPhrase[] = [
  {
    moment: "Hitting · Age 6",
    sayThis: "I won't let you hit. I'm going to help keep everyone safe.",
    doThis:
      "Move close enough to block, but not so close that anyone gets hurt. Use fewer words.",
    helpfulNote:
      "Safety comes first. Teaching comes later, when the child can hear you.",
  },
  {
    moment: "Big meltdown · Age 3",
    sayThis:
      "You're really upset. I'm here. I won't let you hurt yourself or anyone else.",
    doThis:
      "Get low, keep your voice quiet, and use as few words as possible.",
    helpfulNote:
      "At this age, the goal is safety and co-regulation first. Teaching can come later.",
  },
  {
    moment: "Refusing to transition · Age 8",
    sayThis:
      "You don't have to like it. It's still time to go. I'll help you take the first step.",
    doThis: "Offer one simple next action, not a debate.",
    helpfulNote:
      "A calm limit gives the child something solid to push against without turning it into a power struggle.",
  },
  {
    moment: "Escalating argument · Teen",
    sayThis:
      "I'm not going to argue with you while we're both heated. I'm going to pause, and we'll come back to this when we can speak respectfully.",
    doThis:
      "Step back, lower your voice, and do not chase the last word.",
    helpfulNote:
      "With teens, calm authority often means ending the power struggle without withdrawing connection.",
  },
];
