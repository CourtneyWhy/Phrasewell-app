import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { REQUIRED_ONBOARDING_VERSION } from "@/app/lib/profile/constants";

function sanitizeNext(next: string | null): string {
  const path = next?.trim() || "/app";
  if (!path.startsWith("/app") || path.startsWith("//")) return "/app";
  return path;
}

function createRouteClient(request: NextRequest, cookieResponse: NextResponse) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim();

  return {
    supabase: createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieResponse.cookies.set(name, value, options),
          );
        },
      },
    }),
    cookieResponse,
  };
}

async function resolveDestination(
  supabase: ReturnType<typeof createServerClient>,
  next: string,
) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("onboarding_version")
    .eq("id", auth.user.id)
    .maybeSingle();

  const needsOnboarding =
    (profile?.onboarding_version ?? 0) < REQUIRED_ONBOARDING_VERSION;
  return needsOnboarding ? "/app/onboarding" : next;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") ?? "email";
  const next = sanitizeNext(searchParams.get("next"));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !key) {
    return NextResponse.redirect(new URL("/app/login?error=auth_config", origin));
  }

  if (!code && !tokenHash) {
    return NextResponse.redirect(new URL("/app/login?error=missing_code", origin));
  }

  let cookieResponse = NextResponse.next({ request });
  const { supabase } = createRouteClient(request, cookieResponse);

  let authError: string | null = null;

  if (tokenHash) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "email",
    });
    if (error) authError = error.message;
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) authError = error.message;
  }

  if (authError) {
    const login = new URL("/app/login", origin);
    login.searchParams.set("error", authError);
    return NextResponse.redirect(login);
  }

  const destination = await resolveDestination(supabase, next);
  if (!destination) {
    return NextResponse.redirect(new URL("/app/login?error=session", origin));
  }

  const redirect = NextResponse.redirect(new URL(destination, origin));
  cookieResponse.cookies.getAll().forEach((cookie) => {
    redirect.cookies.set(cookie);
  });
  return redirect;
}
