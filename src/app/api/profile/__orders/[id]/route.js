import { NextResponse } from "next/server";

export async function GET() {
  // Profile order detail route disabled.
  return NextResponse.json({ error: "Order details are disabled." }, { status: 410 });
}
