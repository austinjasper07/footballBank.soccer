import Stripe from "stripe";
import { NextResponse } from "next/server";

// ✅ Initialize Stripe with error handling
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// ✅ Define recurring price IDs for each plan
const PRICE_MAP = {
  basic_1m: "price_1SGKRkRvu0fa63vjPN1kzJKb",
  basic_3m: "price_1SGKRkRvu0fa63vjiGJeqMUu",
  premium_1m: "price_1SGKUIRvu0fa63vjHHHGu3Va",
  premium_3m: "price_1SGKUIRvu0fa63vjlPXuCTZS",
};

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

    const key = `${plan}_${duration}`;
    const priceId = PRICE_MAP[key];

    if (!priceId)
      return NextResponse.json({ error: "Invalid plan or duration" }, { status: 400 });

    // ✅ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    console.log("✅ Stripe success URL:", session.success_url);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Subscription checkout error:", err);
    return NextResponse.json({ 
      error: err.message || "Internal server error",
      details: err.toString()
    }, { status: 500 });
  }
}
