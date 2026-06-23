import { getBehaviorsForCategory, getCategoryById, CATEGORY_META } from "@/app/lib/behavior-catalog";
import { intensityToMomentId, normalizeAgeBand } from "@/app/lib/contentLibrary";
import { Card } from "@/app/components/Card";
import { HelpTopBar } from "@/app/components/HelpTopBar";
import { BehaviorList } from "@/app/app/category/BehaviorList";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }> | { categoryId: string };
  searchParams?: Promise<{ moment?: string; ageBand?: string }> | { moment?: string; ageBand?: string };
}) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const resolvedSearch = searchParams instanceof Promise ? await searchParams : searchParams ?? {};
  const categoryId = resolvedParams.categoryId;
  const momentId = intensityToMomentId(resolvedSearch.moment ?? "unsafe_right_now");
  const ageBand = normalizeAgeBand(resolvedSearch.ageBand ?? "4-7");

  const category = getCategoryById(categoryId);
  const behaviors = getBehaviorsForCategory(categoryId);
  const meta = categoryId ? CATEGORY_META[categoryId] : undefined;

  return (
    <div style={{ paddingTop: "var(--space-3)", paddingBottom: "var(--space-5)" }}>
      <HelpTopBar backHref="/app" backLabel="← Back" />

      <Card
        as="header"
        style={{
          marginTop: "var(--space-2)",
          marginBottom: "var(--space-4)",
          padding: "var(--space-4)",
          borderLeft: "3px solid var(--sand-border)",
        }}
      >
        <h1
          className="font-heading font-normal"
          style={{
            fontSize: "clamp(22px, 4vw, 26px)",
            color: "var(--text)",
            margin: 0,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {category?.title ?? "Behaviors"}
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--muted)",
            marginTop: 6,
            marginBottom: 0,
            fontWeight: 400,
            lineHeight: 1.4,
          }}
        >
          {meta?.descriptor ?? "Pick what's happening right now."}
        </p>
      </Card>

      {behaviors.length === 0 ? (
        <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: 24 }}>
          No behaviors found for this category yet.
        </p>
      ) : (
        <BehaviorList behaviors={behaviors} categoryId={categoryId} momentId={momentId} ageBand={ageBand} />
      )}
    </div>
  );
}
