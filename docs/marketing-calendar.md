# Phrasewell marketing calendar — launch July 28, 2026

Workback schedule from **June 23 → post-launch October 2026**.  
Goal: waitlist growth → beta feedback → **founding launch July 28** → reviews → LTD/AppSumo prep.

---

## Tools (what to use where)

| Job | Tool | Why |
|-----|------|-----|
| **Waitlist + feedback data** | **Supabase** (already set up) | `waitlist_signups`, `phrase_feedback` |
| **Email campaigns** | **Loops** (recommended) or **MailerLite** | Simple sequences, good for SaaS; import CSV from Supabase |
| **Transactional / invite emails** | **Resend** (optional) | One-off beta invites from a real `@phrasewell.net` address later |
| **Social scheduling** | **Buffer** (free tier) or **Later** | Queue X + FB posts |
| **Reddit monitoring** | **F5Bot** (free) or manual search | Alerts for foster/adoptive/meltdown keywords |
| **Blog / SEO** | **Phrasewell site** (`/blog` — to build) | Owned traffic |
| **Analytics** | **Vercel Analytics** + **Plausible** (optional) | Traffic + conversions |
| **Review collection** | **Trustpilot** (after 20+ happy users) | Social proof before AppSumo |
| **Design** | **Canva** | Script cards for X/IG |
| **Automation glue** | **Zapier** or **Make** (optional) | Supabase new signup → Loops contact |

### Where email campaigns send from

1. **Export waitlist** from Supabase Table Editor → CSV → import to **Loops** or **MailerLite**  
2. Or connect **Zapier**: new row in `waitlist_signups` → add to Loops audience  
3. Send campaigns from Loops/MailerLite (not from Supabase directly)  
4. When you have `hello@phrasewell.net`, connect domain in Loops for better deliverability  

**Do not** email the full list from Outlook — use a proper email tool so you don’t land in spam.

---

## Campaign map

| # | Campaign | Dates | Length | Goal |
|---|----------|-------|--------|------|
| 1 | **Waitlist warm-up** | Jun 23 – Jul 13 | 21 days | List building, no LTD talk |
| 2 | **Beta wave 1** | Jul 1 – Jul 14 | 14 days | 20–30 testers, in-app feedback |
| 3 | **Beta wave 2** | Jul 8 – Jul 21 | 14 days | 30–50 more testers, fix content |
| 4 | **Pre-launch / founding warm-up** | Jul 14 – Jul 27 | 14 days | Hype, social proof, blog SEO |
| 5 | **Founding launch** | **Jul 28 – Aug 3** | 7 days | First paid LTD sales |
| 6 | **Post-launch nurture** | Aug 4 – Sep 30 | 8 weeks | Reviews, content, list growth |
| 7 | **AppSumo prep** | Oct 1 – Dec (TBD) | — | Scale LTD |

---

## Campaign 1 — Waitlist warm-up (Jun 23 – Jul 13)

**Description:** Build a list of foster/adoptive/kinship parents. No pricing. No LTD.

**Prep to-do (5 days — Jun 23–27):**
- [x] Landing live + waitlist form
- [ ] Set `BETA_APP_PASSWORD` in Vercel
- [ ] Run `003_phrase_feedback.sql` in Supabase
- [ ] Sign up for **Loops** or **MailerLite**
- [ ] Join 10 Facebook groups (foster, adoptive, kinship, TBRI)
- [ ] Create X account bio + pinned post pointing to waitlist
- [ ] Draft 4 emails in Loops (see below)

**4 waitlist emails (schedule in Loops):**
1. **Immediate:** “You’re on the list” + what Phrasewell is
2. **Day 3:** One example script card (image) — meltdown / hitting
3. **Day 7:** “Who this is for” (foster, adoptive, kinship)
4. **Day 14:** “We’re inviting small test groups soon” — no link yet

**9+ social posts (Buffer):** script cards, builder story, “what would you say when…” questions.

### Daily tasks — Week of Jun 23

| Day | Task |
|-----|------|
| **Mon Jun 23** | Deploy password + feedback; set beta password in Vercel; import waitlist to Loops |
| **Tue Jun 24** | Join 5 FB groups; lurk + read rules; post 1 X script card |
| **Wed Jun 25** | Reddit 30 min (helpful comments, no links); schedule 3 Buffer posts |
| **Thu Jun 26** | Write blog post #1 outline (“You’re not my real mom” scripts) |
| **Fri Jun 27** | FB: ask-advice post in 1 group (waitlist link); email #1 live in Loops |
| **Sat Jun 28** | Draft blog post #1 (1,200 words) |
| **Sun Jun 29** | Rest / schedule week ahead in Buffer |

### Week of Jun 30

| Day | Task |
|-----|------|
| **Mon Jun 30** | Publish blog #1 on site; share on X + 1 FB group |
| **Tue Jul 1** | **Beta wave 1:** email 20 waitlist people (invite + password); Reddit 30 min |
| **Wed Jul 2** | Review `phrase_feedback` in Supabase; fix 2 worst phrases |
| **Thu Jul 3** | X post + FB comment help in 2 groups |
| **Fri Jul 4** | Email #2 to full waitlist (script card); check beta feedback |
| **Sat–Sun** | Content batch: 3 script images in Canva |

### Week of Jul 7

