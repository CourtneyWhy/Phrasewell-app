import Link from "next/link";
import { LandingHeader } from "@/app/components/landing/LandingHeader";
import { LandingLogo } from "@/app/components/landing/LandingLogo";

export function BlogShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="landing-page blog-page">
      <LandingHeader />

      <main>{children}</main>

      <footer className="landing-footer">
        <div className="landing-container">
          <p className="landing-disclaimer">
            Phrasewell offers quick phrases for tough parenting moments. It is not therapy, medical
            advice, legal advice, or a diagnosis. If anyone may be seriously hurt, seek immediate
            local emergency support.
          </p>
          <div className="landing-footer-bar">
            <Link href="/" className="landing-logo landing-footer-logo" aria-label="Phrasewell home">
              <LandingLogo iconSize={34} compact />
            </Link>
            <div className="blog-footer-links">
              <Link href="/blog" className="blog-footer-link">
                Parenting scripts
              </Link>
              <Link href="/#beta" className="blog-footer-link">
                Join the beta
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function formatPublishedDate(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export { formatPublishedDate };
