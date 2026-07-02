import type { BlogPostSection } from "@/app/lib/blog/types";
import { BlogInline } from "@/app/components/blog/BlogInline";

export function BlogPostContent({ sections }: { sections: BlogPostSection[] }) {
  return (
    <div className="blog-prose">
      {sections.map((section, index) => {
        switch (section.type) {
          case "paragraph":
            return (
              <p key={index}>
                <BlogInline parts={section.parts} />
              </p>
            );
          case "heading":
            if (section.level === 3) {
              return (
                <h3 key={index} className="blog-prose-h3 font-heading">
                  {section.text}
                </h3>
              );
            }
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
          case "source":
            return (
              <p key={index} className="blog-source">
                Source:{" "}
                <a href={section.href} target="_blank" rel="noopener noreferrer">
                  {section.label}
                </a>
              </p>
            );
          case "step":
            return (
              <div key={index} className="blog-step">
                <p className="blog-step-title">
                  <strong>{section.title}</strong>
                </p>
                <p className="blog-step-text">&ldquo;{section.text}&rdquo;</p>
              </div>
            );
          case "faq":
            return (
              <div key={index} className="blog-faq-item">
                <h3 className="blog-prose-h3 font-heading">{section.question}</h3>
                {section.answer.map((parts, i) => (
                  <p key={i}>
                    <BlogInline parts={parts} />
                  </p>
                ))}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
