type CardProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: "div" | "section" | "article" | "header";
  /** Use slightly larger radius (16px) when true */
  largeRadius?: boolean;
};

export function Card({ children, className = "", style = {}, as: Component = "div", largeRadius }: CardProps) {
  return (
    <Component
      className={`app-card ${className}`.trim()}
      style={{
        padding: "var(--space-4) var(--space-3)",
        borderRadius: largeRadius ? "var(--card-radius-lg)" : "var(--card-radius)",
        ...style,
      }}
    >
      {children}
    </Component>
  );
}
