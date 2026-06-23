"use client";

import { useState } from "react";
import { LANDING_DEMO_PHRASES } from "@/app/lib/landing-demo-phrases";

export function DemoPhraseCard() {
  const [index, setIndex] = useState(0);
  const phrase = LANDING_DEMO_PHRASES[index];

  function showAnother() {
    setIndex((i) => (i + 1) % LANDING_DEMO_PHRASES.length);
  }

  return (
    <div className="landing-demo-card">
      <div className="landing-demo-card-header">
        <span className="landing-demo-moment">{phrase.moment}</span>
        <span className="landing-demo-badge">Phrasewell</span>
      </div>

      <div className="landing-demo-section">
        <p className="landing-demo-label">Say this</p>
        <p className="landing-demo-quote font-heading">&ldquo;{phrase.sayThis}&rdquo;</p>
      </div>

      <div className="landing-demo-section">
        <p className="landing-demo-label">Do this</p>
        <p className="landing-demo-body">{phrase.doThis}</p>
      </div>

      <div className="landing-demo-section">
        <p className="landing-demo-label">Helpful note</p>
        <p className="landing-demo-body">{phrase.helpfulNote}</p>
      </div>

      <button type="button" className="landing-btn landing-btn-ghost landing-btn-full" onClick={showAnother}>
        Show another phrase
      </button>
    </div>
  );
}
