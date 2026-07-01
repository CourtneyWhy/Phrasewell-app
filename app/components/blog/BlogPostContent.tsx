import type { BlogPostSection } from "@/app/lib/blog/types";

export function BlogPostContent({ sections }: { sections: BlogPostSection[] }) {
  return (
    <div className="blog-prose">
      {sections.map((section, index) => {
        switch (section.type) {
          case "paragraph":
            return <p key={index}>{section.text}</p>;
          case "heading":
            return (
              <h2 key={index} className="font-heading">
                {section.text}
              </h2>
            );
          case "quote":
            return (
              <figure key={index} className="blog-quote">
                {section.label ? (
                  <figcaption className="blog-quote-label">{section.label}</figcaption>
                ) : null}
                <blockquote>&ldquo;{section.text}&rdquo;</blockquote>
              </figure>
            );
          case "list":
            return (
              <ul key={index}>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <aside key={index} className="blog-callout">
                {section.text}
              </aside>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
