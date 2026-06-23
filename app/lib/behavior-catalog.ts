export type Category = {
  id: string;
  title: string;
};

export type Behavior = {
  id: string;
  title: string;
  categoryId: string;
};

/** Muted color tint and one-line descriptor per category */
export const CATEGORY_META: Record<string, { color: string; descriptor: string }> = {
  food_eating: { color: "#E8E2D9", descriptor: "Calm the table without power struggles" },
  aggression_safety: { color: "#E5D5CF", descriptor: "Keep everyone safe without shaming" },
  lying_reality: { color: "#E2E0DB", descriptor: "Truth without blame" },
  stealing_taking: { color: "#E3DFD8", descriptor: "Boundaries with connection" },
  big_feelings: { color: "#D8E2DC", descriptor: "Regulate first. Solve later." },
  sensory_body: { color: "#E4E1DA", descriptor: "Meet the body where it is" },
  defiance_control: { color: "#E0DDD8", descriptor: "Clear limits, less friction" },
  nighttime_sleep: { color: "#D4DCE4", descriptor: "Wind down without a fight" },
  school_public: { color: "#E2DFDA", descriptor: "Consistent limits in public" },
  attachment_relationship: { color: "#D9E0E2", descriptor: "Connection without pressure" },
};

export const CATEGORIES: Category[] = [
  { id: "food_eating", title: "Food & Eating" },
  { id: "aggression_safety", title: "Aggression & Safety Risks" },
  { id: "lying_reality", title: "Lying & Reality Distortion" },
  { id: "stealing_taking", title: "Stealing & Taking Things" },
  { id: "big_feelings", title: "Big Feelings & Meltdowns" },
  { id: "sensory_body", title: "Sensory & Body Struggles" },
  { id: "defiance_control", title: "Defiance & Control" },
  { id: "nighttime_sleep", title: "Nighttime & Sleep" },
  { id: "school_public", title: "School & Public Behavior" },
  { id: "attachment_relationship", title: "Attachment & Relationship Struggles" },
];

/** Home dashboard: 5 primary tiles (brief). Fifth = sensory (canonical 8); not school_public. */
export const PRIMARY_CATEGORY_IDS: string[] = [
  "aggression_safety",
  "big_feelings",
  "defiance_control",
  "nighttime_sleep",
  "sensory_body",
];

/** All browseable categories — canonical 8 from Behavior Categories file, same order as Search. */
export const BROWSE_CATEGORY_IDS: string[] = [
  "food_eating",
  "aggression_safety",
  "lying_reality",
  "stealing_taking",
  "big_feelings",
  "sensory_body",
  "defiance_control",
  "nighttime_sleep",
];

export function getBrowseCategories() {
  const primarySet = new Set(PRIMARY_CATEGORY_IDS);
  const primary = PRIMARY_CATEGORY_IDS.map((id) => CATEGORIES.find((c) => c.id === id)).filter(Boolean);
  const rest = BROWSE_CATEGORY_IDS.filter((id) => !primarySet.has(id))
    .map((id) => CATEGORIES.find((c) => c.id === id))
    .filter(Boolean);
  return [...primary, ...rest] as Category[];
}

