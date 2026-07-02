export type InlinePart =
  | { type: "text"; value: string }
  | { type: "strong"; value: string }
  | { type: "link"; value: string; href: string };

export type BlogPostSection =
  | { type: "paragraph"; parts: InlinePart[] }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "quote"; text: string; label?: string }
  | { type: "list"; items: string[] }
  | { type: "source"; label: string; href: string }
  | { type: "step"; title: string; text: string }
  | { type: "faq"; question: string; answer: InlinePart[][] };

export type BlogAuthor = {
  name: string;
  role: string;
  avatar: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  image: string;
  imageAlt: string;
  author: BlogAuthor;
  sections: BlogPostSection[];
};
