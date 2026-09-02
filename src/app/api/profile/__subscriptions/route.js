import { NextResponse } from 'next/server';

export async function GET() {
  // Profile subscriptions integration intentionally disabled.
  return NextResponse.json({ error: 'Profile subscriptions are disabled.' }, { status: 410 });
}

export async function PATCH() {
  // Profile subscription update integration intentionally disabled.
  return NextResponse.json({ error: 'Profile subscription updates are disabled.' }, { status: 410 });
}