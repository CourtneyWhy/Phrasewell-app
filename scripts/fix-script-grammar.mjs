/**
 * Fix spelling/grammar in displayed Moment Card fields across content libraries.
 * Applies Microsoft Style Guide basics: capitalize I, trim spacing, fix common typos.
 * Does NOT modify search_terms, tags, or aliases (parent-typed retrieval text).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "app", "data");

const DISPLAY_FIELDS = ["say_this", "do_this", "helpful_note", "safety_note", "safety_step"];

/** Fix lowercase pronoun I in running text. */
function fixCapitalI(text) {
  return text
    .replace(/(^|[.!?]\s+|[,;]\s+|\s)i(\s|'|[,.!?]|$)/g, (match, before, after) => {
      // Skip inside words like "inside" - the pattern requires word boundary via space/punct
      if (before === undefined) return match;
      return `${before}I${after}`;
    })
    .replace(/^i(\s|'|[,.!?])/g, "I$1");
}

const PHRASE_REPLACEMENTS = [
  [
    /The app['\u2019]s job here is not punishment\. It is helping the adult stop the pattern before it becomes a bigger conflict\./g,
    "This moment is not about punishment. Focus on stopping the pattern before it becomes a bigger conflict.",
  ],
  [
    /The script works best when the adult['\u2019]s body matches the words: slower voice, fewer movements, and no rushing to solve\./g,
    "These words work best when your body matches them: slower voice, fewer movements, and no rushing to solve.",
  ],
  [
    /This keeps the adult from treating the child like the problem\. The behavior gets corrected while the relationship stays intact\./g,
    "This keeps you from treating the child like the problem. Correct the behavior while keeping the relationship intact.",
  ],
  [
    /When taking is active or secretive, the adult protects the item and reduces the audience\./g,
    "When taking is active or secretive, protect the item and reduce the audience.",
  ],
  [
    /When a behavior becomes unsafe or unmanageable, the adult's job is to reduce risk before teaching\./g,
    "When a behavior becomes unsafe or unmanageable, your job is to reduce risk before teaching.",
  ],
  [
    /This age often needs the adult to make the repair path simple and concrete\./g,
    "At this age, keep the repair path simple and concrete.",
  ],
];

const REPLACEMENTS = [
  [/\s{2,}/g, " "],
  [/\s+([,.!?])/g, "$1"],
  [/\.\s*\./g, "."],
  [/\bthier\b/gi, "their"],
  [/\brecieve\b/gi, "receive"],
  [/\boccured\b/gi, "occurred"],
  [/\bseperate\b/gi, "separate"],
  [/\bdefinately\b/gi, "definitely"],
  [/\buntill\b/gi, "until"],
  [/\balot\b/gi, "a lot"],
  [/\bteh\b/gi, "the"],
];

function polishField(text) {
  if (!text || typeof text !== "string") return text;
  let out = text.trim();
  for (const [from, to] of PHRASE_REPLACEMENTS) {
    out = out.replace(from, to);
  }
  for (const [re, rep] of REPLACEMENTS) {
    out = out.replace(re, rep);
  }
  out = fixCapitalI(out);
  // Normalize curly apostrophes/quotes in displayed parent-facing copy.
  out = out.replace(/\u2019/g, "'").replace(/\u2018/g, "'").replace(/\u201c/g, '"').replace(/\u201d/g, '"');
  return out;
}

function processLibrary(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const lib = JSON.parse(raw);
  const changes = [];

  for (const card of lib.cards || []) {
    for (const field of DISPLAY_FIELDS) {
      const before = card[field];
      if (before == null || typeof before !== "string" || before.trim() === "") continue;
      const after = polishField(before);
      if (after !== before) {
        changes.push({
          id: card.id ?? card.card_id,
          field,
          before,
          after,
        });
        card[field] = after;
      }
    }
  }

  if (changes.length > 0) {
    fs.writeFileSync(filePath, `${JSON.stringify(lib, null, 2)}\n`, "utf8");
  }
  return changes;
}

const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
let total = 0;
const report = [];

for (const file of files) {
  const filePath = path.join(DATA_DIR, file);
  const changes = processLibrary(filePath);
  total += changes.length;
  if (changes.length) report.push({ file, count: changes.length, samples: changes.slice(0, 5) });
}

console.log(JSON.stringify({ filesProcessed: files.length, totalChanges: total, report }, null, 2));
