import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function GET(request, { params }) {
  try {
    if (!stripe || !process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return NextResponse.json({ 
        error: "Stripe not configured",
        details: "Please set STRIPE_SECRET_KEY environment variable."
      }, { status: 500 });
    }

    const { sessionId } = params;

    if (!sessionId) {
      return NextResponse.json({ 
        error: 'Session ID is required',
        details: 'No session ID provided in the request'
      }, { status: 400 });
    }

    console.log("🔍 Fetching Stripe session:", sessionId);

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer']
    });

    console.log("🔍 Session details:", {
      id: session.id,
      payment_status: session.payment_status,
      status: session.status,
      mode: session.mode,
      amount_total: session.amount_total
    });

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        error: `Payment not completed. Status: ${session.payment_status}`,
        details: `Session status: ${session.status}`,
        payment_status: session.payment_status,
        session_status: session.status
      }, { status: 400 });
    }

    // Format the response data
    const customerInfo = {
      customer_name: session.customer_details?.name || 'N/A',
      customer_email: session.customer_details?.email || session.customer_email || 'N/A',
      amount_total: session.amount_total,
      amount_total_formatted: `$${(session.amount_total / 100).toFixed(2)} ${session.currency.toUpperCase()}`,
      currency: session.currency,
      payment_status: session.payment_status,
      mode: session.mode, // 'payment' or 'subscription'
      session_id: session.id
    };

    console.log("✅ Payment verified successfully:", customerInfo);

    return NextResponse.json(customerInfo);

  } catch (error) {
    console.error("❌ Error fetching checkout session:", error);
    
    return NextResponse.json({
      error: error.message || 'Failed to verify payment',
      details: error.type || 'Unknown error occurred',
      raw_error: error.raw?.message || null
    }, { status: 500 });
  }
}

