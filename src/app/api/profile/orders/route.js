import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/oauth";
import { Order } from "@/lib/schemas";

export async function GET(request) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    console.log(`Fetching orders for user: ${user.id}`);

    try {
      // Get user's orders
      const orders = await Order.find({ userId: user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalOrders = await Order.countDocuments({ userId: user.id });

      const totalPages = Math.ceil(totalOrders / limit);

      console.log(`Found ${orders.length} orders for user ${user.id}`);

      return NextResponse.json({
        orders: orders || [],
        totalPages,
        currentPage: page,
        totalOrders
      });
    } catch (dbError) {
      console.error("Database error fetching orders:", dbError);
      // Return empty data if database is unavailable
      return NextResponse.json({
        orders: [],
        totalPages: 0,
        currentPage: page,
        totalOrders: 0
      });
    }
  } catch (error) {
    console.error("Error getting user orders:", error);
    console.error("Error details:", error.message);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { orderId } = await request.json();

    // Check if order belongs to user
    const order = await Order.findOne({
      _id: orderId,
      userId: user.id 
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Update order status to cancelled
    await Order.findByIdAndUpdate(orderId, { status: 'cancelled' });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}