# Cursor task: Add Big Feelings & Meltdowns content library to Phrasewell

Add the attached JSON file as the next approved static content library for Phrasewell:

`phrasewell_big_feelings_meltdowns_v1_universal_3variants.json`

## Core architecture rule

Phrasewell must use prewritten, reviewed content only.

Do not connect live AI generation.
Do not generate new parenting scripts at runtime.
Do not rewrite `say_this`, `do_this`, `helpful_note`, or `safety_note` inside the app.

The app may search and retrieve approved content, but it must never create new content during use.

## Category being added

Category:
`big_feelings_meltdowns`

Display name:
`Big Feelings & Meltdowns`

Subtitle:
`Regulate first. Solve later.`

## Behaviors included

The JSON includes approved cards for these 10 behaviors:

1. Complete sobbing meltdown
2. Screaming for long periods
3. Saying “I hate you”
4. “You’re not my real mom/dad”
5. Running away in house
6. Threatening to run away
7. Self-harm threats
8. Shutdown and refusal to speak
9. Dissociation or blank stare
10. Panic attack

## Age bands

The app should support these age bands for this category:

- 0–3
- 4–7
- 8–12
- Teen

## Context / help mode filters

This file uses 3 context filters:

- `calm_this_down` — display label: `Calm this down`
- `stop_unsafe_behavior` — display label: `Stop unsafe behavior`
- `repair_afterward` — display label: `Repair afterward`

The card objects include both `context_id/context_label` and `moment_id/moment_label` for compatibility. Treat them as the same selection.

If the app already uses the older Aggression & Safety Risks moment IDs, map them this way:

- `starting_to_escalate` → `calm_this_down`
- `unsafe_right_now` → `stop_unsafe_behavior`
- `after_it_happened` → `repair_afterward`

## Retrieval rule

When a parent selects a behavior, age band, and context, show one approved Moment Card that matches:

`category_id + behavior_id + age_band_id + context_id`

or equivalently:

`category_id + behavior_id + age_band_id + moment_id`

Do not pull cards from another behavior, another age band, or another context unless the user changes that selection.

## Show another phrase behavior

The JSON includes 3 variants for every exact situation:

`10 behaviors × 4 age bands × 3 contexts × 3 variants = 360 cards`

The `Show another phrase` button should rotate only through approved cards that match the same:

- category_id
- behavior_id
- age_band_id
- context_id

If there are 3 variants, rotate through those 3. Do not generate a new phrase. Do not call an AI model.

## Search behavior

Search is retrieval only. It should find the closest approved behavior and route the user into the normal flow.

Search should look across:

- category_name
- behavior_name
- search_terms
- tags
- aliases/search terms on the behavior object

Search should return behavior matches, not generated answers.

Example searches that should map into this category:

- crying
- sobbing
- screaming
- I hate you
- not my real mom
- not my real dad
- running away
- threatening to leave
- hurt myself
- suicide
- shutdown
- will not talk
- blank stare
- dissociation
- panic attack
- cannot breathe

When the user taps a search result, continue the normal selection flow for any missing choices:

- age band
- context/help mode

Then show an approved Moment Card.

## Universal language rule

Displayed script fields must work in any household and any situation.

Do not add relationship-specific words such as sister, brother, mom, dad, mother, father, baby, friend, classmate, or teacher into displayed script fields unless the selected behavior itself requires that wording in the behavior title.

Search terms may include those words because parents may type them, but displayed content should stay universal.

## Safety notes

Some Big Feelings cards include `safety_note`, especially for:

- self-harm threats
- panic attack
- dissociation or blank stare
- threatening to run away
- running away in house

If `safety_note` is present and not blank, display it below the helpful note in a subtle but visible safety callout.

Do not make it alarming, but do not hide it.

## Review status

All cards are marked:

`draft_ready_for_founder_review`

Treat them as approved for development/testing, but keep the review field available so the founder can later mark items as final, edited, hidden, or needs review.
