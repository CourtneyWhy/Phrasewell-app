import { BrandMark } from "@/app/components/BrandMark";

type WordmarkLockupProps = {
  markSize?: number;
  titleSize?: number;
  tagline?: string;
};

/** Horizontal lockup: brand mark + Phrasewell wordmark. */
export function WordmarkLockup({
  markSize = 32,
  titleSize = 22,
  tagline = "Exact language for hard moments.",
}: WordmarkLockupProps) {
  return (
    <header style={{ paddingTop: "var(--space-3)", paddingBottom: "var(--space-2)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <BrandMark size={markSize} />
        <h1
          className="font-heading font-normal"
          style={{
            fontSize: titleSize,
            color: "var(--text)",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Phrasewell
        </h1>
      </div>
      {tagline ? (
        <p
          style={{
            fontSize: 13,
            color: "var(--muted)",
            marginTop: 6,
            marginBottom: 0,
            paddingLeft: markSize + 10,
          }}
        >
          {tagline}
        </p>
      ) : null}
    </header>
  );
}
