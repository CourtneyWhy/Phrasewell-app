import { NextResponse } from "next/server";
import { todayIso } from "@/app/lib/growth/db";
import { getTodayPlaybooks } from "@/app/lib/growth/daily-playbooks";

export async function GET() {
  const today = todayIso();
  return NextResponse.json({
    today,
    playbooks: getTodayPlaybooks(today),
  });
}
