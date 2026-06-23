"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getCategoryById, getBehaviorById } from "@/app/lib/behavior-catalog";
import {
  type MomentId,
  type AgeBand,
  type MomentCard,
  normalizeAgeBand,
  intensityToMomentId,
  hasApprovedContent,
  getCardById,
  getDefaultCard,
  getAnotherCard,
  getVariantCount,
} from "@/app/lib/contentLibrary";
import { MOMENT_CONTEXT_HEADER, MOMENT_OPTIONS } from "@/app/lib/moments";
import { getAppDefaults, setAppDefaults, buildCategoryHref } from "@/app/lib/app-defaults";
import { HelpTopBar } from "@/app/components/HelpTopBar";
import { AgeSelector } from "@/app/components/AgeSelector";
import { MomentCardView } from "@/app/components/MomentCardView";
import { SaveHeartButton } from "@/app/components/SaveHeartButton";
import { useSavedPhrases } from "@/app/contexts/SavedPhrasesContext";

function triggerHaptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10);
  }
}

export default function BehaviorPage() {
  const params = useParams<{ behaviorId: string }>();
  const searchParams = useSearchParams();
  const behaviorId = params?.behaviorId || "";
  const categoryIdFromQuery = searchParams.get("categoryId") || "";
  const savedIdFromQuery = searchParams.get("savedId") || "";
  const cardIdFromQuery = searchParams.get("cardId") || "";
  const pendingDeepLinkCardId = useRef(cardIdFromQuery);

  const { savedEntries, addSaved, removeSaved, getById, refresh } = useSavedPhrases();

  const savedEntry = useMemo(() => {
    if (!savedIdFromQuery) return null;
    return getById(savedIdFromQuery);
  }, [savedIdFromQuery, getById]);

  const initialAge = normalizeAgeBand(
    savedEntry?.ageBand ?? searchParams.get("ageBand") ?? getAppDefaults().ageBand
  );
  const initialMoment = intensityToMomentId(
    savedEntry?.momentId ?? savedEntry?.intensity ?? searchParams.get("moment") ?? searchParams.get("intensity") ?? getAppDefaults().momentId
  );

  const [ageBand, setAgeBand] = useState<AgeBand>(initialAge);
  const [momentId, setMomentId] = useState<MomentId>(initialMoment);
  const [card, setCard] = useState<MomentCard | null>(null);
  const [cardFade, setCardFade] = useState(true);
  const [toast, setToast] = useState<"Saved" | "Removed" | null>(null);

  const category = getCategoryById(categoryIdFromQuery);
  const behavior = getBehaviorById(behaviorId);
  const hasContent = hasApprovedContent(behaviorId);
  const variantCount = getVariantCount(behaviorId, ageBand, momentId);
  const canShowAnother = variantCount >= 2;

  const savedMatch = useMemo(() => {
    if (!card) return null;
    return (
      savedEntries.find((e) => e.behaviorId === behaviorId && e.cardId === card.id) ?? null
    );
  }, [savedEntries, behaviorId, card]);
  const isSaved = !!savedMatch;

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    setAppDefaults({ ageBand, momentId });
  }, [ageBand, momentId]);

  // Load card: saved entry, search deep link (once), or default for current filters
  useEffect(() => {
    if (savedEntry?.cardId) {
      const savedCard = getCardById(savedEntry.cardId);
      if (savedCard) {
        setCard(savedCard);
        setAgeBand(normalizeAgeBand(savedEntry.ageBand));
        setMomentId(intensityToMomentId(savedEntry.momentId ?? savedEntry.intensity));
        setCardFade(true);
        return;
      }
    }
    if (!hasContent) {
      setCard(null);
      return;
    }
    if (pendingDeepLinkCardId.current) {
      const fromQuery = getCardById(pendingDeepLinkCardId.current);
      pendingDeepLinkCardId.current = "";
      if (fromQuery) {
        setCard(fromQuery);
        setAgeBand(fromQuery.age_band);
        setMomentId(fromQuery.moment_id);
        setCardFade(true);
        return;
      }
    }
    const next = getDefaultCard(behaviorId, ageBand, momentId);
    setCard(next);
    setCardFade(true);
  }, [behaviorId, ageBand, momentId, savedEntry, hasContent]);

  const handleHeart = useCallback(() => {
    if (!card) return;
    triggerHaptic();
    if (isSaved && savedMatch) {
      removeSaved(savedMatch.id);
      setToast("Removed");
    } else {
      addSaved({
        cardId: card.id,
        categoryId: categoryIdFromQuery || behavior?.categoryId || "",
        behaviorId,
        categoryLabel: category?.title || card.category_name,
        behaviorLabel: behavior?.title || card.behavior_name,
        phrasePreview: card.say_this.slice(0, 120),
        phrase: card.say_this,
        do_this: card.do_this,
        helpful_note: card.helpful_note,
        ageBand,
        momentId,
        intensity: momentId,
      });
      setToast("Saved");
    }
    setTimeout(() => setToast(null), 1500);
  }, [card, isSaved, savedMatch, categoryIdFromQuery, behavior, category, behaviorId, ageBand, momentId, addSaved, removeSaved]);

  const handleShowAnother = useCallback(() => {
    if (!card || !canShowAnother) return;
    triggerHaptic();
    const next = getAnotherCard(card.id, behaviorId, ageBand, momentId);
    if (!next || next.id === card.id) return;
    setCardFade(false);
    setCard(next);
    requestAnimationFrame(() => setCardFade(true));
  }, [card, canShowAnother, behaviorId, ageBand, momentId]);

  const displayBehaviorTitle = behavior?.title ?? card?.behavior_name;

  return (
    <div className="behavior-page" style={{ paddingTop: "var(--space-3)", paddingBottom: "var(--space-5)" }}>
      <HelpTopBar
        backHref={
          categoryIdFromQuery
            ? buildCategoryHref(categoryIdFromQuery, { momentId, ageBand })
            : "/app"
        }
        backLabel="← Back"
      />

      {(category || displayBehaviorTitle) && (
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 6, marginBottom: 0 }}>
          {category?.title ?? card?.category_name}
          {displayBehaviorTitle ? ` · ${displayBehaviorTitle}` : ""}
        </p>
      )}

      {!hasContent ? (
        <div className="app-card" style={{ padding: "var(--space-4)", marginTop: 24, fontSize: 15, color: "var(--text)" }}>
          Approved moment cards for this behavior are coming soon. Browse a category with approved scripts from the home screen.
        </div>
      ) : (
        <>
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 10, fontWeight: 600 }}>
              {MOMENT_CONTEXT_HEADER}
            </p>
            <div role="group" aria-label={MOMENT_CONTEXT_HEADER} style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {MOMENT_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMomentId(m.id)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 20,
                    border:
                      momentId === m.id
                        ? m.id === "unsafe_right_now"
                          ? "1px solid var(--safety-outline)"
                          : "1px solid var(--accent)"
                        : "1px solid var(--border)",
                    background:
                      momentId === m.id
                        ? m.id === "unsafe_right_now"
                          ? "rgba(197, 48, 48, 0.08)"
                          : "var(--accent-soft)"
                        : "var(--surface)",
                    color: "var(--text)",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <AgeSelector value={ageBand} onChange={setAgeBand} />
          </div>

          {!card ? (
            <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 24 }}>
              No approved card for this age and moment yet. Try another combination.
            </p>
          ) : (
            <>
              <MomentCardView
                card={card}
                fadeIn={cardFade}
                saveControl={
                  <SaveHeartButton saved={isSaved} onClick={handleHeart} />
                }
              />

              {canShowAnother && (
                <button
                  type="button"
                  onClick={handleShowAnother}
                  className="app-btn-primary"
                  style={{
                    marginTop: 24,
                    marginBottom: 32,
                    width: "100%",
                    height: 52,
                    borderRadius: "var(--btn-radius)",
                    background: "var(--text)",
                    color: "var(--bg)",
                    fontSize: 16,
                    fontWeight: 500,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Show another phrase
                </button>
              )}

              <p style={{ marginTop: 0, marginBottom: 0, fontSize: 11, color: "var(--muted)", textAlign: "center", lineHeight: 1.4 }}>
                Pre-approved guidance for tough moments—not therapy or a diagnosis.
              </p>
            </>
          )}
        </>
      )}

      {toast && (
        <div role="status" aria-live="polite" style={{ position: "fixed", bottom: 88, left: "50%", transform: "translateX(-50%)", padding: "8px 16px", background: "var(--text)", color: "var(--bg)", fontSize: 13, borderRadius: 8, zIndex: 40 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
