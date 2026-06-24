import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BETA_COOKIE = "phrasewell_beta_access";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/app")) {
    return NextResponse.next();
  }

  // Login page and beta auth API must stay public
  if (pathname === "/app/login" || pathname.startsWith("/api/beta-auth")) {
    return NextResponse.next();
  }

  const betaPassword = process.env.BETA_APP_PASSWORD?.trim();
  if (!betaPassword) {
    return NextResponse.next();
  }

  const access = request.cookies.get(BETA_COOKIE)?.value;
  if (access === "1") {
    return NextResponse.next();
  }

  const loginUrl = new URL("/app/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/app", "/app/:path*"],
};
