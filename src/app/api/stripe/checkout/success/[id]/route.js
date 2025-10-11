// Generic checkout success endpoint for both products and subscriptions
import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/mongodb";
import { User, Order, Subscription } from "@/lib/schemas";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function GET(req, { params }) {
  const sessionId = (await params).id;

  try {
    // Connect to database
    await dbConnect();

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "line_items", "subscription"],
    });

    console.log(`📋 Processing session: ${sessionId}, Mode: ${session.mode}, Status: ${session.payment_status}`);

    // Get customer information
    const customer = session.customer;
    const email = customer?.email || session.customer_details?.email;

    if (!email) {
      return NextResponse.json(
        { error: "No customer email found" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Handle different session modes
    if (session.mode === "payment") {
      // Handle product purchases
      console.log("🛒 Processing product purchase...");
      
      // Check if order already exists (webhook might have created it)
      let existingOrder = await Order.findOne({ stripeSessionId: sessionId });
      
      if (!existingOrder) {
        console.log("📝 Creating order record (webhook may not have fired)...");
        
        // Get line items
        const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
        
        const orderItems = lineItems.data.map(item => ({
          name: item.description || item.price.product.name,
          quantity: item.quantity,
          price: item.price.unit_amount / 100
        }));

        const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create order
        existingOrder = await Order.create({
          userId: user._id,
          items: orderItems,
          status: "pending",
          paymentStatus: session.payment_status === "paid" ? "completed" : "failed",
          totalAmount: totalAmount,
          stripeSessionId: sessionId
        });

        console.log(`✅ Order created manually: ${existingOrder._id}`);
      } else {
        console.log(`✅ Order already exists: ${existingOrder._id}`);
      }

    } else if (session.mode === "subscription") {
      // Handle subscription purchases
      console.log("🔄 Processing subscription...");
      
      // Check if subscription already exists
      let existingSubscription = await Subscription.findOne({ 
        userId: user._id, 
        stripeSubId: session.subscription 
      });
      
      if (!existingSubscription) {
        console.log("📝 Creating subscription record (webhook may not have fired)...");
        
        const sub = await stripe.subscriptions.retrieve(session.subscription);
        const price = sub.items.data[0].price;
        const planName = price.nickname || price.id || "basic";
        const expiresAt = new Date(sub.current_period_end * 1000);

        // Create subscription
        existingSubscription = await Subscription.create({
          userId: user._id,
          type: "player_publication",
          plan: planName,
          isActive: true,
          startedAt: new Date(),
          expiresAt,
          stripeSubId: sub.id,
        });

        // Update user subscription status
        user.subscribed = true;
        await user.save();

        console.log(`✅ Subscription created manually: ${existingSubscription._id}`);
      } else {
        console.log(`✅ Subscription already exists: ${existingSubscription._id}`);
      }
    }

    // Format the order total
    const amount = session.amount_total ? session.amount_total / 100 : 0;
    const currency = session.currency?.toUpperCase() || "USD";
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    });

    // Return session information
    return NextResponse.json({
      status: session.status,
      customer_name: customer?.name || "Valued Customer",
      customer_email: email,
      amount_total_formatted: formatter.format(amount),
      payment_status: session.payment_status,
      mode: session.mode,
      processed: true
    });

  } catch (error) {
    console.error("❌ Error processing checkout session:", error);
    return NextResponse.json(
      { error: "Error processing checkout session", details: error.message },
      { status: 500 }
    );
  }
}
