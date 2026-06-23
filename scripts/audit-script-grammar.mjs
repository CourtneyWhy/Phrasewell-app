import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "app", "data");
const FIELDS = ["say_this", "do_this", "helpful_note", "safety_note", "safety_step"];

const checks = [
  {
    id: "lowercase-i",
    test: (t) => /\bi\b/.test(t) && /\b(but|where|and|if|when|so|because|while|as|that) i\b/i.test(t),
  },
  {
    id: "no-capital-after-period",
    test: (t) => /\.\s+[a-z]/.test(t),
  },
  {
    id: "double-space",
    test: (t) => /  /.test(t),
  },
  {
    id: "space-before-punct",
    test: (t) => /\s[,.!?]/.test(t),
  },
  {
    id: "informal",
    test: (t) => /\b(gonna|wanna|gotta|kinda|sorta|okays|alrighty)\b/i.test(t),
  },
  {
    id: "then-vs-than",
    test: (t) => /\b(then|than) (more|less|better|worse|harder|easier|stronger)\b/i.test(t),
  },
  {
    id: "missing-apostrophe-contraction",
    test: (t) => /\b(dont|wont|cant|isnt|didnt|doesnt|shouldnt|couldnt|wouldnt|arent|havent|hasnt|wasnt|werent|youre|theyre|its)\b/i.test(t),
  },
  {
    id: "childs-possessive",
    test: (t) => /\bchilds\b/i.test(t),
  },
  {
    id: "affect-effect",
    test: (t) => /\beffect (you|them|the child|everyone)\b/i.test(t),
  },
];

const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
const findings = [];

for (const file of files) {
  const lib = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf8"));
  for (const card of lib.cards || []) {
    for (const field of FIELDS) {
      const t = card[field];
      if (!t || typeof t !== "string") continue;
      for (const check of checks) {
        if (check.test(t)) {
          findings.push({
            file,
            id: card.id ?? card.card_id,
            field,
            check: check.id,
            text: t,
          });
        }
      }
    }
  }
}

const summary = {};
for (const f of findings) summary[f.check] = (summary[f.check] || 0) + 1;
console.log("Summary:", summary);
console.log("Total:", findings.length);
for (const check of Object.keys(summary)) {
  console.log("\n---", check, "---");
  findings.filter((f) => f.check === check).slice(0, 8).forEach((f) => {
    console.log(f.id, "|", f.text.slice(0, 100));
  });
}
