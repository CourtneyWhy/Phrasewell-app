# Cursor Prompt — Add Phrasewell Category: Sensory & Body Struggles

You are adding the next approved content category to Phrasewell.

## Category to add

Category ID: `sensory_body_struggles`  
Category label: `Sensory & Body Struggles`  
Category subtitle: `Meet the body where it is`

Use the attached JSON file:

`phrasewell_sensory_body_struggles_v1_universal_3variants.json`

Do not replace existing categories. Merge this category into the existing approved content library.

## Important architecture rule

Phrasewell uses AI as a pre-launch content drafting tool only. The live app must not generate parenting scripts, actions, helpful notes, safety notes, or explanations at runtime.

The app may only retrieve and display approved content from the content library.

Set and respect:

```ts
runtime_ai_generation_allowed: false
```

for all cards.

## User-facing flow

The app should continue to use this flow:

1. User opens app.
2. User selects a category.
3. User selects a behavior/subcategory.
4. User selects age band.
5. User selects context/help type.
6. App displays one approved Moment Card.

For this category, the behavior list should be:

1. Clothing seams or tags meltdown
2. Refusing to brush teeth
3. Refusing hair brushing
4. Food texture gagging
5. Loud noise distress
6. Refusing bath or shower
7. Bedwetting
8. Smearing feces
9. Sexualized behavior
10. Touch boundary issues

Age bands:

- 0–3
- 4–7
- 8–12
- Teen

Contexts/help types:

- Calm this down
- Stop unsafe behavior
- Repair afterward

## Retrieval logic

The app should retrieve cards by this exact combination:

```ts
category_id + behavior_id + age_band_id + context_id
```

Example:

```ts
category_id: "sensory_body_struggles"
behavior_id: "food_texture_gagging"
age_band_id: "4_7"
context_id: "calm_this_down"
```

This should return 3 approved variants.

Display only one card at a time.

## “Show another phrase” button

The “Show another phrase” button must rotate only through approved variants with the same:

```ts
category_id
behavior_id
age_band_id
context_id
```

It must not pull from another behavior, another age band, or another context.

It must not call an AI model.

If there are 3 variants, rotate through the 3 local approved cards.

## Moment Card display

Each Moment Card should display:

1. `say_this`
2. `do_this`
3. `helpful_note`
4. `safety_note`, only if it is not null or empty

The user should not see internal fields like:

- tags
- search_terms
- behavior_aliases
- review_status
- runtime_ai_generation_allowed
- universal_language_verified

## Universal language rule

Displayed scripts must be broadly applicable to all family structures and situations.

Do not use relationship-specific words in displayed fields such as:

- sister
- brother
- mom
- dad
- baby
- friend
- classmate
- teacher

Use universal language like:

- everyone
- the other person
- the person affected
- people nearby
- adults
- caregivers
- the child

The JSON file has already been drafted with this rule applied. Preserve it.

Hidden `search_terms`, `aliases`, and `tags` may include words a parent might type, even if those words should not appear in the script itself.

## Sensitive body-safety content

This category includes body-care and body-safety behaviors such as:

- Smearing feces
- Sexualized behavior
- Touch boundary issues
- Bedwetting

Display the content calmly and privately. Do not add shame-based, alarming, or graphic language.

For `sexualized_behavior` and `touch_boundary_issues`, preserve the existing safety notes. These cards should stay calm, direct, and safety-focused. The app should not diagnose, interrogate, or generate customized advice. It should only display the approved card.

For `smearing_feces`, preserve hygiene/supervision safety notes. The app should not treat the behavior as willful disgust or moral failure.

For `bedwetting`, preserve privacy and dignity. Do not frame accidents as punishment-worthy.

## Search behavior

Search is retrieval only.

Search must never generate a new script.

Search should match parent input against:

- category label
- behavior label
- behavior aliases
- search_terms
- tags

A parent may type natural phrases like:

- “tags bothering him”
- “socks feel wrong”
- “will not brush teeth”
- “hair brushing hurts”
- “gagging on food”
- “too loud”
- “covering ears”
- “will not shower”
- “wet the bed”
- “smearing poop”
- “private parts behavior”
- “touching other people”
- “no personal space”

Search should return matching behaviors, not AI-written advice.

When the user taps a search result, take them into the normal selection flow for that behavior. If age band and context are not already selected, ask for those before showing a card.

## Footer / navigation

Do not show the full bottom footer inside the in-the-moment help flow.

Inside the help flow, use the focused top navigation:

- Back on the left
- Home on the right

The full footer should remain only for top-level pages:

- Home
- Search
- Saved
- Settings

## Success check

After implementation:

- Sensory & Body Struggles appears as a category.
- The category shows all 10 behavior tiles.
- Each behavior supports all 4 age bands.
- Each behavior supports all 3 contexts.
- Each exact combination has 3 approved variants.
- “Show another phrase” rotates through the 3 approved variants.
- No runtime AI generation occurs.
- Search finds these behaviors using natural parent wording.
