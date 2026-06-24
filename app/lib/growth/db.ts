import { createSupabaseAdmin } from "@/app/lib/supabase/server";

export function growthDb() {
  return createSupabaseAdmin();
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function daysUntil(isoDate: string) {
  const target = new Date(isoDate + "T12:00:00");
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
