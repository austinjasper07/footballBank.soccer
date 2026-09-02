import { NextResponse } from "next/server";

export async function POST() {
  // Stripe product checkout disabled.
  return NextResponse.json({ error: "Stripe product checkout is disabled." }, { status: 410 });
}
