import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/oauth";
import { Subscription, User } from "@/lib/schemas";
import dbConnect from "@/lib/mongodb";

export async function POST() {
  await dbConnect();
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if user already has a subscription
    const existingSubscription = await Subscription.findOne({
      userId: user.id,
      status: "active"
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: "User already has an active subscription" },
        { status: 400 }
      );
    }

    // Create free trial subscription
    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 60); // 60 days free trial

    const subscription = await Subscription.create({
      userId: user.id,
      planId: "free-trial",
      planName: "Free Trial",
      status: "active",
      startDate: trialStartDate,
      endDate: trialEndDate,
      isActive: true,
      price: 0,
      currency: "USD",
      trialPeriod: true,
      maxSubmissions: 1,
      usedSubmissions: 0,
    });

    // Update user's subscription status
    await User.findByIdAndUpdate(user.id, { subscribed: true });

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        planName: subscription.planName,
        endDate: subscription.endDate,
        maxSubmissions: subscription.maxSubmissions,
        usedSubmissions: subscription.usedSubmissions,
      }
    });
  } catch (error) {
    console.error("Error creating free trial:", error);
    return NextResponse.json(
      { error: "Failed to create free trial" },
      { status: 500 }
    );
  }
}
