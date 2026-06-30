"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/app/lib/supabase/browser";
import { REQUIRED_ONBOARDING_VERSION } from "@/app/lib/profile/constants";

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/app";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowser();
    if (!supabase) {
      setError("Auth not configured.");
      return;
    }

    const client = supabase;

    async function finish() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        const { error: exchangeError } = await client.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }
      } else {
        const { error: sessionError } = await client.auth.getSession();
        if (sessionError) {
          setError(sessionError.message);
          return;
        }
      }

      const profileRes = await fetch("/api/profile");
      if (profileRes.ok) {
        const data = await profileRes.json();
        const needs = (data.profile?.onboarding_version ?? 0) < REQUIRED_ONBOARDING_VERSION;
        router.replace(needs ? "/app/onboarding" : next);
      } else {
        router.replace("/app/onboarding");
      }
      router.refresh();
    }

    finish();
  }, [next, router]);

  return (
    <main className="onboarding-shell">
      <p style={{ fontSize: 15, color: "var(--muted)" }}>
        {error ?? "Signing you in…"}
      </p>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<main className="onboarding-shell"><p>Signing you in…</p></main>}>
      <AuthCallbackInner />
    </Suspense>
  );
}