export const BEHAVIORS: Behavior[] = [
  // 1) Food & Eating
  { id: "hoarding_food_room", title: "Hoarding food in room", categoryId: "food_eating" },
  { id: "hiding_food", title: "Hiding food under bed or drawers", categoryId: "food_eating" },
  { id: "asking_food_constantly", title: "Asking for food constantly", categoryId: "food_eating" },
  { id: "gorging_hiding_wrappers", title: "Gorging then hiding wrappers", categoryId: "food_eating" },
  { id: "stealing_food_night", title: "Stealing food at night", categoryId: "food_eating" },
  { id: "refusing_served", title: "Refusing to eat what is served", categoryId: "food_eating" },
  { id: "throwing_food_upset", title: "Throwing food when upset", categoryId: "food_eating" },
  { id: "gorging_vomiting", title: "Gorging then vomiting", categoryId: "food_eating" },
  { id: "anxiety_not_enough_food", title: "Anxiety about “not enough” food", categoryId: "food_eating" },
  { id: "eating_fast_panicked", title: "Eating extremely fast and panicked", categoryId: "food_eating" },

  // 2) Aggression & Safety Risks
  { id: "hitting_kicking_angry", title: "Hitting or kicking when angry", categoryId: "aggression_safety" },
  { id: "throwing_objects", title: "Throwing objects", categoryId: "aggression_safety" },
  { id: "biting_overwhelmed", title: "Biting when overwhelmed", categoryId: "aggression_safety" },
  { id: "destroying_property", title: "Destroying property", categoryId: "aggression_safety" },
  { id: "head_banging", title: "Head banging", categoryId: "aggression_safety" },
  { id: "hurting_pets", title: "Hurting pets", categoryId: "aggression_safety" },
  { id: "hurting_siblings", title: "Hurting another child", categoryId: "aggression_safety" },
  { id: "threatening_hurt_others", title: "Threatening to hurt others", categoryId: "aggression_safety" },
  { id: "objects_as_weapons", title: "Using objects as weapons", categoryId: "aggression_safety" },
  { id: "running_unsafe_areas", title: "Running into unsafe areas", categoryId: "aggression_safety" },

  // 3) Lying & Reality Distortion
  { id: "didnt_do_it_obvious", title: "Saying “I didn’t do it” when obvious", categoryId: "lying_reality" },
  { id: "rewriting_history", title: "Rewriting history", categoryId: "lying_reality" },
  { id: "blaming_siblings", title: "Blaming siblings", categoryId: "lying_reality" },
  { id: "lying_homework", title: "Lying about homework", categoryId: "lying_reality" },
  { id: "stealing_praise", title: "Stealing praise", categoryId: "lying_reality" },
  { id: "false_accusations", title: "False accusations", categoryId: "lying_reality" },
  { id: "elaborate_stories", title: "Creating elaborate stories", categoryId: "lying_reality" },
  { id: "denying_evidence", title: "Denying obvious evidence", categoryId: "lying_reality" },

  // 4) Stealing & Taking Things
  { id: "taking_siblings_toy", title: "Taking sibling’s toy", categoryId: "stealing_taking" },
  { id: "stealing_money", title: "Stealing money", categoryId: "stealing_taking" },
  { id: "taking_from_school", title: "Taking items from school", categoryId: "stealing_taking" },
  { id: "shoplifting", title: "Shoplifting", categoryId: "stealing_taking" },
  { id: "hoarding_small_objects", title: "Hoarding small objects", categoryId: "stealing_taking" },
  { id: "taking_adult_items", title: "Taking adult items secretly", categoryId: "stealing_taking" },
  { id: "sneaking_electronics", title: "Sneaking electronics", categoryId: "stealing_taking" },

  // 5) Big Feelings & Meltdowns
  { id: "sobbing_meltdown", title: "Complete sobbing meltdown", categoryId: "big_feelings" },
  { id: "screaming_long_periods", title: "Screaming for long periods", categoryId: "big_feelings" },
  { id: "saying_i_hate_you", title: "Saying “I hate you”", categoryId: "big_feelings" },
  { id: "not_my_real_mom_dad", title: "“You’re not my real mom/dad”", categoryId: "big_feelings" },
  { id: "running_away_house", title: "Running away in house", categoryId: "big_feelings" },
  { id: "threatening_run_away", title: "Threatening to run away", categoryId: "big_feelings" },
  { id: "self_harm_threats", title: "Self-harm threats", categoryId: "big_feelings" },
  { id: "shutdown_refusal_speak", title: "Shutdown and refusal to speak", categoryId: "big_feelings" },
  { id: "dissociation_blank_stare", title: "Dissociation or blank stare", categoryId: "big_feelings" },
  { id: "panic_attack", title: "Panic attack", categoryId: "big_feelings" },

  // 6) Sensory & Body Struggles
  { id: "clothing_seams_tags", title: "Clothing seams or tags meltdown", categoryId: "sensory_body" },
  { id: "refusing_brush_teeth", title: "Refusing to brush teeth", categoryId: "sensory_body" },
  { id: "refusing_hair_brushing", title: "Refusing hair brushing", categoryId: "sensory_body" },
  { id: "food_texture_gagging", title: "Food texture gagging", categoryId: "sensory_body" },
  { id: "loud_noise_distress", title: "Loud noise distress", categoryId: "sensory_body" },
  { id: "refusing_bath_shower", title: "Refusing bath or shower", categoryId: "sensory_body" },
  { id: "bedwetting", title: "Bedwetting", categoryId: "sensory_body" },
  { id: "smearing_feces", title: "Smearing feces", categoryId: "sensory_body" },
  { id: "sexualized_behavior", title: "Sexualized behavior", categoryId: "sensory_body" },
  { id: "touch_boundary_issues", title: "Touch boundary issues", categoryId: "sensory_body" },

  // 7) Defiance & Control
  { id: "says_no_everything", title: "Saying “no” to everything", categoryId: "defiance_control" },
  { id: "deliberate_slow_compliance", title: "Deliberate slow compliance", categoryId: "defiance_control" },
  { id: "arguing_every_direction", title: "Arguing every direction", categoryId: "defiance_control" },
  { id: "power_struggle_small", title: "Power struggle over small things", categoryId: "defiance_control" },
  { id: "refusing_transition", title: "Refusing to transition", categoryId: "defiance_control" },
  { id: "ignoring_adult_public", title: "Ignoring adult in public", categoryId: "defiance_control" },
  { id: "manipulating_adults", title: "Manipulating adults against each other", categoryId: "defiance_control" },
  { id: "splitting_caregivers", title: "Splitting caregivers", categoryId: "defiance_control" },
  { id: "demanding_control_schedule", title: "Demanding control of schedule", categoryId: "defiance_control" },

  // 8) Nighttime & Sleep
  { id: "getting_out_bed_repeatedly", title: "Getting out of bed repeatedly", categoryId: "nighttime_sleep" },
  { id: "nightmares", title: "Nightmares", categoryId: "nighttime_sleep" },
  { id: "afraid_of_dark", title: "Afraid of the dark", categoryId: "nighttime_sleep" },
  { id: "bedwetting_accidents", title: "Bedwetting accidents", categoryId: "nighttime_sleep" },
  { id: "hoarding_items_bed", title: "Hoarding items in bed", categoryId: "nighttime_sleep" },
  { id: "sneaking_out_night", title: "Sneaking out at night", categoryId: "nighttime_sleep" },
  { id: "refusing_sleep_alone", title: "Refusing to sleep alone", categoryId: "nighttime_sleep" },
  { id: "early_waking_roaming", title: "Early waking and roaming", categoryId: "nighttime_sleep" },

  // 9) School & Public Behavior
  { id: "refusing_car_school", title: "Refusing to get in car for school", categoryId: "school_public" },
  { id: "after_school_restraint", title: "After-school restraint collapse", categoryId: "school_public" },
  { id: "lying_school_behavior", title: "Lying about school behavior", categoryId: "school_public" },
  { id: "refusing_homework", title: "Refusing homework", categoryId: "school_public" },
  { id: "hiding_assignments", title: "Hiding assignments", categoryId: "school_public" },
  { id: "public_meltdown_store", title: "Public meltdown in store", categoryId: "school_public" },
  { id: "running_parking_lot", title: "Running in parking lot", categoryId: "school_public" },
  { id: "embarrassing_behavior_public", title: "Embarrassing behavior in church or public", categoryId: "school_public" },
  { id: "talking_back_teachers", title: "Talking back to teachers", categoryId: "school_public" },
  { id: "suspension_discipline", title: "Suspension or discipline response", categoryId: "school_public" },

  // 10) Attachment & Relationship Struggles
  { id: "pushing_away_after_closeness", title: "Pushing caregiver away after closeness", categoryId: "attachment_relationship" },
  { id: "extreme_clinginess", title: "Extreme clinginess", categoryId: "attachment_relationship" },
  { id: "rejecting_affection", title: "Rejecting affection", categoryId: "attachment_relationship" },
  { id: "testing_love_repeatedly", title: "Testing love repeatedly", categoryId: "attachment_relationship" },
  { id: "youre_gonna_leave_me", title: "Saying “You’re going to leave me”", categoryId: "attachment_relationship" },
  { id: "jealousy_siblings", title: "Intense jealousy of siblings", categoryId: "attachment_relationship" },
  { id: "sabotaging_special_events", title: "Sabotaging special events", categoryId: "attachment_relationship" },
  { id: "acting_out_before_visits", title: "Acting out before family visits", categoryId: "attachment_relationship" },
  { id: "acting_out_after_visits", title: "Acting out after family visits", categoryId: "attachment_relationship" },
  { id: "grief_trigger_bio_family", title: "Grief trigger related to bio family", categoryId: "attachment_relationship" },
];

export function getCategoryById(categoryId: string) {
  return CATEGORIES.find((c) => c.id === categoryId) || null;
}

export function getBehaviorsForCategory(categoryId: string) {
  return BEHAVIORS.filter((b) => b.categoryId === categoryId);
}

export function getBehaviorById(behaviorId: string) {
  return BEHAVIORS.find((b) => b.id === behaviorId) || null;
}
