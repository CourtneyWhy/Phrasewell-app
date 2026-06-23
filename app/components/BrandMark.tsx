/** Official brand mark PNG — do not substitute with SVG approximations. */
export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/mark.png"
      alt=""
      width={size}
      height={size}
      aria-hidden
      style={{ flexShrink: 0, width: size, height: size, display: "block" }}
    />
  );
}
