# Cursor Prompt: Add Phrasewell Content Library — Lying & Reality Distortion

You are working on Phrasewell, a mobile-first parenting support app. Add the attached JSON file as the approved content library for the category **Lying & Reality Distortion**.

## Product rule
Phrasewell does **not** use live AI generation during app use. All scripts are pre-written and approved before they are shown to a parent.

Do not connect this category to a live AI generator. Do not generate new scripts, actions, notes, summaries, or advice at runtime.

## File to add
Use this file:

`phrasewell_lying_reality_distortion_v1_universal_3variants.json`

Store it with the other Phrasewell content libraries. Recommended path if the app uses local content files:

`src/content/phrasewell_lying_reality_distortion_v1_universal_3variants.json`

If the app already has a content folder or seed-data folder, place it there instead and import it into the same content-loading system used by the other categories.

## Category metadata
Category label: **Lying & Reality Distortion**  
Subtitle: **Truth without blame**

Subcategories included:
1. Saying “I didn’t do it” when obvious
2. Rewriting history
3. Blaming siblings
4. Lying about homework
5. Stealing praise
6. False accusations
7. Creating elaborate stories
8. Denying obvious evidence

Age bands:
- 0–3
- 4–7
- 8–12
- Teen

Context buttons:
- Calm this down
- Stop unsafe behavior
- Repair afterward

Each exact combination has 3 approved variants, so the **Show another phrase** button must work.

Total coverage:
8 behaviors × 4 age bands × 3 contexts × 3 variants = 288 Moment Cards.

## Retrieval behavior
When the user selects:
- category_id
- behavior_id
- age_band_id
- context_id

show one matching approved Moment Card.

The app retrieves cards by this exact key:

`category_id + behavior_id + age_band_id + context_id`

The **Show another phrase** button should rotate only through approved cards with that same exact key. It must not pull from another behavior, another age band, another category, or another context.

## Universal language rule
Displayed scripts must stay universal. In `say_this`, `do_this`, `helpful_note`, and `safety_note`, do not introduce specific family-role language such as sister, brother, mom, dad, baby, friend, classmate, or teacher.

Search terms may include these words because a parent may type them into search, but the displayed script should remain universal.

## Lying category tone rules
This category must avoid shame and avoid calling the child a liar.

Do not use:
- liar
- lying child
- manipulative
- gaslighting as a displayed label
- bad
- naughty
- dishonest as an identity

Preferred language:
- true part
- what happened
- what we know
- facts
- repair
- trust
- next right step

The goal is truth without blame: calm down the defensive loop, stop circular arguments, and offer a path back to repair.

## False accusation safety rule
For false accusations, keep the safety note. If an accusation involves harm, abuse, unsafe contact, self-harm, or danger, the app should tell the parent to pause, write down the exact words, and get appropriate support. Do not coach, pressure, interrogate, or dismiss serious claims.

## Search behavior
Search remains retrieval-only.

The search bar should find approved categories or behaviors using:
- category label
- behavior label
- search_terms
- tags
- aliases or common parent phrases included in the JSON

Search should return likely matching behaviors first. After a user taps a result, continue the normal flow by asking for any missing choices: age band and context. Once those choices are known, show an approved Moment Card.

Search must never generate a parenting script or explanation.

## Success check
After adding this file:
1. Lying & Reality Distortion appears as a category.
2. The 8 subcategories appear under the category.
3. Each subcategory has cards for all 4 age bands and all 3 contexts.
4. Show another phrase rotates among 3 variants for the exact selected situation.
5. Search can find this category from terms like “lying,” “I didn’t do it,” “blaming,” “homework,” “false accusation,” “making up stories,” and “denying evidence.”
6. No live AI generation is used.
