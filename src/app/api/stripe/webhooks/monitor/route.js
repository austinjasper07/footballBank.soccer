import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Subscription, Order } from "@/lib/schemas";

export async function GET() {
  try {
    await dbConnect();

    // Get recent webhook activity
    const recentSubscriptions = await Subscription.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('userId plan isActive createdAt stripeSubId');

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('userId status createdAt items');

    // Get statistics
    const totalSubscriptions = await Subscription.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: 'completed' });

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      statistics: {
        subscriptions: {
          total: totalSubscriptions,
          active: activeSubscriptions,
          inactive: totalSubscriptions - activeSubscriptions
        },
        orders: {
          total: totalOrders,
          completed: completedOrders,
          pending: totalOrders - completedOrders
        }
      },
      recent: {
        subscriptions: recentSubscriptions,
        orders: recentOrders
      }
    });
  } catch (error) {
    console.error("Webhook monitor error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
