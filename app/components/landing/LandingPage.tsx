import { LandingHeader } from "@/app/components/landing/LandingHeader";
import { DemoPhraseCard } from "@/app/components/landing/DemoPhraseCard";
import { BetaForm } from "@/app/components/landing/BetaForm";
import { LandingLogo } from "@/app/components/landing/LandingLogo";

const THEORY_CARDS = [
  "When your child is screaming",
  "When they refuse, lie, hit, or bolt",
  "When you want to stay calm but feel triggered",
] as const;

const HOW_IT_WORKS = [
  {
    num: "01",
    title: "Choose what is happening",
    body: "Select the behavior in front of you right now.",
  },
  {
    num: "02",
    title: "Select your child's age",
    body: "Phrasewell tunes the wording to fit.",
  },
  {
    num: "03",
    title: "Get calm words and a next step",
    body: "Read it aloud. Take a breath. Try it.",
  },
] as const;

const WHAT_YOU_GET = [
  {
    num: "01",
    title: "Say this",
    body: "Exact words to read out loud in the moment.",
  },
  {
    num: "02",
    title: "Do this",
    body: "A simple, body-level next step that fits.",
  },
  {
    num: "03",
    title: "Helpful note",
    body: "Short context for why this approach works.",
  },
  {
    num: "04",
    title: "Show another phrase",
    body: "Try a different angle when the first doesn't land.",
  },
] as const;

const MOMENT_TAGS = [
  "Hitting or kicking",
  "Meltdowns",
  "Defiance",
  "Bedtime struggles",
  "Food anxiety",
  "Lying",
  "Stealing",
  "Sensory struggles",
  "Running away / bolting",
] as const;

export function LandingPage() {
  return (
    <div className="landing-page">
      <LandingHeader />

      <main>
        {/* Hero */}
        <section className="landing-hero" aria-labelledby="landing-hero-heading">
          <div className="landing-container landing-hero-inner">
            <p className="landing-beta-pill">
              <span className="landing-beta-dot" aria-hidden />
              Now in private beta
            </p>

            <h1 id="landing-hero-heading" className="landing-hero-title font-heading">
              Know what to say when the moment gets hard.
            </h1>

            <p className="landing-hero-sub">
              Phrasewell gives parents calm scripts, simple next steps, and helpful notes when
              behavior gets big.
            </p>

            <div className="landing-hero-ctas">
              <a href="#beta" className="landing-btn landing-btn-primary">
                Join the beta
              </a>
              <a href="#how-it-works" className="landing-btn landing-btn-secondary">
                See how it works
              </a>
            </div>

            <p className="landing-hero-note">
              Built for foster, adoptive, kinship, and overwhelmed parents who need support in the
              moment.
            </p>

            <DemoPhraseCard />
          </div>
        </section>

        {/* Theory gap */}
        <section className="landing-section" aria-labelledby="theory-heading">
          <div className="landing-container landing-section-centered">
            <h2 id="theory-heading" className="landing-section-title landing-section-title-wide font-heading">
              For the moments when you know the theory, but can&apos;t find the words.
            </h2>
            <div className="landing-theory-grid">
              {THEORY_CARDS.map((text) => (
                <div key={text} className="landing-card landing-theory-card">
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="landing-section"
          aria-labelledby="how-heading"
        >
          <div className="landing-container landing-section-centered">
            <p className="landing-eyebrow">How it works</p>
            <h2 id="how-heading" className="landing-section-title font-heading">
              Three small steps to calmer words.
            </h2>
            <div className="landing-steps-grid">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.num} className="landing-card landing-step-card">
                  <span className="landing-card-num">{step.num}</span>
                  <h3 className="landing-card-title">{step.title}</h3>
                  <p className="landing-card-body">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What you get */}
        <section
          id="what-you-get"
          className="landing-section"
          aria-labelledby="get-heading"
        >
          <div className="landing-container landing-section-centered">
            <p className="landing-eyebrow">What you get</p>
            <h2 id="get-heading" className="landing-section-title font-heading">
              Everything you need in the moment.
            </h2>
            <div className="landing-features-grid">
              {WHAT_YOU_GET.map((item) => (
                <div key={item.num} className="landing-card landing-feature-card">
                  <span className="landing-card-num">{item.num}</span>
                  <h3 className="landing-card-title">{item.title}</h3>
                  <p className="landing-card-body">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Moments */}
        <section id="moments" className="landing-section" aria-labelledby="moments-heading">
          <div className="landing-container">
            <div className="landing-card landing-moments-panel">
              <div className="landing-section-centered">
                <p className="landing-eyebrow">Built for hard moments</p>
                <h2 id="moments-heading" className="landing-section-title font-heading">
                  Made for the moments parenting books skip.
                </h2>
              </div>
              <div className="landing-tags">
                {MOMENT_TAGS.map((tag) => (
                  <span key={tag} className="landing-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Beta form */}
        <section id="beta" className="landing-section landing-beta-section" aria-labelledby="beta-heading">
          <div className="landing-container landing-section-centered">
            <div className="landing-card landing-beta-card">
              <h2 id="beta-heading" className="landing-beta-title font-heading">
                Join the beta
              </h2>
              <p className="landing-beta-sub">
                Try Phrasewell and help shape the app before public launch.
              </p>
              <p className="landing-beta-invite">
                We&apos;re inviting early testers in small groups.
              </p>
              <BetaForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-container">
          <p className="landing-disclaimer">
            Phrasewell offers quick phrases for tough parenting moments. It is not therapy, medical
            advice, legal advice, or a diagnosis. If anyone may be seriously hurt, seek immediate
            local emergency support.
          </p>
          <div className="landing-footer-bar">
            <a href="#" className="landing-logo landing-footer-logo" aria-label="Phrasewell home">
              <LandingLogo height={26} />
            </a>
            <p className="landing-footer-tagline">
              Quick phrases for tough moments. Not therapy or a diagnosis.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