| Day | Task |
|-----|------|
| **Mon Jul 7** | Blog #2 publish (hitting / meltdown by age) |
| **Tue Jul 8** | Beta wave 2: invite 30 more from waitlist |
| **Wed Jul 9** | Reddit + X; reply to all beta feedback comments |
| **Thu Jul 10** | Fix top 5 thumbs-down phrases from Supabase |
| **Fri Jul 11** | Email #3 waitlist; schedule launch week emails draft |
| **Sat Jul 12** | Collect 3 quotes from beta users (DM) for launch page |
| **Sun Jul 13** | Pre-launch checklist review |

---

## Campaign 4 — Pre-launch warm-up (Jul 14 – Jul 27)

**Description:** Create hype for Jul 28 founding launch. Still no LTD price in FB posts until Jul 21.

**To-do:**
- [ ] `/pricing` page (founding LTD — build before Jul 21)
- [ ] Stripe checkout live
- [ ] 3 testimonial quotes on landing
- [ ] 6 launch emails drafted
- [ ] 12 social posts scheduled

### Daily — Jul 14–20

| Day | Task |
|-----|------|
| **Mon Jul 14** | Blog #3; internal launch brief (price, offer, deadline) |
| **Tue Jul 15** | Stripe + pricing page QA |
| **Wed Jul 16** | Email beta users: “launching soon for waitlist” |
| **Thu Jul 17** | X thread: 5 scripts for hard moments |
| **Fri Jul 18** | FB post: “building in public” + waitlist |
| **Sat Jul 19** | Schedule Jul 28–Aug 3 posts in Buffer |
| **Sun Jul 20** | Draft all 6 launch emails in Loops |

### Daily — Jul 21–27 (launch week warm-up)

| Day | Task |
|-----|------|
| **Mon Jul 21** | Tease email: “Founding access opens Monday” |
| **Tue Jul 22** | Blog #4; update landing hero if needed |
| **Wed Jul 23** | Social proof on site; Trustpilot account created |
| **Thu Jul 24** | Email: “48 hours — founding group” |
| **Fri Jul 25** | Final beta fixes from feedback |
| **Sat Jul 26** | Test checkout end-to-end; Vercel redeploy |
| **Sun Jul 27** | Email: “Tomorrow — founding access”; rest |

---

## Campaign 5 — Founding launch (Jul 28 – Aug 3)

**7-day launch.** Founding LTD — lowest price, never again.

| Day | Email | Social | Other |
|-----|-------|--------|-------|
| **Mon Jul 28** | 🚀 Launch — cart open | Launch post X + FB | Monitor sales + support |
| **Tue Jul 29** | Story: why I built this | Script card | Reply every buyer |
| **Wed Jul 30** | FAQ email | Testimonial quote | Fix checkout bugs |
| **Thu Jul 31** | “Who it’s for” | FB group (allowed) | |
| **Fri Aug 1** | Social proof / # sold | X | |
| **Sat Aug 2** | “48 hours left” | — | |
| **Sun Aug 3** | Last day urgency | Close midnight | Turn off founding price |

---

## Campaign 6 — Post-launch (Aug 4 – Sep 30)

**Weekly rhythm (repeat):**
- **Mon:** Blog post
- **Tue–Thu:** Reddit 30 min/day + 1 FB touch
- **Fri:** Email to list (value, not always sell)
- **Ongoing:** Trustpilot invites to happy buyers (week 2+)

| Week | Focus |
|------|--------|
| Aug 4–10 | Thank buyers; collect 10 Trustpilot reviews |
| Aug 11–17 | Blog SEO; referral ask to buyers |
| Aug 18–24 | Content series: one behavior per week |
| Aug 25–31 | Survey: what category next? |
| Sep 1–30 | Grow list toward AppSumo; 2 blogs/week |

---

## Reddit search strings (daily scan)

- `foster parent what to say`
- `adoptive parent meltdown`
- `kinship caregiver hitting`
- `foster child not my real mom`
- `script calm down toddler`

---

## FB group post template (feedback, no LTD)

> Foster/adoptive/kinship parents — I’m building Phrasewell: exact “say this / do this” scripts when behavior gets big. I’m inviting a **small group** to test and leave feedback in the app. Join the waitlist if you want an invite: www.phrasewell.net

---

## Beta invite email template

> Subject: You’re in the Phrasewell test group  
>  
> Hi [name],  
>  
> You’re in our first small test group.  
>  
> App: https://www.phrasewell.net/app  
> Password: [BETA_APP_PASSWORD]  
>  
> Use it in a real hard moment if you can. Tap **Was this helpful?** on any phrase — that’s how we improve.  
>  
> Access is open for 14 days.  
>  
> — Courtney

---

## Metrics to track (weekly)

| Metric | Target by Jul 28 |
|--------|------------------|
| Waitlist signups | 200+ |
| Beta testers invited | 50–80 |
| Phrase feedback rows | 100+ |
| Thumbs-up rate | >70% |
| Founding LTD sales | Your call ($5K+ stretch) |
| Blog posts live | 4+ |

---

## Your next 3 actions (today)

1. **Supabase:** run `supabase/migrations/003_phrase_feedback.sql`  
2. **Vercel:** add env var `BETA_APP_PASSWORD` → redeploy  
3. **Loops or MailerLite:** create account + import waitlist CSV  

Then **git push** the code changes from this session.
