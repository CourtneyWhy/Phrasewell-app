"use client";

import {
  ACCESS_STRATEGY,
  BATCH_WORKFLOWS,
  GOTCHA_PITCH,
  GOTCHA_PITCH_LONG,
  LAUNCH_TOOLS,
  PRE_LAUNCH_EMAIL_MILESTONES,
  PRICING_MODEL,
  X_MARKETING_ANGLES,
} from "@/app/lib/growth/launch-strategy";
import { CopyBtn } from "./shared";

export function ToolsTab() {
  return (
    <section className="growth-tools">
      <div className="growth-card growth-card-accent">
        <h2>Gotcha pitch — use everywhere</h2>
        <p className="growth-gotcha-pitch">{GOTCHA_PITCH}</p>
        <p className="growth-muted">{GOTCHA_PITCH_LONG}</p>
        <CopyBtn text={GOTCHA_PITCH} label="Copy pitch" />
      </div>

      <div className="growth-card">
        <h2>Access before launch</h2>
        <ul className="growth-list">
          <li><strong>Waitlist:</strong> {ACCESS_STRATEGY.waitlist}</li>
          <li><strong>Micro-beta (≤25):</strong> {ACCESS_STRATEGY.microBeta}</li>
          <li><strong>Social / public:</strong> {ACCESS_STRATEGY.publicSocial}</li>
          <li><strong>LTD buyers:</strong> {ACCESS_STRATEGY.ltdBuyers}</li>
        </ul>
      </div>

      <div className="growth-card">
        <h2>Pricing</h2>
        <p className="growth-muted">
          Foster families are often middle-class — offer monthly after launch for those who miss LTD.
          No free trial during the LTD window.
        </p>
        <table className="growth-table growth-table-compact">
          <thead>
            <tr>
              <th>Tier</th>
              <th>Price</th>
              <th>What</th>
            </tr>
          </thead>
          <tbody>
            {PRICING_MODEL.tiers.map((t) => (
              <tr key={t.id}>
                <td><strong>{t.name}</strong></td>
                <td>${t.price} lifetime</td>
                <td>{t.description}</td>
              </tr>
            ))}
            <tr>
              <td><strong>Monthly</strong></td>
              <td>${PRICING_MODEL.postLaunchSubscription.monthly}/mo</td>
              <td>Starts {PRICING_MODEL.postLaunchSubscription.starts} — {PRICING_MODEL.postLaunchSubscription.trialDays}-day trial on monthly only</td>
            </tr>
          </tbody>
        </table>
        <ul className="growth-list growth-list-compact">
          {PRICING_MODEL.rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>

      <div className="growth-card">
        <h2>UGC reel recipe (screenshot → video)</h2>
        <ol className="growth-playbook-steps">
          <li><strong>Content Engine</strong> → pick 1 behavior → copy Say this / hook.</li>
          <li><strong>Screenshot</strong> Moment Card from app or phrasewell.net demo rotator.</li>
          <li><strong>Canva</strong> → Video → Slideshow (5 slides): hook → problem → screenshot → “Tap behavior” → CTA waitlist. Export MP4.</li>
          <li><strong>CapCut</strong> → import MP4 or slides → record your voice reading the script → Auto captions → Export.</li>
          <li><strong>Buffer</strong> → queue to TikTok + IG (Wed + Sat). Same file, two platforms.</li>
        </ol>
        <p className="growth-muted">~30 min per reel once you have a Canva template saved.</p>
      </div>

      <div className="growth-card">
        <h2>Tools — exact stack</h2>
        <table className="growth-table">
          <thead>
            <tr>
              <th>Tool</th>
              <th>Cost</th>
              <th>Use</th>
            </tr>
          </thead>
          <tbody>
            {LAUNCH_TOOLS.map((t) => (
              <tr key={t.name}>
                <td>
                  {t.url ? (
                    <a href={t.url} target="_blank" rel="noopener noreferrer">{t.name}</a>
                  ) : (
                    t.name
                  )}
                  <div className="growth-muted" style={{ fontSize: 12 }}>{t.category}</div>
                </td>
                <td>{t.cost}</td>
                <td>{t.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="growth-card">
        <h2>Work-ahead batches (busy days / free days)</h2>
        <p className="growth-muted">Skip daily tasks when you can&apos;t — batch on good days instead.</p>
        {BATCH_WORKFLOWS.map((w) => (
          <div key={w.id} className="growth-batch-block">
            <h3>{w.title} <span className="growth-muted">(~{w.minutes} min)</span></h3>
            <ol className="growth-playbook-steps">
              {w.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="growth-card">
        <h2>Email milestones (accelerated — start now)</h2>
        <table className="growth-table growth-table-compact">
          <thead>
            <tr>
              <th>Week</th>
              <th>Focus</th>
              <th>App?</th>
              <th>Price?</th>
            </tr>
          </thead>
          <tbody>
            {PRE_LAUNCH_EMAIL_MILESTONES.map((m) => (
              <tr key={m.week}>
                <td>{m.week}</td>
                <td>{m.focus}</td>
                <td>{m.showApp ? "Yes" : "No"}</td>
                <td>{m.showPrice ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="growth-card">
        <h2>X post angles — marketing (not vibe-coding)</h2>
        <p className="growth-muted">Post daily when you can. Heavy on parenting marketing — light on tech stack.</p>
        <ul className="growth-list">
          {X_MARKETING_ANGLES.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
