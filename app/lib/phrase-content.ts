/**
 * Dynamic phrase engine: templated system with optional hand-authored overrides.
 * Hand-authored: Aggression & Safety, Big Feelings, Defiance & Control.
 * All other categories use structured templates (override-ready).
 */

import { BEHAVIORS, getBehaviorById, getCategoryById } from "./behavior-catalog";

export type AgeBand = "0-3" | "4-7" | "8-12" | "teen";
export type Intensity = "early_escalation" | "active_meltdown" | "post_incident_repair";

export type PhraseResult = {
  phrase: string;
  do_this: string;
  helpful_note: string;
};

type AuthoredVariation = {
  phrase: string;
  phrase_0_3?: string;
  do_this: string;
  helpful_note: string;
};

function pickVariationIndex(seed: string, count: number, lastIndex?: number): number {
  const n = Math.abs(Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0));
  let idx = n % count;
  if (lastIndex !== undefined && count > 1 && idx === lastIndex) {
    idx = (idx + 1) % count;
  }
  return idx;
}

function sentences(s: string): string[] {
  return s.split(/(?<=[.!?])\s+/).filter(Boolean);
}

function ageAdaptPhrase(v: AuthoredVariation, ageBand: AgeBand): string {
  const full = v.phrase;
  if (ageBand === "0-3" && v.phrase_0_3) return v.phrase_0_3;
  const s = sentences(full);
  if (ageBand === "0-3") return s[0] || full;
  if (ageBand === "4-7") return s.slice(0, 2).join(" ") || full;
  return full;
}

