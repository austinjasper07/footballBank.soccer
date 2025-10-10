import { NextResponse } from "next/server";

export async function GET() {
  const envCheck = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? "✅ Set" : "❌ Missing",
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ? "✅ Set" : "❌ Missing",
    MONGODB_URI: process.env.MONGODB_URI ? "✅ Set" : "❌ Missing",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "✅ Set" : "❌ Missing",
  };

  return NextResponse.json({
    message: "Environment Variables Check",
    variables: envCheck,
    timestamp: new Date().toISOString()
  });
}
