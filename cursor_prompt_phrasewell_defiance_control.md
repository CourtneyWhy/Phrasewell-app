# Cursor Prompt — Add Phrasewell Category: Defiance & Control

You are adding the next approved content category to Phrasewell.

## Category to add

Category ID: `defiance_control`  
Category label: `Defiance & Control`  
Category subtitle: `Clear limits, less friction`

Use the attached JSON file:

`phrasewell_defiance_control_v1_universal_3variants.json`

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

1. Saying “no” to everything
2. Deliberate slow compliance
3. Arguing every direction
4. Power struggle over small things
5. Refusing to transition
6. Ignoring adult in public
7. Manipulating adults against each other
8. Splitting caregivers
9. Demanding control of schedule

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
category_id: "defiance_control"
behavior_id: "refusing_to_transition"
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

- “says no to everything”
- “argues every direction”
- “won’t transition”
- “ignoring me in the store”
- “playing adults against each other”
- “splitting caregivers”
- “needs to know the schedule”
- “everything is a fight”

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

- Defiance & Control appears as a category.
- The category shows all 9 behavior tiles.
- Each behavior supports all 4 age bands.
- Each behavior supports all 3 contexts.
- Each exact combination has 3 approved variants.
- “Show another phrase” rotates through the 3 approved variants.
- No runtime AI generation occurs.
- Search finds these behaviors using natural parent wording.
