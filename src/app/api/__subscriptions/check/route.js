import { NextResponse } from "next/server";

export async function GET() {
  // Subscription check integration intentionally disabled.
  return NextResponse.json({ error: "Subscription check is disabled." }, { status: 410 });
}
