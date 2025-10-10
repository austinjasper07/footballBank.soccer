// app/api/checkout-sessions/[id]/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/mongodb";
import { User, Subscription } from "@/lib/schemas";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16", // Use the latest version
});

export async function GET(req, { params }) {
  const sessionId = (await params).id;

  try {
    // Connect to database
    await dbConnect();

    // Retrieve the checkout session with subscription data
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "line_items", "subscription"],
    });

    // Get customer information
    const customer = session.customer;
    const email = customer?.email || session.customer_details?.email;

    // Note: Database processing is handled by webhooks to prevent duplicate processing
    // The webhook will create the subscription record when checkout.session.completed is received
    console.log(`📋 Session processed - Mode: ${session.mode}, Payment Status: ${session.payment_status}, Email: ${email}`);

    // Format the order total
    const amount = session.amount_total ? session.amount_total / 100 : 0;
    const currency = session.currency?.toUpperCase() || "USD";
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    });

    // Return session information
    return NextResponse.json({
      status: session.status,
      customer_name: customer?.name || "Valued Customer",
      customer_email: email,
      amount_total_formatted: formatter.format(amount),
      payment_status: session.payment_status,
    });
  } catch (error) {
    console.error("Error retrieving session:", error);
    return NextResponse.json(
      { error: "Error retrieving checkout session" },
      { status: 500 }
    );
  }
}
