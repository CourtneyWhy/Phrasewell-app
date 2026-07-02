import { BetaForm } from "@/app/components/landing/BetaForm";

type BlogBetaSectionProps = {
  id?: string;
  compact?: boolean;
};

export function BlogBetaSection({ id = "beta", compact = false }: BlogBetaSectionProps) {
  return (
    <section
      className={`blog-signup-banner${compact ? " blog-signup-banner-compact" : ""}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="landing-container">
        <div className="landing-card blog-signup-card">
          {!compact ? <p className="landing-eyebrow">Early access</p> : null}
          <h2 id={`${id}-heading`} className="blog-signup-title font-heading">
            Join the beta
          </h2>
          <p className="blog-signup-lead">
            Get calm scripts in the app — we&apos;re inviting foster, adoptive, and kinship parents in
            small groups.
          </p>
          <BetaForm />
        </div>
      </div>
    </section>
  );
}
