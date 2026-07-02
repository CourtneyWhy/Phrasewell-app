import type { Metadata } from "next";
import Image from "next/image";
import { LandingHeader } from "@/app/components/landing/LandingHeader";
import { LandingFooter } from "@/app/components/landing/LandingFooter";
import { BetaForm } from "@/app/components/landing/BetaForm";

export const metadata: Metadata = {
  title: "Meet the Founder — Phrasewell",
  description:
    "Courtney White built Phrasewell — calm, practical scripts for parents when hard moments hit and your brain goes blank.",
};

export default function AboutPage() {
  return (
    <div className="landing-page about-page">
      <LandingHeader />

      <main>
        <section className="about-hero" aria-labelledby="about-heading">
          <div className="landing-container about-hero-inner">
            <h1 id="about-heading" className="about-title font-heading">
              Meet the Founder
            </h1>
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-container">
            <div className="about-founder">
              <div className="about-founder-photo-wrap">
                <Image
                  src="/images/courtney-white-founder.png"
                  alt="Courtney White, founder of Phrasewell"
                  width={280}
                  height={280}
                  className="about-founder-photo"
                  priority
                />
              </div>
              <div className="about-founder-copy">
                <p className="about-founder-name font-heading">Courtney White, Founder</p>
                <p>
                  Product-minded operator with a background in AI, machine learning, product
                  management, and designing AI-assisted content systems.
                </p>
                <p>
                  Also an adoptive mom who knows the gap between how parents want to respond and
                  what they can actually reach for in a hard moment.
                </p>
                <p>
                  Phrasewell is built to feel simple, calm, and immediately useful — the kind of
                  tool that gives you steady words when your own brain is overloaded.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="beta" className="landing-section landing-beta-section" aria-labelledby="about-beta-heading">
          <div className="landing-container landing-section-centered">
            <div className="landing-card landing-beta-card">
              <h2 id="about-beta-heading" className="landing-beta-title font-heading">
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

      <LandingFooter />
    </div>
  );
}
