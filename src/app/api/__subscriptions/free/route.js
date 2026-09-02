import { NextResponse } from "next/server";

export async function POST() {
  // Free subscription provisioning intentionally disabled.
  return NextResponse.json({ error: "Free subscription endpoint is disabled." }, { status: 410 });
}
