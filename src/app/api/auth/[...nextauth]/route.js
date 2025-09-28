import { NextResponse } from "next/server";

// Disabled NextAuth API route to avoid openid-client issues
export async function GET() {
  return NextResponse.json(
    { error: "OAuth authentication is currently disabled" },
    { status: 501 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "OAuth authentication is currently disabled" },
    { status: 501 }
  );
}