import Stripe from "stripe";
import { NextResponse } from "next/server";

// ✅ Initialize Stripe with error handling
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

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

    const { products } = await req.json();

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "No products provided" }, { status: 400 });
    }

    // Transform each product into a Stripe line item
    const line_items = products.map((product) => {
      if (!product.name || !product.amount || !product.quantity) {
        throw new Error("Missing product fields (name, amount, quantity)");
      }

      return {
        price_data: {
          currency: product.currency || "usd",
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : [],
          },
          unit_amount: Math.round(product.amount * 100), // Stripe uses cents
        },
        quantity: product.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/en/payment-successful?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/en/payment-failed`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Ecommerce checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
