import Link from "next/link";
import { LandingLogo } from "@/app/components/landing/LandingLogo";

export function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-container">
        <p className="landing-disclaimer">
          Phrasewell offers quick phrases for tough parenting moments. It is not therapy, medical
          advice, legal advice, or a diagnosis. If anyone may be seriously hurt, seek immediate local
          emergency support.
        </p>
        <div className="landing-footer-bar">
          <Link href="/" className="landing-logo landing-footer-logo" aria-label="Phrasewell home">
            <LandingLogo iconSize={34} compact />
          </Link>
          <div className="blog-footer-links">
            <Link href="/blog" className="blog-footer-link">
              Blog
            </Link>
            <Link href="/about" className="blog-footer-link">
              About
            </Link>
            <p className="landing-footer-tagline">
              Quick phrases for tough moments. Not therapy or a diagnosis.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
