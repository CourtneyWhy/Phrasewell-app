export type BlogPostSection =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; label?: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTimeMinutes: number;
  sections: BlogPostSection[];
};
