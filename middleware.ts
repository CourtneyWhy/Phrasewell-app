import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserFromRequest, updateSession } from "@/app/lib/supabase/middleware-auth";

const BETA_COOKIE = "phrasewell_beta_access";
const ADMIN_COOKIE = "phrasewell_admin_access";

const APP_PUBLIC = ["/app/login", "/app/auth/callback"];

function checkAdmin(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return null;
  }
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/auth")) {
    return NextResponse.next();
  }
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  if (!adminPassword) return NextResponse.next();
  if (request.cookies.get(ADMIN_COOKIE)?.value === "1") return NextResponse.next();
  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

async function checkAppAuth(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/app")) return null;

  const betaPassword = process.env.BETA_APP_PASSWORD?.trim();
  if (betaPassword && !APP_PUBLIC.includes(pathname)) {
    if (request.cookies.get(BETA_COOKIE)?.value !== "1") {
      return NextResponse.redirect(new URL("/app/login", request.url));
    }
  }

  if (APP_PUBLIC.includes(pathname)) {
    return updateSession(request);
  }

  const user = await getUserFromRequest(request);
  if (!user) {
    const login = new URL("/app/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (pathname.startsWith("/app/onboarding")) {
    return updateSession(request);
  }

  return updateSession(request);
}

export async function middleware(request: NextRequest) {
  return checkAdmin(request) ?? (await checkAppAuth(request)) ?? NextResponse.next();
}

export const config = {
  matcher: ["/app", "/app/:path*", "/admin/:path*", "/api/admin/:path*"],
};
