import { NextResponse } from "next/server";

export async function GET() {
  const envCheck = {
    // Stripe Configuration
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? "✅ Set" : "❌ Missing",
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing",
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? "✅ Set" : "❌ Missing",
    
    // Database Configuration
    DATABASE_URL: process.env.DATABASE_URL ? "✅ Set" : "❌ Missing",
    MONGODB_URI: process.env.MONGODB_URI ? "✅ Set" : "❌ Missing",
    
    // Application URLs
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ? "✅ Set" : "❌ Missing",
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ? "✅ Set" : "❌ Missing",
    
    // Authentication
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "✅ Set" : "❌ Missing",
    
    // Email Service
    RESEND_API_KEY: process.env.RESEND_API_KEY ? "✅ Set" : "❌ Missing",
  };

  return NextResponse.json({
    message: "Environment Variables Check",
    variables: envCheck,
    timestamp: new Date().toISOString()
  });
}
