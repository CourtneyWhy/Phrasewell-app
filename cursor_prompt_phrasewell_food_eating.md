# Cursor Implementation Prompt — Phrasewell Food & Eating Content Library

You are adding the next approved content library category to Phrasewell.

## Category to add

- Category ID: `food_eating`
- Category label: `Food & Eating`
- Subtitle: `Calm the table without power struggles`
- Source JSON file: `phrasewell_food_eating_v1_universal_3variants.json`

## Architecture rule

Phrasewell uses AI as a pre-launch content creation tool only. The live app must not generate parenting scripts, actions, helpful notes, summaries, or safety notes at runtime.

The app may only retrieve and display approved content from the static reviewed content library.

## Content included

This JSON contains:

- 10 behaviors
- 4 age bands
- 3 help contexts
- 3 approved variants per exact behavior + age + context combination

Total cards: 360.

## Behaviors in this category

1. Hoarding food in room
2. Hiding food under bed or drawers
3. Asking for food constantly
4. Gorging then hiding wrappers
5. Stealing food at night
6. Refusing to eat what is served
7. Throwing food when upset
8. Gorging then vomiting
9. Anxiety about “not enough” food
10. Eating extremely fast and panicked

## Age bands

Use these existing app age bands:

- `0_3` → `0–3`
- `4_7` → `4–7`
- `8_12` → `8–12`
- `teen` → `Teen`

## User-facing help contexts

Use these three user-facing context labels:

- `calm_this_down` → `Calm this down`
- `stop_unsafe_behavior` → `Stop unsafe behavior`
- `repair_afterward` → `Repair afterward`

Do not add Calm Reset, Firm Boundary, Immediate Safety, or What's happening as separate user-facing filters.

## Retrieval rule

Moment Cards must be retrieved by this exact combination:

```ts
category_id + behavior_id + age_band_id + context_id
```

The app should show one approved card for the selected combination.

The **Show another phrase** button must rotate only through the other approved variants with the exact same:

```ts
category_id + behavior_id + age_band_id + context_id
```

Do not pull cards from another behavior, age band, or context unless the user changes that selection.

## Search rule

Search is retrieval only. Search must never generate new text.

The search bar should match parent-entered text against:

- category label
- behavior label
- behavior aliases
- hidden search_terms
- hidden tags

Search should return matching behaviors, not AI-generated advice.

Parents may type phrases like:

- food hoarding
- hiding food
- food under bed
- keeps asking for food
- stealing food at night
- throws food
- refuses dinner
- gorging
- vomiting after eating
- eats too fast
- worried there is not enough food

When a parent taps a search result, route them into the normal flow for that behavior and collect any missing selections:

- age band
- context/help mode

Then display an approved Moment Card.

## Universal language rule

Displayed script fields must stay universal. Do not introduce family-role-specific language like sister, brother, mom, dad, baby, friend, classmate, or teacher into displayed fields.

Use broadly applicable language like:

- everyone
- the other person
- people
- the adult
- the caregiver
- the child
- the space
- the table

Hidden search terms may include words a parent might type, but displayed scripts should remain broadly applicable.

## Food-specific safety and tone rules

Food content must be especially careful.

Do:

- Use non-shaming language.
- Pair food-security reassurance with practical boundaries.
- Avoid moralizing food.
- Avoid body shame.
- Avoid diet, weight, or calorie language.
- Avoid forced-eating language.
- Treat hoarding, hiding, gorging, and repeated food asking as possible food-security anxiety.
- Keep scripts short enough to say in the moment.
- Keep actions concrete and realistic.

Do not:

- Tell parents to punish hunger.
- Tell parents to withhold food as discipline.
- Shame secret eating.
- Call the child manipulative, greedy, sneaky, bad, or dramatic.
- Generate medical, nutrition, or eating-disorder advice.

For vomiting, choking risk, eating extremely fast, or possible spoiled food, display the provided `safety_note` where present.

## Data placement

Store this JSON with the other approved Phrasewell content libraries, ideally in the same static data folder already used for previous categories.

Suggested options:

```txt
src/data/phrasewell_food_eating_v1_universal_3variants.json
```

or, if the app uses a combined library:

```txt
src/data/phrasewellContentLibrary.ts
```

Import or merge it the same way as the existing category JSON files.

## Final requirement

Do not connect this category to live AI generation. This category must work entirely from the approved JSON content.