// ----- Hand-authored content: Aggression & Safety, Big Feelings, Defiance -----
// Structure: [intensity] -> [variation0, variation1]. Each variation can have phrase_0_3 for toddlers.
const AUTHORED: Record<string, Partial<Record<Intensity, AuthoredVariation[]>>> = {
  hitting_kicking_angry: {
    early_escalation: [
      {
        phrase: "I see you're really upset. I'm not going to let you hit or kick. We can take a break until your body is calmer.",
        phrase_0_3: "No hitting. I'm right here.",
        do_this: "Move to their level, block gently if needed, and repeat one short limit.",
        helpful_note: "Staying calm and close helps them borrow your regulation.",
      },
      {
        phrase: "I hear how angry you feel. Hitting and kicking aren't okay. Let's find a way to get that anger out safely.",
        do_this: "Offer one safe option: squeeze a pillow, stomp feet, or sit with you.",
        helpful_note: "Naming the feeling without agreeing to the behavior keeps the boundary clear.",
      },
    ],
    active_meltdown: [
      {
        phrase: "I won't let you hit or kick. I'm staying right here. When you're ready, we can talk.",
        phrase_0_3: "No hitting. I'm here.",
        do_this: "Keep yourself and others safe first; use a calm, firm voice and minimal words.",
        helpful_note: "Safety before teaching; connection can come once they're regulated.",
      },
      {
        phrase: "I'm stopping the hitting. I know this is hard. I'm not going anywhere.",
        do_this: "Put your body between them and anyone else; repeat one phrase only.",
        helpful_note: "One clear limit, repeated calmly, is more effective than many words.",
      },
    ],
    post_incident_repair: [
      {
        phrase: "That was really hard. You were so upset. We're okay now. Next time we can try taking a break earlier.",
        do_this: "Keep the conversation short; one brief repair, then move on.",
        helpful_note: "Repair when everyone is calm; avoid lectures or long discussions.",
      },
      {
        phrase: "I'm glad we're both calmer. I still don't allow hitting, and I still love you. We can try again.",
        do_this: "Reconnect with a quiet activity or touch if they accept it.",
        helpful_note: "Separating the behavior from the person helps them feel safe again.",
      },
    ],
  },
  throwing_objects: {
    early_escalation: [
      {
        phrase: "I see you're frustrated. Throwing things isn't safe. Put it down, and we can figure out what you need.",
        phrase_0_3: "No throwing. Put it down.",
        do_this: "Remove breakables from reach and state the limit once.",
        helpful_note: "Stopping the behavior first keeps everyone safe; then address the feeling.",
      },
      {
        phrase: "Things stay in your hands or on the table. I'm not going to let you throw. Tell me what's going on.",
        do_this: "Get close and speak in a calm, low voice; offer one alternative.",
        helpful_note: "A clear, simple rule is easier to follow when they're escalating.",
      },
    ],
    active_meltdown: [
      {
        phrase: "I'm not letting you throw. I'm moving these things so we're all safe. I'm here.",
        do_this: "Clear the area of throwable objects; stay present without crowding.",
        helpful_note: "Safety first; save the conversation for when they're calmer.",
      },
      {
        phrase: "Throwing stops now. I know you're upset. We can talk when you're ready.",
        do_this: "Block or remove objects; use one short phrase and wait.",
        helpful_note: "Fewer words and a steady presence often de-escalate faster.",
      },
    ],
    post_incident_repair: [
      {
        phrase: "That was scary. Throwing things isn't okay. We're safe now. Next time we can try saying 'I'm mad' instead.",
        do_this: "Briefly name what happened and one simple alternative for next time.",
        helpful_note: "One small replacement behavior is easier to remember than a long list.",
      },
    ],
  },
  biting_overwhelmed: {
    early_escalation: [
      {
        phrase: "I won't let you bite. I'm going to move back a little so we're both safe. When you're calmer, we can try again.",
        phrase_0_3: "No biting. I'm moving back.",
        do_this: "Create space without leaving the room; stay calm and wait.",
        helpful_note: "Biting often comes from overwhelm; space and calm help more than words.",
      },
    ],
    active_meltdown: [
      {
        phrase: "I'm stopping the biting. I'm right here. We're safe.",
        phrase_0_3: "No biting.",
        do_this: "Block the bite gently, create safe distance, and stay present.",
        helpful_note: "Safety first; avoid shaming; they need to feel safe to regulate.",
      },
    ],
    post_incident_repair: [
      {
        phrase: "Biting hurts. I know you were overwhelmed. We're okay. Let's try a calm activity.",
        do_this: "Check on anyone who was bitten; then reconnect with the child when ready.",
        helpful_note: "Repair with the person who was bitten first, then with the child.",
      },
    ],
  },
  sobbing_meltdown: {
    early_escalation: [
      {
        phrase: "I can see this is really hard. I'm right here. You don't have to use words yet.",
        phrase_0_3: "I'm here. You're okay.",
        do_this: "Stay close without crowding; offer a calm presence and one simple choice.",
        helpful_note: "Presence often helps more than words when feelings are huge.",
      },
      {
        phrase: "Something's really upsetting you. I'm staying with you. When you're ready, I'm listening.",
        do_this: "Lower your voice and slow your breathing; sit nearby without demanding talk.",
        helpful_note: "Co-regulation starts with your calm body and tone.",
      },
    ],
    active_meltdown: [
      {
        phrase: "I'm not going anywhere. You're safe. We can sit here until this passes.",
        phrase_0_3: "I'm here. Safe.",
        do_this: "Stay present; avoid reasoning or questions until the peak passes.",
        helpful_note: "During peak meltdown, fewer words and steady presence work best.",
      },
      {
        phrase: "I hear you. This is really big. I'm right here with you.",
        do_this: "Match their level if safe; breathe slowly; wait for the wave to pass.",
        helpful_note: "Validating the feeling doesn't mean agreeing with every behavior.",
      },
    ],
    post_incident_repair: [
      {
        phrase: "That was a lot. I'm glad we're both here. You're okay. We can talk when you want.",
        do_this: "Offer water or a quiet activity; keep the tone warm and low-pressure.",
        helpful_note: "Repair doesn't require a long talk; connection is enough.",
      },
    ],
  },
  saying_i_hate_you: {
    early_escalation: [
      {
        phrase: "I hear that you're really mad. I'm not going anywhere. I still love you.",
        do_this: "Don't take the bait to argue; state your presence and the limit once.",
        helpful_note: "They're testing whether you'll leave; steady presence is the answer.",
      },
      {
        phrase: "You're allowed to be angry. I'm still here. We can talk when you're calmer.",
        do_this: "Acknowledge the feeling, hold the boundary, and leave space.",
        helpful_note: "Separating 'I hate you' from 'I'm furious' helps you stay regulated.",
      },
    ],
    active_meltdown: [
      {
        phrase: "I'm not leaving. You're safe. We can sit until this feels smaller.",
        do_this: "Stay present; avoid defending yourself or lecturing.",
        helpful_note: "In the moment, your presence matters more than your words.",
      },
    ],
    post_incident_repair: [
      {
        phrase: "I know you were really upset. Those words don't change how I feel about you. We're okay.",
        do_this: "One brief reassurance; then move on without rehashing.",
        helpful_note: "Repair is about connection, not convincing them they were wrong.",
      },
    ],
  },
  not_my_real_mom_dad: {
    early_escalation: [
      {
        phrase: "I hear that you're angry. I'm still your parent, and I'm not going anywhere. We can talk when you're ready.",
        do_this: "State your role and presence once; don't debate or over-explain.",
        helpful_note: "This often comes from big feelings, not a rejection of you.",
      },
    ],
    active_meltdown: [
      {
        phrase: "I'm right here. You're safe. We can talk when this passes.",
        do_this: "Stay present; avoid arguing about who is 'real' or not.",
        helpful_note: "In the moment, reassurance matters more than correcting the words.",
      },
    ],
    post_incident_repair: [
      {
        phrase: "I know that was hard. I'm still here. I love you. We're going to be okay.",
        do_this: "One clear reassurance; then offer a calm next step.",
        helpful_note: "Repair focuses on connection, not rehashing the comment.",
      },
    ],
  },
  says_no_everything: {
    early_escalation: [
      {
        phrase: "I hear 'no.' I'm not arguing. Here's what's happening next: we're doing X. You can join when you're ready.",
        do_this: "State the next step once; give a short wait, then move calmly.",
        helpful_note: "One clear next step reduces power struggles.",
      },
      {
        phrase: "You don't have to like it. This is what we're doing. I'm here.",
        do_this: "Offer one small choice if possible; otherwise state the boundary and follow through.",
        helpful_note: "Fewer choices in the moment can reduce overwhelm and defiance.",
      },
    ],
    active_meltdown: [
      {
        phrase: "I'm not changing the plan. We can sit here until you're ready to join.",
        do_this: "Stay calm and wait; don't add more words or new options.",
        helpful_note: "Silence and consistency often work better than more negotiation.",
      },
    ],
    post_incident_repair: [
      {
        phrase: "That was tough. We got through it. Next time we can try one small step at a time.",
        do_this: "Acknowledge the difficulty; offer one simple strategy for next time.",
        helpful_note: "Repair doesn't require them to agree; it requires you to reconnect.",
      },
    ],
  },
  arguing_every_direction: {
    early_escalation: [
      {
        phrase: "I've said what I need to say. I'm not going to argue. We can talk more when we're both calmer.",
        do_this: "State your limit once; then disengage from the back-and-forth.",
        helpful_note: "Arguing often needs two people; stepping out ends the loop.",
      },
      {
        phrase: "I hear you. My answer is still X. I'm happy to listen to your thoughts later.",
        do_this: "Acknowledge once, restate the boundary, and defer long discussion.",
        helpful_note: "Delaying the debate keeps the moment from escalating.",
      },
    ],
    active_meltdown: [
      {
        phrase: "I'm done arguing right now. I'm here when you're ready to talk without yelling.",
        do_this: "Stop responding to each point; stay present but quiet.",
        helpful_note: "Stopping the cycle is more important than winning the point.",
      },
    ],
    post_incident_repair: [
      {
        phrase: "We both got worked up. I'm glad we're calmer. We can try again.",
        do_this: "Brief repair; offer one way to handle the next disagreement.",
        helpful_note: "Modeling repair matters more than rehashing who was right.",
      },
    ],
  },
  power_struggle_small: {
    early_escalation: [
      {
        phrase: "I'm not going to fight about this. Here's what's happening. You can be upset and still do it.",
        do_this: "State the one non-negotiable; allow feelings without changing the plan.",
        helpful_note: "Allowing the feeling while holding the limit reduces the struggle.",
      },
      {
        phrase: "You get to be frustrated. This is still what we're doing. I'm right here.",
        do_this: "Name the feeling, hold the boundary, and offer presence.",
        helpful_note: "Small power struggles often ease when you don't need to 'win.'",
      },
    ],
    post_incident_repair: [
      {
        phrase: "That was a lot over something small. We're okay. Next time we can try one step at a time.",
        do_this: "Keep it brief; one simple idea for next time.",
        helpful_note: "Repair doesn't require an apology; it requires reconnection.",
      },
    ],
  },
};

