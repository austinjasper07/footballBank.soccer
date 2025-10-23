import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/oauth";
import { Subscription } from "@/lib/schemas";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  await dbConnect();
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    try {
      // Check for active subscription
      const subscription = await Subscription.findOne({
        userId: user.id,
        isActive: true,
        expiresAt: {
          $gt: new Date() // Not expired
        }
      }).sort({ startedAt: -1 });

      if (!subscription) {
        return NextResponse.json({
          subscription: null,
          message: "No active subscription found"
        });
      }

      return NextResponse.json({
        subscription: {
          id: subscription._id,
          plan: subscription.plan,
          planName: subscription.plan,
          isActive: subscription.isActive,
          startedAt: subscription.startedAt,
          expiresAt: subscription.expiresAt,
          type: subscription.type,
          stripeSubId: subscription.stripeSubId
        }
      });
    } catch (dbError) {
      console.error("Database error checking subscription:", dbError);
      // If database is unavailable, allow access with a default free trial
      return NextResponse.json({
        subscription: {
          id: "temp-free-trial",
          planId: "free-trial",
          planName: "Free Trial",
          maxSubmissions: 1,
          usedSubmissions: 0,
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
          isTrial: true,
        }
      });
    }
  } catch (error) {
    console.error("Error checking subscription:", error);
    return NextResponse.json(
      { error: "Failed to check subscription" },
      { status: 500 }
    );
  }
}
