import type { SupabaseClient } from "@supabase/supabase-js";
import type { ViralSlideSpec } from "@/app/lib/growth/tiktok-viral";

export type GeneratedSlideImage = {
  slide: number;
  label: string;
  url: string;
};

function openaiKey() {
  return process.env.OPENAI_API_KEY?.trim() ?? null;
}

export function hasOpenAI() {
  return Boolean(openaiKey());
}

async function generateOneImage(prompt: string): Promise<string> {
  const key = openaiKey();
  if (!key) throw new Error("OPENAI_API_KEY is not set in Vercel.");

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: prompt.slice(0, 4000),
      size: "1024x1792",
      quality: "standard",
      response_format: "b64_json",
      n: 1,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI image error: ${err.slice(0, 200)}`);
  }

  const data = (await res.json()) as { data?: Array<{ b64_json?: string }> };
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI returned no image data.");
  return b64;
}

async function persistImage(
  db: SupabaseClient,
  draftDate: string,
  platform: string,
  slide: number,
  b64: string,
): Promise<string> {
  const path = `social/${draftDate}/${platform.toLowerCase()}-slide-${slide}.png`;
  const buffer = Buffer.from(b64, "base64");

  const { error } = await db.storage.from("growth-assets").upload(path, buffer, {
    contentType: "image/png",
    upsert: true,
  });

  if (!error) {
    const { data } = db.storage.from("growth-assets").getPublicUrl(path);
    if (data.publicUrl) return data.publicUrl;
  }

  return `data:image/png;base64,${b64}`;
}

export async function generateSlideImages(
  db: SupabaseClient,
  draftDate: string,
  platform: string,
  slides: ViralSlideSpec[],
  maxSlides = 6,
): Promise<GeneratedSlideImage[]> {
  const results: GeneratedSlideImage[] = [];
  const slice = slides.slice(0, maxSlides);

  for (const spec of slice) {
    const b64 = await generateOneImage(spec.dallePrompt);
    const url = await persistImage(db, draftDate, platform, spec.slide, b64);
    results.push({ slide: spec.slide, label: spec.label, url });
  }

  return results;
}
