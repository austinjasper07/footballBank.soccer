import { NextResponse } from "next/server";

export async function POST() {
  // Stripe webhooks disabled.
  return NextResponse.json({ error: "Stripe webhooks are disabled." }, { status: 410 });
}
