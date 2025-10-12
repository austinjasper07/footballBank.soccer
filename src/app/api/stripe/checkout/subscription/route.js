import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getPriceId, isValidPlanDuration } from "@/lib/stripeUtils";

// ✅ Initialize Stripe with error handling
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })
  : null;

// Price mapping is now handled by centralized utility

// ✅ Create checkout session for subscriptions
export async function POST(req) {
  try {
    // Check if Stripe is properly configured
    if (!stripe || !process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return NextResponse.json({ 
        error: "Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.",
        details: "Missing STRIPE_SECRET_KEY in environment variables"
      }, { status: 500 });
    }

    const { plan, duration } = await req.json();

    if (!plan || !duration)
      return NextResponse.json({ error: "Missing plan or duration" }, { status: 400 });

    // Validate plan and duration combination
    if (!isValidPlanDuration(plan, duration)) {
      return NextResponse.json({ error: "Invalid plan or duration combination" }, { status: 400 });
    }

    const priceId = getPriceId(plan, duration);

    // Handle free plan differently
    if (plan === "free") {
      // For free plan, redirect to the free subscription endpoint
      return NextResponse.json({ 
        message: "Free plan activation required",
        redirect: "/api/subscriptions/free"
      });
    }

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan configuration" }, { status: 400 });
    }

    // ✅ Create Stripe Checkout Session
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/en/payment-successful?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/en/cancel`,
      billing_address_collection: 'auto',
      client_reference_id: `subscription_${plan}_${duration}_${Date.now()}`,
      metadata: {
        plan: plan,
        duration: duration,
        source: "subscription_checkout",
        timestamp: new Date().toISOString()
      },
      allow_promotion_codes: false,
      automatic_tax: { enabled: false }
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Subscription checkout error:", err);
    return NextResponse.json({ 
      error: err.message || "Internal server error",
      details: err.toString()
    }, { status: 500 });
  }
}
