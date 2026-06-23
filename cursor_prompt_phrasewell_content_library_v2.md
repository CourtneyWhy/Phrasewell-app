# Cursor prompt: Phrasewell static content library v2

You are working on Phrasewell, a paid subscription parenting support app for overwhelmed parents in hard moments.

## Core architecture rule

Do **not** connect live, unconstrained AI generation to the user-facing app for phrase creation.

The app must only surface pre-written, pre-approved content from the local/seeded content library.

The attached content file is:

`phrasewell_aggression_safety_risks_v2_universal_3variants.json`

This file contains the first complete content category for the MVP:

- Category: Aggression & Safety Risks
- 10 behavior/subcategory options
- 4 age bands
- 3 “What’s happening?” contexts
- 3 approved phrase variants for every behavior + age band + context combination
- Total: 360 Moment Cards

## User flow context

The app flow should remain simple:

1. Parent opens app.
2. Parent taps “I need help right now.”
3. Parent selects a category.
4. Parent selects a specific behavior.
5. Parent selects age band.
6. Parent selects “What’s happening?”
7. App displays one approved Moment Card.
8. Parent can tap “Show another phrase” to rotate to another approved card from the same exact behavior + age band + context.

User-facing filters:

- Age: 0-3, 4-7, 8-12, Teen
- What’s happening?: Starting to escalate, Unsafe right now, After it happened

## Moment Card UI

Each Moment Card displays:

1. **Say this** — exact words to say out loud
2. **Do this** — what the parent physically/practically does next
3. **Helpful note** — why it works or what to avoid
4. **Safety note** — display only when the `safety_note` field is not empty

Use the field names from the JSON:

- `say_this`
- `do_this`
- `helpful_note`
- `safety_note`

Do not rename these in the data model.

## Storage instructions

Use the simplest implementation that fits the current app.

### If the app does not have a real database yet

Store the JSON as a static content library in the codebase.

Suggested location:

- `/src/data/phrasewell_aggression_safety_risks_v2_universal_3variants.json`

or, if the app uses the app directory:

- `/app/data/phrasewell_aggression_safety_risks_v2_universal_3variants.json`

Then create a helper file:

- `/src/lib/contentLibrary.ts`

or:

- `/lib/contentLibrary.ts`

This helper should import/read the JSON and expose lookup functions.

### If the app already has Supabase/Postgres or another database

Create a `moment_cards` table and seed it from this JSON.

Recommended fields:

- `id` text primary key
- `category_id` text
- `category_name` text
- `category_subtitle` text
- `behavior_id` text
- `behavior_name` text
- `legacy_behavior_id` text nullable
- `age_band_id` text
- `age_band` text
- `moment_id` text
- `moment_label` text
- `variant_number` integer
- `say_this` text
- `do_this` text
- `helpful_note` text
- `safety_note` text nullable
- `tags` text array or JSON array
- `search_terms` text array or JSON array
- `is_approved` boolean
- `review_status` text
- `content_version` text
- `runtime_ai_generation_allowed` boolean
- `display_language_rule` text

Add an index on:

- `behavior_id`
- `age_band_id`
- `moment_id`
- `is_approved`

But do not build an admin panel, CMS, or complex backend yet unless one already exists. Static JSON is acceptable for MVP.

## Required lookup functions

Create these functions:

```ts
getCategories()
getBehaviorsByCategory(categoryId)
getCardsByBehaviorAgeAndMoment(behaviorId, ageBandId, momentId)
getDefaultCard(behaviorId, ageBandId, momentId)
getAnotherCard(currentCardId, behaviorId, ageBandId, momentId)
searchMoment(query)
```

### `getCardsByBehaviorAgeAndMoment`

Return all approved cards where:

- `behavior_id` matches
- `age_band_id` matches
- `moment_id` matches
- `is_approved === true`
- `runtime_ai_generation_allowed === false`

For this v2 content, every combination should return 3 cards.

### `getDefaultCard`

Return variant 1 by default, or the first approved card for that exact combination.

### `getAnotherCard`

This powers the “Show another phrase” button.

Rules:

- Stay inside the same `behavior_id`, `age_band_id`, and `moment_id`.
- Only use approved cards.
- Never call OpenAI, Anthropic, Grok, Gemini, or any other model.
- Never generate a new phrase.
- Rotate through the other approved variants.
- Do not immediately return the same card if another option exists.
- If only one approved card exists, keep showing it or disable the button.

## Search behavior

Search is classification/retrieval, not authorship.

The search bar may help a parent type something like:

- “he hit his brother”
- “she bit someone”
- “throwing toys”
- “ran into the street”

The app must map that query to the closest existing approved behavior/card.

For MVP, use local keyword search.

Normalize the query:

- lowercase
- trim spaces
- remove punctuation where useful

Search against:

- `behavior_name`
- `category_name`
- `tags`
- `search_terms`
- `say_this`
- `do_this`
- `helpful_note`

Rank results by number and quality of matches.

Return matching behaviors or cards. When the parent taps a result, show an approved Moment Card.

Important: search must not generate a custom answer from the query.

If no close match is found, show this fallback:

> I couldn’t find a close match yet. Try choosing the closest category.

## Tags and search terms

Tags and search terms are hidden helper fields. They are not necessarily shown to the user.

They help with organization and matching.

Examples:

- `immediate safety`
- `body safety`
- `repair`
- `weapon risk`
- `elopement`
- `animal safety`
- `another child`
- `universal language`

Hidden search terms may include words a parent might type, including relationship words like “brother” or “sister,” but those words must not appear in the displayed script fields.

## Universal language rule

All user-facing scripts must work for any household, any family structure, any school/public setting, and any person present.

Do not display relationship-specific words in these fields:

- `say_this`
- `do_this`
- `helpful_note`
- `safety_note`
- `behavior_name`

Avoid these displayed words:

- sister
- brother
- mom
- dad
- mother
- father
- baby
- friend
- classmate
- teacher

Use universal phrases instead:

- everyone
- the other person
- another child
- people and pets
- someone
- the person affected
- the child who was hurt
- the animal

This rule exists so the parent can read the phrase exactly as written during a hard moment without mentally translating it.

## Content audit to run

Before wiring this into the UI, validate the JSON:

1. There are exactly 360 cards.
2. There are 10 behaviors.
3. There are 4 age bands.
4. There are 3 moment contexts.
5. Every behavior + age band + moment combination has exactly 3 approved cards.
6. No card has `runtime_ai_generation_allowed: true`.
7. No displayed script field contains the forbidden relationship-specific words.
8. `Show another phrase` can always find another card for the selected combination.

## UI labels

Use these labels exactly:

- Say this
- Do this
- Helpful note
- Safety note
- Show another phrase

Do not use:

- New phrase
- AI refresh
- Generate another
- Ask AI

## Later semantic search context

Later, Phrasewell may use embeddings so a typed phrase like “he hit his sister again” maps to an approved behavior such as “Hitting or kicking when angry” or “Hurting another child.”

Even then, AI may only choose the closest approved content.

It must never write new parenting advice at runtime.

Build the static content-library version first. Keep it simple.
