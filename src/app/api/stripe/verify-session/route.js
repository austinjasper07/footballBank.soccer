import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/oauth";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Get subscription details from session metadata
    const { planId, planName } = session.metadata;

    // Create subscription in database
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: planId,
        planName: planName,
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isActive: true,
        price: session.amount_total / 100, // Convert from cents
        currency: session.currency.toUpperCase(),
        stripeSessionId: sessionId,
        stripeSubscriptionId: session.subscription,
        maxSubmissions: planId === "basic" ? 5 : 999, // Unlimited for premium
        usedSubmissions: 0,
      }
    });

    // Update user's subscription status
    await prisma.user.update({
      where: { id: user.id },
      data: { subscribed: true }
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        planName: subscription.planName,
        maxSubmissions: subscription.maxSubmissions,
        usedSubmissions: subscription.usedSubmissions,
      }
    });
  } catch (error) {
    console.error("Stripe session verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment session" },
      { status: 500 }
    );
  }
}
