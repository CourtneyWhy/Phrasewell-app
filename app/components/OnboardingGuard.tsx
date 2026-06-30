"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/app/contexts/ProfileContext";

const SKIP_PATHS = ["/app/login", "/app/auth/callback", "/app/onboarding"];

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { loading, needsOnboarding } = useProfile();
  const pathname = usePathname() ?? "";
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (pathname.startsWith("/app/onboarding") && !needsOnboarding) {
      router.replace("/app");
      return;
    }
    if (SKIP_PATHS.some((p) => pathname.startsWith(p))) return;
    if (needsOnboarding) {
      router.replace("/app/onboarding");
    }
  }, [loading, needsOnboarding, pathname, router]);

  return <>{children}</>;
}
