"use client";

import { SavedPhrasesProvider } from "@/app/contexts/SavedPhrasesContext";
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

  return (
    <AppShell>
      <SavedPhrasesProvider>
        <div style={{ paddingBottom: navVisible ? 16 : 0 }}>{children}</div>
      </SavedPhrasesProvider>
    </AppShell>
  );
}
