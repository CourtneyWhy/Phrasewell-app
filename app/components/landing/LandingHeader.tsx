import Link from "next/link";
import { LandingLogo } from "@/app/components/landing/LandingLogo";

const NAV_LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#what-you-get", label: "What you get" },
  { href: "/#moments", label: "Moments" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
] as const;

export function LandingHeader() {
  return (
    <header className="landing-header">
      <div className="landing-header-inner">
        <Link href="/" className="landing-logo" aria-label="Phrasewell home">
          <LandingLogo iconSize={48} />
        </Link>

        <nav className="landing-nav" aria-label="Page sections">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="landing-nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/#beta" className="landing-btn landing-btn-primary landing-btn-sm landing-header-cta">
          Join the beta
        </Link>
      </div>
    </header>
  );
}
