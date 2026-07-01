import { BetaForm } from "@/app/components/landing/BetaForm";

export function BlogSignupBanner() {
  return (
    <section className="blog-signup-banner" aria-labelledby="blog-signup-heading">
      <div className="landing-container">
        <div className="landing-card blog-signup-card">
          <p className="landing-eyebrow">Early access</p>
          <h2 id="blog-signup-heading" className="blog-signup-title font-heading">
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
