import type { MomentCard } from "@/app/lib/contentLibrary";
import { getSafetyStep } from "@/app/lib/contentLibrary";

function DoThisIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

type MomentCardViewProps = {
  card: MomentCard;
  fadeIn?: boolean;
  saveControl?: React.ReactNode;
};

export function MomentCardView({ card, fadeIn = true, saveControl }: MomentCardViewProps) {
  const safetyStep = getSafetyStep(card);

  return (
    <>
      <section style={{ marginTop: 20 }}>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8, fontWeight: 600 }}>
          Say this
        </p>
        <div
          className="app-card"
          style={{
            position: "relative",
            padding: "28px 24px",
            borderLeft: "3px solid var(--sand-border)",
            opacity: fadeIn ? 1 : 0,
            transition: "opacity 0.22s ease-in-out",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <p
              className="font-heading font-normal"
              style={{
                flex: 1,
                minWidth: 0,
                fontSize: "clamp(22px, 4vw, 26px)",
                lineHeight: 1.5,
                color: "var(--text)",
                margin: 0,
              }}
            >
              {card.say_this}
            </p>
            {saveControl}
          </div>
        </div>
      </section>

      {safetyStep && (
        <section
          className="app-card"
          style={{
            padding: "var(--space-4)",
            marginTop: "var(--space-4)",
            borderLeft: "3px solid var(--safety-outline)",
            background: "rgba(197, 48, 48, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "var(--safety-outline)" }}>
              <ShieldIcon />
            </span>
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
              Safety step
            </span>
          </div>
          <p style={{ marginTop: 12, marginBottom: 0, fontSize: 15, lineHeight: 1.5, color: "var(--text)", fontWeight: 500 }}>
            {safetyStep}
          </p>
        </section>
      )}

      {card.do_this && (
        <section className="app-card" style={{ padding: "var(--space-4)", marginTop: "var(--space-4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "var(--muted)" }}>
              <DoThisIcon />
            </span>
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
              Do this
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 12, fontSize: 15, lineHeight: 1.5, color: "var(--text)" }}>
            <span style={{ color: "var(--muted)" }}>
              <CheckIcon />
            </span>
            <span>{card.do_this}</span>
          </div>
        </section>
      )}

      {card.helpful_note && (
        <section className="app-card" style={{ marginTop: "var(--space-4)", padding: "var(--space-4)" }}>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8, fontWeight: 600 }}>
            Helpful note
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.5, color: "var(--muted)", margin: 0 }}>
            {card.helpful_note}
          </p>
        </section>
      )}
    </>
  );
}
