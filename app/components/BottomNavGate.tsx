"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/app/components/BottomNav";

/** Top-level app pages get the persistent bottom nav; in-the-moment help flow does not. */
export function shouldShowBottomNav(pathname: string): boolean {
  if (!pathname.startsWith("/app")) return false;
  if (pathname === "/app/login") return false;
  if (pathname.startsWith("/app/onboarding")) return false;
  if (pathname.startsWith("/app/auth")) return false;
  if (pathname === "/app/profile") return true;
  if (pathname.startsWith("/app/category/")) return false;
  if (pathname.startsWith("/app/behavior/")) return false;
  return true;
}

export function BottomNavGate() {
  const pathname = usePathname() ?? "";
  if (!shouldShowBottomNav(pathname)) return null;
  return <BottomNav />;
}
