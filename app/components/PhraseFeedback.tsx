"use client";

import { useState } from "react";
import type { MomentCard } from "@/app/lib/contentLibrary";
import type { AgeBand, MomentId } from "@/app/lib/contentLibrary";

type PhraseFeedbackProps = {
  card: MomentCard;
  behaviorId: string;
  ageBand: AgeBand;
  momentId: MomentId;
};

const PROMPTS = {
  helpful: {
    label: "What worked well?",
    placeholder: "Optional — tell us what landed (tone, length, wording…)",
  },
  notHelpful: {
    label: "What should we change?",
    placeholder: "Optional — what felt off or missing for this moment?",
  },
} as const;

export function PhraseFeedback({ card, behaviorId, ageBand, momentId }: PhraseFeedbackProps) {
  const [rating, setRating] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function submit(helpful: boolean, text: string) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          helpful,
          comment: text,
          card_id: card.id,
          behavior_id: behaviorId,
          behavior_name: card.behavior_name,
          category_id: card.category_id,
          category_name: card.category_name,
          age_band: ageBand,
          moment_id: momentId,
          say_this: card.say_this,
          do_this: card.do_this,
          helpful_note: card.helpful_note,
          page_path: typeof window !== "undefined" ? window.location.pathname + window.location.search : null,
        }),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  function handleRating(helpful: boolean) {
    setRating(helpful);
    setComment("");
    setStatus("idle");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === null) return;
    void submit(rating, comment);
  }

  function handleSkip() {
    if (rating === null) return;
    void submit(rating, "");
  }

  if (status === "done") {
    return (
      <section
        className="app-card"
        style={{ marginTop: "var(--space-4)", padding: "var(--space-4)", textAlign: "center" }}
      >
        <p style={{ margin: 0, fontSize: 15, color: "var(--text)" }}>Thanks — this helps us improve.</p>
      </section>
    );
  }

  const prompt = rating === true ? PROMPTS.helpful : rating === false ? PROMPTS.notHelpful : null;

  return (
    <section className="app-card" style={{ marginTop: "var(--space-4)", padding: "var(--space-4)" }}>
      <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>
        Was this helpful?
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: rating === null ? 0 : 16 }}>
        <button
          type="button"
          onClick={() => handleRating(true)}
          aria-pressed={rating === true}
          style={{
            flex: 1,
            minHeight: 44,
            borderRadius: "var(--btn-radius)",
            border: rating === true ? "1px solid var(--accent)" : "1px solid var(--border)",
            background: rating === true ? "var(--accent-soft)" : "var(--surface)",
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
            color: "var(--text)",
          }}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => handleRating(false)}
          aria-pressed={rating === false}
          style={{
            flex: 1,
            minHeight: 44,
            borderRadius: "var(--btn-radius)",
            border: rating === false ? "1px solid var(--accent)" : "1px solid var(--border)",
            background: rating === false ? "var(--accent-soft)" : "var(--surface)",
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
            color: "var(--text)",
          }}
        >
          Not really
        </button>
      </div>

      {prompt ? (
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="phrase-feedback-comment"
            style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}
          >
            {prompt.label}
          </label>
          <textarea
            id="phrase-feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={prompt.placeholder}
            rows={3}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "var(--btn-radius)",
              border: "1px solid var(--border)",
              fontSize: 15,
              fontFamily: "inherit",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />

          {status === "error" ? (
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "#b42318" }}>
              Could not send feedback. Try again.
            </p>
          ) : null}

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button
              type="button"
              onClick={handleSkip}
              disabled={status === "submitting"}
              style={{
                flex: 1,
                minHeight: 44,
                borderRadius: "var(--btn-radius)",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                fontSize: 14,
                cursor: "pointer",
                color: "var(--muted)",
              }}
            >
              Skip
            </button>
            <button
              type="submit"
              className="app-btn-primary"
              disabled={status === "submitting"}
              style={{ flex: 1, minHeight: 44 }}
            >
              {status === "submitting" ? "Sending…" : "Send"}
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
