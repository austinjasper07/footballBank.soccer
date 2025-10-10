import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/oauth";
import { Order, Subscription } from "@/lib/schemas";
import { stripe } from "@/lib/stripe";
import dbConnect from "@/lib/mongodb";

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const paymentIntentId = searchParams.get('payment_intent');
    
    if (!sessionId && !paymentIntentId) {
      return NextResponse.json(
        { error: "Missing session_id or payment_intent parameter" },
        { status: 400 }
      );
    }

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    let stripeData = null;
    let orderData = null;
    let subscriptionData = null;

    try {
      // Fetch data from Stripe
      if (sessionId) {
        stripeData = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ['line_items', 'payment_intent']
        });
      } else if (paymentIntentId) {
        stripeData = await stripe.paymentIntents.retrieve(paymentIntentId);
      }

      if (!stripeData) {
        return NextResponse.json(
          { error: "Payment data not found" },
          { status: 404 }
        );
      }

      // Find the order in our database
      const stripeId = sessionId || paymentIntentId;
      orderData = await Order.findOne({
        $or: [
          { stripeSessionId: stripeId },
          { stripePaymentIntentId: stripeId }
        ],
        userId: user.id
      }).lean();

      // Find related subscription if it exists
      if (orderData) {
        subscriptionData = await Subscription.findOne({
          orderId: orderData._id,
          userId: user.id
        }).lean();
      }

      // Format the response
      const response = {
        payment: {
          id: stripeId,
          status: stripeData.status || stripeData.payment_status,
          amount: stripeData.amount_total || stripeData.amount,
          currency: stripeData.currency || 'gbp',
          customerEmail: stripeData.customer_details?.email || stripeData.receipt_email,
          createdAt: new Date(stripeData.created * 1000).toISOString()
        },
        order: orderData ? {
          id: orderData._id,
          status: orderData.status,
          items: orderData.items || [],
          total: orderData.total || 0,
          createdAt: orderData.createdAt
        } : null,
        subscription: subscriptionData ? {
          id: subscriptionData._id,
          type: subscriptionData.type,
          plan: subscriptionData.plan,
          isActive: subscriptionData.isActive,
          startedAt: subscriptionData.startedAt,
          expiresAt: subscriptionData.expiresAt
        } : null
      };

      return NextResponse.json(response);
    } catch (stripeError) {
      console.error("Stripe error:", stripeError);
      return NextResponse.json(
        { error: "Failed to fetch payment data", details: stripeError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching payment success data:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
