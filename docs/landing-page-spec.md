# Phrasewell Landing Page Spec

Locked requirements for recreating the Lovable landing page at `/` in this repo.

## Scope (this pass)

- Landing page only at root `/`
- Keep `/app/*` unchanged
- No paywall, auth, billing, email gate, or in-app changes
- Do not auto-redirect to `app.phrasewell.net` after beta signup

## Visual style (do not redesign)

- Background: `#F5F3EE`
- Text/icons: `#2B2825`
- Accent: `#C9A876`
- Headings/wordmark: **Lora**
- Body/UI: **Inter**
- Premium editorial look: cream page, white cards, pill buttons, no gradients

## Copy & UX changes

1. All **"Try the beta"** → **"Join the beta"**
2. Secondary hero **"Join the waitlist"** → **"See how it works"**
3. Primary CTA scrolls to beta form (`#beta`); secondary scrolls to How it works (`#how-it-works`)
4. Tighten hero vertically ~20–30% less space between header and beta badge/headline
5. Demo phrase card: 4 fixed marketing examples, rotate on **Show another phrase**
6. **What you get** heading → **"Everything you need in the moment."**
7. Under beta form subheading add: **"We're inviting early testers in small groups."**
8. Replace **draft/drafts** with **phrase/phrases** in footer/disclaimer

## Demo phrase rotation (default first: Hitting · Age 6)

| # | Moment | Say this | Do this | Helpful note |
|---|--------|----------|---------|--------------|
| 1 | Hitting · Age 6 | "I won't let you hit. I'm going to help keep everyone safe." | Move close enough to block, but not so close that anyone gets hurt. Use fewer words. | Safety comes first. Teaching comes later, when the child can hear you. |
| 2 | Big meltdown · Age 3 | "You're really upset. I'm here. I won't let you hurt yourself or anyone else." | Get low, keep your voice quiet, and use as few words as possible. | At this age, the goal is safety and co-regulation first. Teaching can come later. |
| 3 | Refusing to transition · Age 8 | "You don't have to like it. It's still time to go. I'll help you take the first step." | Offer one simple next action, not a debate. | A calm limit gives the child something solid to push against without turning it into a power struggle. |
| 4 | Escalating argument · Teen | "I'm not going to argue with you while we're both heated. I'm going to pause, and we'll come back to this when we can speak respectfully." | Step back, lower your voice, and do not chase the last word. | With teens, calm authority often means ending the power struggle without withdrawing connection. |

## Beta form (Supabase)

**Table:** `waitlist_signups`

| Column | Type |
|--------|------|
| id | uuid, primary key, default `gen_random_uuid()` |
| first_name | text, not null |
| email | text, not null, unique |
| parent_type | text, not null |
| source | text, not null |
| created_at | timestamptz, default `now()` |

**Behavior:**

- Require first name, email, parent type
- Validate email format
- Prevent duplicate emails (unique constraint + friendly error)
- `source` = `"landing_page"`
- Success message: *"You're on the list. We're inviting early testers in small groups and will email you when your beta access opens."*
- No auth, no outbound emails yet

**Parent type options:**

- Foster parent
- Adoptive parent
- Kinship caregiver
- Biological parent
- Stepparent
- Grandparent caregiver
- Professional supporting parents
- Other

## Logo

- Lovable bowl + dot as CSS/SVG on landing (temporary; final asset later)
- App routes may keep PNG mark

## Deployment (when ready)

- Fresh GitHub repo: `phrasewell`
- Vercel first; DNS at registrar
- `phrasewell.net` → landing `/`
- `app.phrasewell.net` → beta app (later)
