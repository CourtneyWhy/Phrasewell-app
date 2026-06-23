type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  /** Use as link instead of button */
  href?: string;
};

export function Button({
  children,
  variant = "primary",
  type = "button",
  disabled,
  onClick,
  className = "",
  href,
}: ButtonProps) {
  const baseClass = variant === "primary" ? "app-btn-primary" : "app-btn-secondary";
  const style =
    variant === "secondary"
      ? {
          height: "var(--btn-height)",
          padding: "0 var(--btn-padding-x)",
          borderRadius: "var(--btn-radius)",
          border: "1px solid var(--border)",
          background: "var(--bg)",
          color: "var(--text)",
          fontSize: "15px",
          fontWeight: 500,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
          transition: "box-shadow 0.18s ease",
        }
      : undefined;

  const content = <>{children}</>;

  const focusRingClass = "focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--ring)]";
  const activeRingClass = "active:not(:disabled):shadow-[0_0_0_1px_var(--accent-pressed)]";
  const classes = `${baseClass} ${variant === "secondary" ? focusRingClass + " " + activeRingClass : ""} ${className}`.trim();

  if (href != null && !disabled) {
    return (
      <a href={href} className={classes} style={style}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes} style={style}>
      {content}
    </button>
  );
}
