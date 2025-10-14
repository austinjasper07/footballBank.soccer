// Generic checkout success endpoint for both products and subscriptions
import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/mongodb";
import { User, Order, Subscription } from "@/lib/schemas";
import { sendOrderConfirmationEmail, sendSubscriptionConfirmationEmail, sendAdminOrderNotificationEmail } from "@/utils/resendEmail";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function GET(req, { params }) {
  const sessionId = (await params).id;

  try {
    console.log(`🔍 Processing session ID: ${sessionId}`);
    
    // Validate session ID
    if (!sessionId) {
      console.error("❌ No session ID provided");
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Check Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("❌ Stripe secret key not configured");
      return NextResponse.json(
        { error: "Stripe configuration missing" },
        { status: 500 }
      );
    }

    // Connect to database
    console.log("🔗 Connecting to database...");
    await dbConnect();
    console.log("✅ Database connected");

    // Retrieve the checkout session
    console.log("🔍 Retrieving Stripe session...");
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "line_items", "subscription"],
    });
    console.log("✅ Session retrieved successfully");

    console.log(`📋 Processing session: ${sessionId}, Mode: ${session.mode}, Status: ${session.payment_status}`);

    // Get customer information
    const customer = session.customer;
    const email = customer?.email || session.customer_details?.email;

    if (!email) {
      console.error("❌ No customer email found in session");
      return NextResponse.json(
        { error: "No customer email found" },
        { status: 400 }
      );
    }

    console.log(`👤 Looking up user with email: ${email}`);
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`❌ User not found for email: ${email}`);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    console.log(`✅ User found: ${user._id}`);

    // Handle different session modes
    if (session.mode === "payment") {
      // Handle product purchases
      console.log("🛒 Processing product purchase...");
      
      // Check if order already exists (webhook might have created it)
      let existingOrder = await Order.findOne({ stripeSessionId: sessionId });
      
      if (!existingOrder) {
        console.log("📝 Creating order record (webhook may not have fired)...");
        
        // Get line items
        console.log("🔍 Retrieving line items...");
        const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
        console.log(`✅ Retrieved ${lineItems.data.length} line items`);
        
        const orderItems = lineItems.data.map(item => ({
          name: item.description || item.price.product.name,
          quantity: item.quantity,
          price: item.price.unit_amount / 100
        }));

        const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        console.log(`💰 Total amount: ${totalAmount}`);

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
        
        // Send order confirmation email
        try {
          console.log(`📧 Sending order confirmation email to: ${email}`);
          await sendOrderConfirmationEmail({
            customerEmail: email,
            customerName: customer?.name || user.firstName || 'Valued Customer',
            orderId: existingOrder._id.toString(),
            items: orderItems,
            totalAmount: `$${totalAmount.toFixed(2)}`,
            orderDate: new Date().toLocaleDateString(),
            shippingAddress: user.address || null
          });
          console.log(`✅ Order confirmation email sent successfully`);
        } catch (emailError) {
          console.error(`❌ Error sending order confirmation email:`, emailError);
          // Don't fail the entire process for email errors
        }
        
        // Send admin notification email
        try {
          console.log(`📧 Sending admin notification email for order: ${existingOrder._id}`);
          await sendAdminOrderNotificationEmail({
            orderId: existingOrder._id.toString(),
            customerName: customer?.name || user.firstName || 'Valued Customer',
            customerEmail: email,
            customerAddress: user.address || null,
            items: orderItems,
            totalAmount: `$${totalAmount.toFixed(2)}`,
            orderDate: new Date().toLocaleDateString(),
            paymentStatus: session.payment_status === "paid" ? "Completed" : "Failed",
            stripeSessionId: sessionId
          });
          console.log(`✅ Admin notification email sent successfully`);
        } catch (adminEmailError) {
          console.error(`❌ Error sending admin notification email:`, adminEmailError);
          // Don't fail the entire process for email errors
        }
      } else {
        console.log(`✅ Order already exists: ${existingOrder._id}`);
      }

    } else if (session.mode === "subscription") {
      // Handle subscription purchases
      console.log("🔄 Processing subscription...");
      
      // Extract subscription ID from session object
      let subscriptionId;
      if (typeof session.subscription === 'string') {
        subscriptionId = session.subscription;
      } else if (session.subscription && typeof session.subscription === 'object') {
        subscriptionId = session.subscription.id;
      } else {
        console.error("❌ Invalid subscription data in session:", session.subscription);
        return NextResponse.json(
          { error: "Invalid subscription data" },
          { status: 400 }
        );
      }
      
      console.log(`🔍 Session subscription object:`, session.subscription);
      console.log(`🔍 Extracted subscription ID: ${subscriptionId}`);
      
      if (!subscriptionId) {
        console.error("❌ No subscription ID found");
        return NextResponse.json(
          { error: "Subscription ID not found" },
          { status: 400 }
        );
      }
      
      // Check if subscription already exists
      console.log(`🔍 Looking for existing subscription with ID: ${subscriptionId}`);
      let existingSubscription = await Subscription.findOne({ 
        userId: user._id, 
        stripeSubId: subscriptionId 
      });
      
      if (!existingSubscription) {
        console.log("📝 Creating subscription record (webhook may not have fired)...");
        
        console.log("🔍 Retrieving subscription details...");
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        console.log("✅ Subscription retrieved successfully");
        
        const price = sub.items.data[0].price;
        const priceNickname = price.nickname || price.id || "basic";
        
        // Map Stripe price nickname to valid enum values
        let planName;
        const nickname = priceNickname.toLowerCase();
        
        if (nickname.includes('premium') || nickname.includes('pro') || nickname.includes('advanced')) {
          planName = 'premium';
        } else if (nickname.includes('basic') || nickname.includes('month') || nickname.includes('standard')) {
          planName = 'basic';
        } else if (nickname.includes('free') || nickname.includes('trial')) {
          planName = 'free';
        } else {
          // Default mapping based on price amount
          const amount = price.unit_amount || 0;
          if (amount >= 7900) { // $79 or more
            planName = 'premium';
          } else if (amount >= 2900) { // $29 or more
            planName = 'basic';
          } else {
            planName = 'free';
          }
        }
        
        const expiresAt = new Date(sub.current_period_end * 1000);
        console.log(`📅 Price details:`, {
          nickname: priceNickname,
          amount: price.unit_amount,
          currency: price.currency,
          interval: price.recurring?.interval
        });
        console.log(`📅 Mapped to plan: ${planName}`);
        console.log(`📅 Subscription expires at: ${expiresAt}`);

        // Create subscription
        const subscriptionData = {
          userId: user._id,
          type: "player_publication",
          plan: planName,
          isActive: true,
          startedAt: new Date(),
          expiresAt,
          stripeSubId: String(subscriptionId), // Ensure it's a string
        };
        
        console.log(`📝 Creating subscription with data:`, {
          userId: subscriptionData.userId,
          type: subscriptionData.type,
          plan: subscriptionData.plan,
          stripeSubId: subscriptionData.stripeSubId,
          expiresAt: subscriptionData.expiresAt
        });
        
        existingSubscription = await Subscription.create(subscriptionData);

        // Update user subscription status without triggering full validation
        console.log(`👤 Updating user subscription status for user: ${user._id}`);
        try {
          await User.findByIdAndUpdate(user._id, { subscribed: true });
          console.log(`✅ User subscription status updated successfully`);
        } catch (updateError) {
          console.error(`❌ Error updating user subscription status:`, updateError);
          // Don't fail the entire process for this, just log the error
        }

        console.log(`✅ Subscription created manually: ${existingSubscription._id}`);
        
        // Send subscription confirmation email
        try {
          console.log(`📧 Sending subscription confirmation email to: ${email}`);
          
          // Define plan features based on plan type
          const planFeatures = {
            'free': ['Basic player profile', 'Limited submissions'],
            'basic': ['Player profile creation', 'Agent connections', 'Monthly submissions', 'Email support'],
            'premium': ['All basic features', 'Priority support', 'Advanced analytics', 'Unlimited submissions', 'Direct agent contact']
          };
          
          await sendSubscriptionConfirmationEmail({
            customerEmail: email,
            customerName: customer?.name || user.firstName || 'Valued Customer',
            planName: planName.charAt(0).toUpperCase() + planName.slice(1),
            subscriptionId: subscriptionId,
            amount: `$${(price.unit_amount / 100).toFixed(2)}`,
            billingCycle: price.recurring?.interval || 'monthly',
            nextBillingDate: expiresAt.toLocaleDateString(),
            features: planFeatures[planName] || planFeatures['basic']
          });
          console.log(`✅ Subscription confirmation email sent successfully`);
        } catch (emailError) {
          console.error(`❌ Error sending subscription confirmation email:`, emailError);
          // Don't fail the entire process for email errors
        }
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
      source: session.metadata?.source || (session.mode === 'subscription' ? 'subscription_checkout' : 'product_checkout'),
      processed: true
    });

  } catch (error) {
    console.error("❌ Error processing checkout session:", error);
    console.error("❌ Error stack:", error.stack);
    
    // Provide more specific error information
    let errorMessage = "Error processing checkout session";
    let statusCode = 500;
    
    if (error.type === 'StripeInvalidRequestError') {
      errorMessage = "Invalid Stripe session ID";
      statusCode = 400;
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = "Database connection error - please try again";
      statusCode = 503;
    } else if (error.message?.includes('User not found')) {
      errorMessage = "User account not found";
      statusCode = 404;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: error.message,
        type: error.type || 'Unknown',
        code: error.code || 'UNKNOWN_ERROR'
      },
      { status: statusCode }
    );
  }
}
