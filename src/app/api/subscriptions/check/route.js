import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/oauth";
import prisma from "@/lib/prisma";

export async function GET() {
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
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId: user.id,
          status: "active",
          isActive: true,
          endDate: {
            gt: new Date() // Not expired
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });

      if (!subscription) {
        return NextResponse.json({
          subscription: null,
          message: "No active subscription found"
        });
      }

      return NextResponse.json({
        subscription: {
          id: subscription.id,
          planId: subscription.planId,
          planName: subscription.planName,
          maxSubmissions: subscription.maxSubmissions,
          usedSubmissions: subscription.usedSubmissions,
          endDate: subscription.endDate,
          isTrial: subscription.trialPeriod || false,
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
