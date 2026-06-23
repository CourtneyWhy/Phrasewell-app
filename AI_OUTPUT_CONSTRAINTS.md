# AI Output Constraints for Script Generation

**GOAL**: Define a strict, predictable output contract for AI-generated scripts so responses are calm, short, usable, and safe in hard moments.

---

## A) REQUIRED OUTPUT FORMAT (STRICT)

The AI must return **ONLY** valid JSON.  
No markdown. No prose. No extra keys.

### Exact Schema:

```json
{
  "script": "string",
  "why": ["string", "string", "string?", "string?"],
  "safety_note": "string"
}
```

### Rules:

#### SCRIPT
- **1–3 sentences total**
- **18–55 words total** (hard limit)
- Written as **direct speech** a parent can say out loud
- Plain text only (no quotes, no emojis)

#### WHY
- **2–4 bullets only**
- Each bullet: **6–16 words**
- Practical explanations (what this does), not theory
- Calm, neutral language

#### SAFETY_NOTE
- Always present
- **1 sentence, 8–20 words**
- Must clearly state: not therapy, not diagnosis

---

## B) TONE RULES (STRICT)

### Must be:
- Calm
- Grounded
- Clear
- Non-judgmental
- Fast to read under stress

### Must NOT be:
- Moralizing
- Shaming
- Clinical
- Overly verbose
- "Parenting expert" voice

---

## C) BANNED LANGUAGE (ABSOLUTE)

Must **never** appear anywhere:

- discipline
- punish / punishment
- consequence
- manipulative
- attention-seeking
- spoiled
- bad behavior
- calm down
- always / never statements about the child

### No diagnosis language:
- ADHD
- ODD
- autism
- trauma response
- disorder
- pathology of any kind

---

## D) SAFETY & SCOPE LIMITS

The AI must **NOT**:
- Diagnose or imply a condition
- Shame the parent or child
- Suggest physical punishment or restraint
- Suggest humiliation or isolation as punishment
- Ask for personal or identifying information

### If the behavior involves safety risk:
- Script prioritizes immediate safety and clear limits
- Why bullets explain safety and regulation
- Safety note may gently suggest outside support

---

## E) PROMPT INPUTS (LOCKED — UPDATED)

The generator will receive **ONLY**:

- `categoryId` (string)
- `behaviorId` (string)
- `ageBand` (backend-derived enum)
- `variantSeed` (string, random per request)

### Age handling rules:

- The **USER does NOT select an age band**.
- The user provides a child age or birthdate (now or later).
- The backend maps the age to an internal `ageBand`.
- The AI **ONLY** sees the `ageBand`, never the raw age.

### Backend ageBand enum (FINAL):

- `"2-3"`
- `"4-5"`
- `"6-8"`
- `"9-12"`
- `"13-15"`
- `"16-18"`

### Purpose:
- Allow tone to adjust without adding user-facing complexity
- Avoid babyish language for teens
- Preserve calm authority for younger ages
- Keep UI simple in high-stress moments

---

## F) REQUIRED SAFETY FRAMING

Every response **MUST** include a `safety_note` that clearly says this is:
- a quick draft
- not therapy
- not a diagnosis

---

## G) SUCCESS CRITERIA

You should be able to answer **YES** to:
- Is this readable in under 10 seconds?
- Could a stressed parent say this out loud?
- Does this avoid therapist / expert vibes?
- Will "Generate another" reliably differ?

If **YES** → Step 7 is DONE.
