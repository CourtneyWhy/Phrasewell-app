import type { BlogPostSection, InlinePart } from "@/app/lib/blog/types";

export function txt(value: string): InlinePart {
  return { type: "text", value };
}

export function strong(value: string): InlinePart {
  return { type: "strong", value };
}

export function link(value: string, href: string): InlinePart {
  return { type: "link", value, href };
}

export function p(...parts: InlinePart[]): BlogPostSection {
  return { type: "paragraph", parts };
}

export function h2(text: string): BlogPostSection {
  return { type: "heading", level: 2, text };
}

export function h3(text: string): BlogPostSection {
  return { type: "heading", level: 3, text };
}

export function quote(text: string, label?: string): BlogPostSection {
  return { type: "quote", text, label };
}

export function ul(...items: string[]): BlogPostSection {
  return { type: "list", items };
}

export function source(label: string, href: string): BlogPostSection {
  return { type: "source", label, href };
}

export function step(title: string, text: string): BlogPostSection {
  return { type: "step", title, text };
}

export function faq(question: string, ...answer: InlinePart[][]): BlogPostSection {
  return { type: "faq", question, answer };
}
