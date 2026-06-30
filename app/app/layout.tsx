"use client";

import { SavedPhrasesProvider } from "@/app/contexts/SavedPhrasesContext";
import { ProfileProvider } from "@/app/contexts/ProfileContext";
import { OnboardingGuard } from "@/app/components/OnboardingGuard";
import { AppShell } from "@/app/components/AppShell";
import { usePathname } from "next/navigation";
import { shouldShowBottomNav } from "@/app/components/BottomNavGate";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const navVisible = shouldShowBottomNav(pathname);
  const bare = pathname.startsWith("/app/onboarding") || pathname.startsWith("/app/login") || pathname.startsWith("/app/auth");

  if (bare) {
    return <>{children}</>;
  }

  return (
    <ProfileProvider>
      <OnboardingGuard>
        <AppShell>
          <SavedPhrasesProvider>
            <div style={{ paddingBottom: navVisible ? 16 : 0 }}>{children}</div>
          </SavedPhrasesProvider>
        </AppShell>
      </OnboardingGuard>
    </ProfileProvider>
  );
}