function getAuthored(
  behaviorId: string,
  intensity: Intensity,
  ageBand: AgeBand,
  variantSeed: string
): PhraseResult | null {
  const byIntensity = AUTHORED[behaviorId]?.[intensity];
  if (!byIntensity || byIntensity.length === 0) return null;
  const idx = pickVariationIndex(variantSeed, byIntensity.length);
  const v = byIntensity[idx];
  const phrase = ageAdaptPhrase(v, ageBand);
  return { phrase, do_this: v.do_this, helpful_note: v.helpful_note };
}

// ----- Generic template: age- and intensity-aware, no directional language -----
function templatePhrase(
  behaviorTitle: string,
  categoryId: string,
  ageBand: AgeBand,
  intensity: Intensity,
  variantSeed: string
): PhraseResult {
  const short = behaviorTitle.toLowerCase();
  const vars = [
    {
      phrase:
        ageBand === "0-3"
          ? "I'm here. We're safe."
          : ageBand === "4-7"
            ? "I see this is hard. I'm right here. We're going to be okay."
            : ageBand === "8-12"
              ? "I hear you. This is tough. I'm not going anywhere, and we can figure it out."
              : "I get that this is really hard. I'm here. We can talk when you're ready.",
      do_this: "Stay calm and present; use fewer words and one clear limit.",
      helpful_note: "Staying regulated yourself helps them settle.",
    },
    {
      phrase:
        ageBand === "0-3"
          ? "No. I'm here."
          : ageBand === "4-7"
            ? "I won't let that happen. I'm staying with you. We're safe."
            : ageBand === "8-12"
              ? "I'm not changing the limit. I know you're upset. I'm here when you're ready to talk."
              : "I'm holding this boundary. You're allowed to be upset. I'm still here.",
      do_this: "Repeat one short limit; wait before adding more.",
      helpful_note: "One clear message is easier to hear when emotions are high.",
    },
  ];
  const idx = pickVariationIndex(variantSeed, vars.length);
  const v = vars[idx];
  return { phrase: v.phrase, do_this: v.do_this, helpful_note: v.helpful_note };
}

export function generatePhrase(
  behaviorId: string,
  categoryId: string,
  behaviorTitle: string,
  ageBand: AgeBand,
  intensity: Intensity,
  variantSeed: string
): PhraseResult {
  const authored = getAuthored(behaviorId, intensity, ageBand, variantSeed);
  if (authored) return authored;
  return templatePhrase(behaviorTitle, categoryId, ageBand, intensity, variantSeed);
}
