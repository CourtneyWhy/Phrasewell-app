import Link from "next/link";

type ListRowProps = {
  href: string;
  title: string;
  descriptor?: string;
  showChevron?: boolean;
  /** When true, adds top border (e.g. first row in list) */
  first?: boolean;
};

function Chevron() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, opacity: 0.5, color: "var(--muted)" }}
      aria-hidden
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function ListRow({ href, title, descriptor, showChevron = true, first }: ListRowProps) {
  return (
    <Link
      href={href}
      className={`list-row ${first ? "first" : ""}`}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <span className="font-medium" style={{ fontSize: "17px", color: "var(--text)" }}>
          {title}
        </span>
        {descriptor != null && descriptor !== "" && (
          <p style={{ marginTop: 2, fontSize: "13px", color: "var(--muted)" }}>
            {descriptor}
          </p>
        )}
      </div>
      {showChevron && <Chevron />}
    </Link>
  );
}
