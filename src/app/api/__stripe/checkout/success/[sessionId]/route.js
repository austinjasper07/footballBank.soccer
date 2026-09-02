import { NextResponse } from "next/server";

export async function GET() {
  // Stripe checkout success handler disabled.
  return NextResponse.json({ error: "Stripe checkout success handler is disabled." }, { status: 410 });
}
