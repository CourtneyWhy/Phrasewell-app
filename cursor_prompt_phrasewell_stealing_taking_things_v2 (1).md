# Cursor Prompt: Add Phrasewell Stealing & Taking Things Content

Add the Phrasewell content file `phrasewell_stealing_taking_things_v2_universal_3variants.json` to the app content library.

## Goal

This category must work inside the existing Phrasewell approved-content architecture.

The app must retrieve pre-written, approved Moment Cards only. Do not generate scripts, advice, action cards, helpful notes, or safety notes with AI at runtime.

## Category

Category label: `Stealing & Taking Things`

Subtitle: `Boundaries with connection`

Subcategories included:

1. Taking sibling’s toy
2. Stealing money
3. Taking items from school
4. Shoplifting
5. Hoarding small objects
6. Taking adult items secretly
7. Sneaking electronics

## Age bands

Each subcategory includes all age bands:

- 0–3
- 4–7
- 8–12
- Teen

## Help contexts

Each subcategory + age band includes all three user-facing help contexts:

- Calm this down
- Stop unsafe behavior
- Repair afterward

Use these internal context IDs:

- `calm_this_down`
- `stop_unsafe_behavior`
- `repair_afterward`

## Variants

Each exact combination has 3 approved variants.

The app should retrieve cards by this exact match:

```ts
category_id + behavior_id + age_band + context_id
```

The **Show another phrase** button should rotate only through approved variants with the same:

```ts
category_id + behavior_id + age_band + context_id
```

Do not pull from another behavior, another age band, or another context unless the user changes those selections.

## Universal language rule

Displayed script fields must work across households, caregivers, and situations.

The displayed fields are:

- `say_this`
- `do_this`
- `helpful_note`
- `safety_note`

Do not add relationship-specific words to displayed scripts, such as:

- sister
- brother
- sibling
- mom
- dad
- mother
- father
- friend
- classmate
- teacher
- baby

Hidden `search_terms` may include those words because parents may type them into search. Search terms are not displayed as scripts.

## Search behavior

Search should use retrieval only.

Search may match against:

- category label
- behavior label
- behavior aliases
- hidden `search_terms`
- hidden `tags`

Search must never generate a new answer.

If a user searches something like:

- “took sister’s toy”
- “stole money”
- “hid a phone”
- “shoplifting”
- “taking things from school”

The app should route them to the closest approved behavior, then continue the normal flow for age band and help context.

## Sensitive content guidance

For this category, keep the tone calm and accountable.

Do:

- return or secure the item first
- avoid shame
- avoid forced confessions
- avoid labels like thief, liar, sneaky, manipulative, or bad
- focus on repair, return, repayment, prevention, and trust
- use short scripts that can be said out loud

Do not:

- moralize
- shame the child
- turn the moment into a courtroom interrogation
- force a dramatic apology
- threaten police or legal consequences casually
- use live AI generation

## Expected card count

This file contains:

7 behaviors × 4 age bands × 3 contexts × 3 variants = 252 Moment Cards

## Implementation notes

Use this file as an approved static content source.

Recommended location:

```txt
/src/data/phrasewell_stealing_taking_things_v2_universal_3variants.json
```

If the app already has a combined content file, merge the `cards` array into the combined library and keep the category metadata available for rendering category and behavior lists.

Make sure this category appears on the Categories screen and routes correctly into the existing Phrasewell flow.

Do not change the product scope. Do not add journaling, coaching, chat, gamification, or live AI.
