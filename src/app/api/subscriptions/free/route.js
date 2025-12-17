// src/app/api/subscriptions/free/route.js

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

    const { duration } = await request.json();
    const mappedDuration = duration || "1m";

    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findOne({
      userId: user.id,
      isActive: true
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: "User already has an active subscription" },
        { status: 400 }
      );
    }

    // Calculate expiry date based on duration
    const now = new Date();
    let expiresAt;
    
    if (mappedDuration === "3m") {
      expiresAt = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)); // 90 days
    } else {
      expiresAt = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
    }

    // Create free subscription
    const subscription = await Subscription.create({
      userId: user.id,
      type: "player_publication",
      plan: "free",
      isActive: true,
      startedAt: now,
      expiresAt,
      stripeSubId: null // No Stripe ID for free plan
    });

    // Update user subscription status
    await User.findByIdAndUpdate(user.id, { subscribed: true });

    console.log(`✅ Free subscription created for user ${user.id}`);

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription._id,
        plan: subscription.plan,
        isActive: subscription.isActive,
        expiresAt: subscription.expiresAt
      }
    });

  } catch (error) {
    console.error("Error creating free subscription:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
