import { createClient } from "@supabase/supabase-js";

export function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  // Legacy service_role key, or new Supabase secret key (sb_secret_…)
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY
  )?.trim();

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
