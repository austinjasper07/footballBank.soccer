import { NextResponse } from "next/server";

export async function POST() {
  // Subscription change integration intentionally disabled.
  return NextResponse.json({ error: "Subscription change is disabled." }, { status: 410 });
}
