type LandingLogoProps = {
  /** Icon height in px — vessel mark only, wordmark is live text. */
  iconSize?: number;
  /** Slightly smaller wordmark for footer. */
  compact?: boolean;
};

/** Horizontal lockup: large vessel icon + Phrasewell wordmark as HTML text (Lora). */
export function LandingLogo({ iconSize = 42, compact = false }: LandingLogoProps) {
  return (
    <span className="landing-logo-lockup">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/mark.png"
        alt=""
        aria-hidden
        className="landing-logo-mark"
        height={iconSize}
        width={iconSize}
      />
      <span
        className="font-heading landing-wordmark"
        style={{ fontSize: compact ? "1.125rem" : "1.375rem" }}
      >
        Phrasewell
      </span>
    </span>
  );
}
