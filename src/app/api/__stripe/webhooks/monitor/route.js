import { NextResponse } from "next/server";

export async function GET() {
  // Stripe webhook monitor disabled.
  return NextResponse.json({ error: "Stripe webhook monitor is disabled." }, { status: 410 });
}
