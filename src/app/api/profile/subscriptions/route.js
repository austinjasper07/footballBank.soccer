import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/oauth";
import { Subscription } from "@/lib/schemas";

export async function GET() {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    console.log(`Fetching subscriptions for user: ${user.id}`);

    try {
      // Get user's subscriptions
      const subscriptions = await Subscription.find({ userId: user.id })
        .sort({ createdAt: -1 });

      console.log(`Found ${subscriptions.length} subscriptions for user ${user.id}`);

      return NextResponse.json(subscriptions || []);
    } catch (dbError) {
      console.error("Database error fetching subscriptions:", dbError);
      // Return empty data if database is unavailable
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error("Error getting user subscriptions:", error);
    console.error("Error details:", error.message);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { subscriptionId, isActive } = await request.json();

    // Check if subscription belongs to user
    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      userId: user.id 
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Update subscription status
    await Subscription.findByIdAndUpdate(subscriptionId, { isActive });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}