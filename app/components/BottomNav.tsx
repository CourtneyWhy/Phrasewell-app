"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, Settings } from "lucide-react";

const NAV_HEIGHT = 72;
const INACTIVE_OPACITY = 0.6;

const items = [
  { href: "/app", label: "Home", Icon: Home },
  { href: "/app/search", label: "Search", Icon: Search },
  { href: "/app/saved", label: "Saved", Icon: Heart },
  { href: "/app/settings", label: "Settings", Icon: Settings },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="bottom-nav"
      style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        width: "100%",
        height: NAV_HEIGHT,
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
      }}
      role="navigation"
      aria-label="Main"
    >
      {items.map(({ href, label, Icon }) => {
        const active = pathname === href || (href !== "/app" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className="flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] rounded-lg"
            style={{
              color: active ? "var(--accent)" : "var(--text)",
              opacity: active ? 1 : INACTIVE_OPACITY,
              borderBottom: active ? "1px solid var(--accent)" : "1px solid transparent",
            }}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={22} strokeWidth={1.5} />
            <span style={{ fontFamily: "var(--font-body), Inter, sans-serif", fontSize: "12px", fontWeight: 500 }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
