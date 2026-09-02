import { NextResponse } from "next/server";

export async function POST() {
  // Stripe subscription checkout disabled.
  return NextResponse.json({ error: "Stripe subscription checkout is disabled." }, { status: 410 });
}
