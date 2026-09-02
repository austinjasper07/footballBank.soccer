import { NextResponse } from "next/server";

export async function GET() {
  // Order history integration intentionally disabled.
  return NextResponse.json({ error: "Orders endpoint is disabled." }, { status: 410 });
}

export async function DELETE() {
  // Order cancellation integration intentionally disabled.
  return NextResponse.json({ error: "Order cancellation is disabled." }, { status: 410 });
}