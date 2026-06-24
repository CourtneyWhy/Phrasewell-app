import { NextResponse } from "next/server";

const BETA_COOKIE = "phrasewell_beta_access";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(request: Request) {
  const betaPassword = process.env.BETA_APP_PASSWORD?.trim();
  if (!betaPassword) {
    return NextResponse.json({ error: "Beta access is not configured." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const password = typeof (body as { password?: unknown }).password === "string"
    ? (body as { password: string }).password
    : "";

  if (password !== betaPassword) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(BETA_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(BETA_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
