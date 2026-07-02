import type { InlinePart } from "@/app/lib/blog/types";

export function BlogInline({ parts }: { parts: InlinePart[] }) {
  return (
    <>
      {parts.map((part, i) => {
        if (part.type === "text") return <span key={i}>{part.value}</span>;
        if (part.type === "strong") return <strong key={i}>{part.value}</strong>;
        return (
          <a key={i} href={part.href} target="_blank" rel="noopener noreferrer">
            {part.value}
          </a>
        );
      })}
    </>
  );
}
