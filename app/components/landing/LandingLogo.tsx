/** Official horizontal lockup — mark + Phrasewell wordmark. */
export function LandingLogo({ height = 32 }: { height?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/lockup.png"
      alt="Phrasewell"
      height={height}
      style={{
        display: "block",
        height,
        width: "auto",
        flexShrink: 0,
      }}
    />
  );
}
