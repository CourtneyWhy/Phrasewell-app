import type { Metadata } from "next";
import { LandingHeader } from "@/app/components/landing/LandingHeader";
import { LandingFooter } from "@/app/components/landing/LandingFooter";
import { BetaForm } from "@/app/components/landing/BetaForm";

export const metadata: Metadata = {
  title: "About — Phrasewell",
  description:
    "Phrasewell was built by Courtney, a foster-to-adopt mom who needed calm words in hard parenting moments — not more theory.",
};

export default function AboutPage() {
  return (
    <div className="landing-page blog-page">
      <LandingHeader />

      <main>
        <section className="blog-hero" aria-labelledby="about-heading">
          <div className="landing-container blog-hero-inner">
            <p className="landing-eyebrow">About Phrasewell</p>
            <h1 id="about-heading" className="blog-title font-heading">
              Built by a parent who needed the words
            </h1>
            <p className="blog-lead">
              Phrasewell gives foster, adoptive, and kinship parents exact scripts for hard behavior
              moments — when you know the theory but can&apos;t find the words.
            </p>
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-container blog-post-body">
            <div className="blog-prose">
              <h2 className="font-heading">Courtney&apos;s story</h2>
              <p>
                I&apos;m Courtney — a foster-to-adopt mom building Phrasewell from the moments that
                left me blank. When we adopted, I had read the books and taken the trainings. I
                understood trauma-informed parenting in theory.
              </p>
              <p>
                Then a child would melt down, lie, hoard food, or say &quot;you&apos;re not my real
                mom,&quot; and my brain would go empty. I didn&apos;t need another lecture in that
                second. I needed to know what to say — right now.
              </p>
              <p>
                That gap between what we learn and what we can access under stress is why Phrasewell
                exists. I built it for parents like me: overwhelmed, loving hard, and doing their
                best in real time.
              </p>

              <h2 className="font-heading">Our mission</h2>
              <p>
                Phrasewell is for the moments parenting books skip — hitting, food anxiety, bedtime
                battles, lying, stealing, sensory overload, defiance, and meltdowns. Each script
                gives you words to say, a simple next step, and a short note on why it helps.
              </p>
              <p>
                We&apos;re not replacing therapy, medical care, or your judgment. We&apos;re giving
                you something to read aloud when the moment is loud — so you can stay calmer and
                connected while you parent through hard stuff.
              </p>

              <div className="blog-callout">
                <strong>Who it&apos;s for:</strong> Foster, adoptive, kinship, and any parent who
                needs practical words when behavior gets big — not more guilt, not more theory.
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
