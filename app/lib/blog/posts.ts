import { BLOG_TITLES } from "@/app/lib/growth/templates";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  sayThis: string;
  doThis: string;
  helpfulNote: string;
  intro: string;
};

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const POST_META: Record<
  string,
  Pick<BlogPost, "category" | "description" | "sayThis" | "doThis" | "helpfulNote" | "intro">
> = {
  "what-to-say-when-your-foster-child-says-youre-not-my-real-mom": {
    category: "Big feelings",
    description:
      "When a child pushes away with \"you're not my real mom,\" stay connected without arguing about labels.",
    intro:
      "This line often comes from grief, loyalty binds, or a big feeling — not because you failed. The goal is to stay steady, honor their story, and keep the relationship safe.",
    sayThis:
      "I hear you. You miss your mom. I'm still here with you, and we can get through this feeling together.",
    doThis: "Stay close at their pace. Lower your voice. Don't debate who is \"real.\"",
    helpfulNote:
      "Arguing about titles usually escalates the moment. Connection first, labels later.",
  },
  "what-to-say-when-a-child-hits-kicks-or-throws-things": {
    category: "Aggression & safety",
    description:
      "Short, calm words when hitting, kicking, or throwing starts — safety first, lecture later.",
    intro:
      "When bodies get unsafe, parents need fewer words, not more. Start with a clear stop, protect everyone, then repair when nervous systems settle.",
    sayThis: "I won't let anyone get hurt. Hands stay safe. I'm moving us to a safer spot.",
    doThis: "Block or move objects. Create space. Breathe. Wait for the surge to pass.",
    helpfulNote:
      "Consequences land better after everyone is regulated. Safety is the first job.",
  },
  "why-foster-children-hoard-food-and-what-to-say": {
    category: "Food & eating",
    description:
      "Food hoarding is often about scarcity fear, not defiance. Here's language that builds trust.",
    intro:
      "Hidden snacks and stuffed pockets can feel personal. Often it's a nervous system still learning that food will come again.",
    sayThis:
      "Your body was worried about food. We have a plan now. Let's put this somewhere safe together.",
    doThis: "Stay calm. Remove unsafe food quietly. Offer a predictable snack rhythm later.",
    helpfulNote: "Shame makes hoarding worse. Predictability and dignity help more than lectures.",
  },
  "what-to-do-when-your-adopted-child-lies": {
    category: "Lying",
    description:
      "When lying shows up, focus on safety and truth-telling skills — not a character verdict.",
    intro:
      "Lying after trauma or instability is often about fear of consequences, not manipulation. Keep the moment small and the relationship intact.",
    sayThis: "I'm not mad. I need the true story so we can fix this together. Start with one true part.",
    doThis: "Pause lectures. Ask one simple question. Name what happens next without threats.",
    helpfulNote: "Very young children need help naming reality, not a moral speech about honesty.",
  },
  "what-to-say-when-a-child-steals-food": {
    category: "Food & eating",
    description:
      "Calm scripts when a child takes food without asking — common in homes with food insecurity history.",
    intro:
      "Taking food can trigger shame for parents and panic for kids. Lead with the worry underneath the behavior.",
    sayThis:
      "If you're worried about food, tell me. Taking without asking isn't our plan — we can check the snack list together.",
    doThis: "Return food calmly. Offer a scheduled snack. Keep voice low and private.",
    helpfulNote: "The behavior is information about fear, not proof of \"bad character.\"",
  },
  "how-to-handle-bedtime-battles-after-foster-care-or-adoption": {
    category: "Bedtime & sleep",
    description:
      "Bedtime resistance after placement often mixes fear, control, and exhaustion. Try these words.",
    intro:
      "Nighttime can replay loss and uncertainty. Routines help, but so does language that says \"I'm staying close.\"",
    sayThis:
      "Bedtime is hard sometimes. I'm right here. We'll do our routine, and you're safe in this house.",
    doThis: "Keep steps predictable. Dim lights. Offer a brief check-in window instead of endless negotiations.",
    helpfulNote: "Long debates at bedtime feed the loop. Short scripts + steady routine win.",
  },
  "what-to-say-during-a-meltdown": {
    category: "Meltdowns",
    description:
      "What to say when a child is past reasoning — fewer words, more safety and presence.",
    intro:
      "In a meltdown, the thinking brain is offline. Your job is co-regulation, not teaching.",
    sayThis: "You're safe. I'm here. We'll ride this wave together. Nothing else right now.",
    doThis: "Reduce stimulation. Sit nearby. Breathe slowly. Wait — don't add new demands.",
    helpfulNote: "Adding logic mid-meltdown usually backfires. Save the lesson for later.",
  },
  "why-traditional-consequences-dont-always-work-for-kids-with-trauma": {
    category: "Trauma-informed parenting",
    description:
      "Why time-outs and loss of privileges may miss the point — and what to try in the moment instead.",
    intro:
      "Consequences assume a regulated brain that can connect cause and effect. Trauma history can short-circuit that bridge when stress is high.",
    sayThis:
      "Something big happened in your body. Let's get safe first. We'll talk about what comes next when we're calm.",
    doThis: "Prioritize safety and connection. Teach skills in calm moments, not during crisis.",
    helpfulNote:
      "Discipline and teaching are still important — timing and nervous-system state matter.",
  },
  "what-to-say-when-a-child-runs-away-or-hides": {
    category: "Safety risks",
    description:
      "When a child bolts or hides, use language that lowers threat and brings them back toward you.",
    intro:
      "Running and hiding can be fight-or-flight, not defiance. Your tone and distance matter as much as the words.",
    sayThis: "I see you. You're safe with me. Take your time — I'm not chasing. Come closer when you're ready.",
    doThis: "Stop pursuing if it escalates. Sit low. Keep exits monitored without cornering.",
    helpfulNote: "Chasing often increases panic. Calm presence invites them back.",
  },
  "calm-scripts-for-defiance-and-control-battles": {
    category: "Defiance",
    description:
      "Exit the power struggle with short scripts that hold the boundary without feeding the fight.",
    intro:
      "Defiance spikes when kids feel cornered. Hold the line with fewer words and a clear next step.",
    sayThis:
      "I'm not arguing about this. Here's what's happening next. You can be upset and still do it.",
    doThis: "Name one step. Pause. Follow through calmly without renegotiating.",
    helpfulNote: "Long debates teach kids that resistance buys time. Short scripts end the loop faster.",
  },
};

const PUBLISH_DATES = [
  "2026-06-10",
  "2026-06-12",
  "2026-06-14",
  "2026-06-17",
  "2026-06-19",
  "2026-06-21",
  "2026-06-24",
  "2026-06-26",
  "2026-06-28",
  "2026-07-01",
];

export const BLOG_POSTS: BlogPost[] = BLOG_TITLES.map((title, i) => {
  const slug = slugify(title);
  const meta = POST_META[slug];
  return {
    slug,
    title,
    publishedAt: PUBLISH_DATES[i] ?? "2026-06-01",
    category: meta?.category ?? "Parenting scripts",
    description: meta?.description ?? `Calm words for foster, adoptive, and kinship parents.`,
    intro: meta?.intro ?? "Practical scripts for hard moments — built for parents who need words now.",
    sayThis: meta?.sayThis ?? "I'm here with you. We'll get through this moment together.",
    doThis: meta?.doThis ?? "Breathe. Lower your voice. Keep everyone safe.",
    helpfulNote: meta?.helpfulNote ?? "Fewer words in crisis. Teach and repair when calm returns.",
  };
});

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
