import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BETA_COOKIE = "phrasewell_beta_access";
const ADMIN_COOKIE = "phrasewell_admin_access";

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

function checkBeta(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/app")) return null;
  if (pathname === "/app/login") return NextResponse.next();
  const betaPassword = process.env.BETA_APP_PASSWORD?.trim();
  if (!betaPassword) return NextResponse.next();
  if (request.cookies.get(BETA_COOKIE)?.value === "1") return NextResponse.next();
  return NextResponse.redirect(new URL("/app/login", request.url));
}

export function middleware(request: NextRequest) {
  return checkAdmin(request) ?? checkBeta(request) ?? NextResponse.next();
}

export const config = {
  matcher: ["/app", "/app/:path*", "/admin/:path*", "/api/admin/:path*"],
};
