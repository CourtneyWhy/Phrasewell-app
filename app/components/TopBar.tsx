import Link from "next/link";

type TopBarProps = {
  title?: string;
  backHref?: string;
  backLabel?: string;
  rightAction?: React.ReactNode;
  /** Optional node below the main row (e.g. selected child name) */
  subtitle?: React.ReactNode;
};

export function TopBar({ title, backHref, backLabel = "Back", rightAction, subtitle }: TopBarProps) {
  return (
    <header
      className="border-b bg-[var(--bg)]"
      style={{ borderColor: "var(--border)", paddingTop: "var(--space-3)", paddingBottom: "var(--space-3)" }}
    >
      <div className="app-container flex min-h-[44px] items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {backHref != null && (
            <Link
              href={backHref}
              className="app-link-muted shrink-0"
              style={{ fontSize: "14px" }}
            >
              ← {backLabel}
            </Link>
          )}
          {title != null && title !== "" && (
            <h1
              className="font-heading truncate font-normal text-[var(--text)]"
              style={{ fontSize: "20px" }}
            >
              {title}
            </h1>
          )}
        </div>
        {rightAction != null && <div className="shrink-0">{rightAction}</div>}
      </div>
      {subtitle != null && (
        <div className="app-container mt-1" style={{ paddingTop: 0 }}>
          {subtitle}
        </div>
      )}
    </header>
  );
}
