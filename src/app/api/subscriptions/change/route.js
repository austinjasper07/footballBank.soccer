import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/oauth";
import { User, Subscription } from "@/lib/schemas";
import dbConnect from "@/lib/mongodb";

export async function POST(request) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { plan, duration } = await request.json();

    if (!plan) {
      return NextResponse.json(
        { error: "Plan is required" },
        { status: 400 }
      );
    }

    // Check if user has an active subscription
    const existingSubscription = await Subscription.findOne({
      userId: user.id,
      isActive: true
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    // If it's a free plan change, handle it directly
    if (plan === "free") {
      // Deactivate current subscription
      await Subscription.findByIdAndUpdate(existingSubscription._id, {
        isActive: false
      });

      // Calculate expiry date based on duration
      const now = new Date();
      let expiresAt;
      
      if (duration === "3m") {
        expiresAt = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)); // 90 days
      } else {
        expiresAt = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
      }

      // Create new free subscription
      const newSubscription = await Subscription.create({
        userId: user.id,
        type: "player_publication",
        plan: "free",
        isActive: true,
        startedAt: now,
        expiresAt,
        stripeSubId: null
      });

      return NextResponse.json({
        success: true,
        message: "Successfully downgraded to free plan",
        subscription: {
          id: newSubscription._id,
          plan: newSubscription.plan,
          isActive: newSubscription.isActive,
          expiresAt: newSubscription.expiresAt
        }
      });
    }

    // For paid plans, redirect to Stripe checkout
    return NextResponse.json({
      success: true,
      message: "Redirecting to checkout for plan change",
      redirect: true,
      checkoutUrl: `/api/stripe/checkout/subscription?plan=${plan}&duration=${duration || '1m'}&change=true`
    });

  } catch (error) {
    console.error("Error changing subscription:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
