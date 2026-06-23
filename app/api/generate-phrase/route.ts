import { NextResponse } from "next/server";

/** Runtime AI generation is disabled — app uses approved static content only. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Live phrase generation is disabled. The app only shows pre-approved moment cards from the content library.",
    },
    { status: 403 }
  );
}
