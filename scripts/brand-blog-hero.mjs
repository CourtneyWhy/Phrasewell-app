import sharp from "sharp";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "public/images/blog/sobbing-meltdown-source.png");
const logoPath = join(root, "public/brand/mark.png");
const out = join(root, "public/images/blog/sobbing-meltdown.jpg");

const TARGET_WIDTH = 1400;
const photo = sharp(src);
const meta = await photo.metadata();
const height = Math.round((meta.height / meta.width) * TARGET_WIDTH);

const logoSize = 44;
const logo = await sharp(logoPath).resize(logoSize, logoSize).png().toBuffer();

const badgeSvg = Buffer.from(`<svg width="220" height="64" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="220" height="64" rx="32" fill="rgba(255,252,247,0.94)" stroke="rgba(28,25,23,0.08)" stroke-width="1"/>
  <text x="58" y="41" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-weight="600" fill="#1c1917">Phrasewell</text>
</svg>`);

await sharp(src)
  .resize(TARGET_WIDTH, height, { fit: "cover" })
  .composite([
    { input: badgeSvg, top: 28, left: 28 },
    { input: logo, top: 38, left: 38 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(out);

console.log("Wrote", out);
