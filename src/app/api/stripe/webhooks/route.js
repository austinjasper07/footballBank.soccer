// import Stripe from "stripe";
// import mongoose from "mongoose";
// import dbConnect from "@/lib/mongodb";
// import { User, Subscription, Order, Product } from "@/lib/schemas";
// import { mapPlanName } from "@/lib/stripeUtils";
// import { 
//   sendOrderConfirmationEmail, 
//   sendSubscriptionConfirmationEmail, 
//   sendAdminOrderNotificationEmail 
// } from "@/utils/resendEmail";

// // ✅ Initialize Stripe
// const stripe = process.env.STRIPE_SECRET_KEY 
//   ? new Stripe(process.env.STRIPE_SECRET_KEY)
//   : null;

// export const config = {
//   api: { bodyParser: false },
// };

// export async function POST(req) {
//   const body = await req.text();
//   const signature = req.headers.get("stripe-signature");

//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(
//       body,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//     console.log("✅ Webhook verified:", event.type);
//   } catch (err) {
//     console.error("❌ Stripe verification failed:", err.message);
//     return new Response(`Webhook Error: ${err.message}`, { status: 400 });
//   }

//   try {
//     if (mongoose.connection.readyState === 0) await dbConnect();

//     const processWithRetry = async (operation, maxRetries = 3) => {
//       for (let attempt = 1; attempt <= maxRetries; attempt++) {
//         try {
//           return await operation();
//         } catch (error) {
//           console.error(`❌ Attempt ${attempt}/${maxRetries} failed:`, error.message);
//           if (attempt === maxRetries) throw error;
//           await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
//         }
//       }
//     };

//     switch (event.type) {
//       // 🟢 Handle checkout session completed
//       case "checkout.session.completed": {
//         const session = event.data.object;
//         const customer = await stripe.customers.retrieve(session.customer);
//         const email = customer.email || session.customer_email;
//         if (!email) break;

//         const user = await User.findOne({ email });
//         if (!user) break;

//         // 🟢 Handle subscriptions
//         if (session.mode === "subscription") {
//           await processWithRetry(async () => {
//             const sub = await stripe.subscriptions.retrieve(session.subscription);
//             const price = sub.items.data[0].price;
//             const planName = price.nickname || price.id || "basic";
//             const expiresAt = new Date(sub.current_period_end * 1000);
//             const mappedPlan = mapPlanName(planName);

//             await Subscription.create({
//               userId: user._id,
//               type: "player_publication",
//               plan: mappedPlan,
//               isActive: true,
//               startedAt: new Date(),
//               expiresAt,
//               stripeSubId: sub.id,
//             });

//             user.subscribed = true;
//             await user.save();

//             console.log(`✅ Subscription created for ${email} - Plan: ${mappedPlan}`);

//             await sendSubscriptionConfirmationEmail({
//               customerEmail: email,
//               customerName: user.firstName || "Valued Customer",
//               planName: mappedPlan.charAt(0).toUpperCase() + mappedPlan.slice(1),
//               subscriptionId: sub.id,
//               amount: `$${(price.unit_amount / 100).toFixed(2)}`,
//               billingCycle: price.recurring?.interval || "monthly",
//               nextBillingDate: expiresAt.toLocaleDateString(),
//               features: {
//                 free: ["Basic player profile", "Limited submissions"],
//                 basic: [
//                   "Player profile creation",
//                   "Agent connections",
//                   "Monthly submissions",
//                   "Email support",
//                 ],
//                 premium: [
//                   "All basic features",
//                   "Priority support",
//                   "Advanced analytics",
//                   "Unlimited submissions",
//                   "Direct agent contact",
//                 ],
//               }[mappedPlan],
//             });
//           });
//         }

//         // 🟢 Handle one-time product purchases
//         else if (session.mode === "payment") {
//           await processWithRetry(async () => {
//             // ✅ FIX: Expand product data so metadata is included
//             const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
//               expand: ["data.price.product"],
//             });

//             // Debug — check if metadata exists
//             console.log("🧾 Expanded line items metadata:", 
//               lineItems.data.map(i => i.price.product.metadata)
//             );

//             const orderItems = lineItems.data.map(item => ({
//               name: item.description || item.price.product.name,
//               quantity: item.quantity,
//               price: item.price.unit_amount / 100,
//               productId: item.price.product.metadata?.productId,
//               variationId: item.price.product.metadata?.variationId,
//             }));

//             const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

//             // Shipping address handling
//             let shippingAddress = null;
//             if (session.metadata?.selectedAddressId && session.metadata.selectedAddressId !== "none") {
//               const userWithAddresses = await User.findById(user._id).select("shippingAddresses");
//               shippingAddress = userWithAddresses?.shippingAddresses?.find(
//                 addr => addr.id === session.metadata.selectedAddressId
//               ) || null;
//             }

//             const order = await Order.create({
//               userId: user._id,
//               items: orderItems,
//               status: "pending",
//               paymentStatus: session.payment_status === "paid" ? "completed" : "failed",
//               totalAmount,
//               stripeSessionId: session.id,
//               shippingAddress,
//             });

//             console.log(`✅ Order created for ${email}`);

//             // ✅ Update stock after payment
//             if (session.payment_status === "paid") {
//               for (const item of orderItems) {
//                 if (!item.productId) {
//                   console.warn(`⚠️ Skipping stock update — missing productId for ${item.name}`);
//                   continue;
//                 }

//                 const product = await Product.findById(item.productId);
//                 if (!product) {
//                   console.warn(`⚠️ Product not found: ${item.productId}`);
//                   continue;
//                 }

//                 if (item.variationId) {
//                   const variation = product.variations.find(
//                     (v) => v._id.toString() === item.variationId
//                   );
//                   if (variation) {
//                     variation.stock = Math.max(0, variation.stock - item.quantity);
//                     console.log(`📦 Updated variation stock for ${item.name}`);
//                   }
//                 } else {
//                   product.stock = Math.max(0, product.stock - item.quantity);
//                   console.log(`📦 Updated product stock for ${product.name}`);
//                 }

//                 await product.save();
//               }
//               console.log(`✅ Product stock updated successfully`);
//             }

//             // Email notifications
//             await sendOrderConfirmationEmail({
//               customerEmail: email,
//               customerName: user.firstName || "Valued Customer",
//               orderId: order._id.toString(),
//               items: orderItems,
//               totalAmount: `$${totalAmount.toFixed(2)}`,
//               orderDate: new Date().toLocaleDateString(),
//               shippingAddress: shippingAddress || user.address || null,
//             });

//             await sendAdminOrderNotificationEmail({
//               orderId: order._id.toString(),
//               customerName: user.firstName || "Valued Customer",
//               customerEmail: email,
//               customerAddress: user.address || null,
//               shippingAddress,
//               items: orderItems,
//               totalAmount: `$${totalAmount.toFixed(2)}`,
//               orderDate: new Date().toLocaleDateString(),
//               paymentStatus:
//                 session.payment_status === "paid" ? "Completed" : "Failed",
//               stripeSessionId: session.id,
//             });
//           });
//         }
//         break;
//       }

//       case "payment_intent.succeeded":
//       case "invoice.paid":
//       case "customer.subscription.deleted":
//         // keep your existing logic here
//         break;

//       default:
//         console.log(`⚪ Unhandled event type: ${event.type}`);
//     }

//     return new Response(JSON.stringify({ received: true }), { status: 200 });
//   } catch (err) {
//     console.error("❌ Webhook handler error:", err);
//     return new Response("Internal Error", { status: 500 });
//   }
// }


import Stripe from "stripe";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import { User, Subscription, Order, Product } from "@/lib/schemas";
import { mapPlanName } from "@/lib/stripeUtils";
import { sendOrderConfirmationEmail, sendSubscriptionConfirmationEmail, sendAdminOrderNotificationEmail } from "@/utils/resendEmail";

// ✅ Initialize Stripe with error handling
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const config = {
  api: { bodyParser: false },
};

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookId = req.headers.get("stripe-webhook-id");

  console.log("🔔 Webhook received - Signature present:", !!signature);
  console.log("🔔 Webhook received - Body length:", body.length);
  console.log("🔔 Webhook ID:", webhookId);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("🔔 Webhook verified - Event type:", event.type);
    console.log("🔔 Event ID:", event.id);
  } catch (err) {
    console.error("❌ Stripe signature verification failed:", err.message);
    console.error("❌ Webhook secret configured:", !!process.env.STRIPE_WEBHOOK_SECRET);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    if (mongoose.connection.readyState === 0) await dbConnect();

    // Add retry logic for critical operations
    const processWithRetry = async (operation, maxRetries = 3) => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await operation();
        } catch (error) {
          console.error(`❌ Attempt ${attempt}/${maxRetries} failed:`, error.message);
          if (attempt === maxRetries) {
            throw error;
          }
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    };

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const customer = await stripe.customers.retrieve(session.customer);
        const email = customer.email || session.customer_email;
        if (!email) break;

        const user = await User.findOne({ email });
        if (!user) break;

        if (session.mode === "subscription") {
          await processWithRetry(async () => {
            const sub = await stripe.subscriptions.retrieve(session.subscription);
            const price = sub.items.data[0].price;
            const planName = price.nickname || price.id || "basic";
            const expiresAt = new Date(sub.current_period_end * 1000);

            // Map plan name to valid enum values using centralized function
            const mappedPlan = mapPlanName(planName);

            await Subscription.create({
              userId: user._id,
              type: "player_publication",
              plan: mappedPlan,
              isActive: true,
              startedAt: new Date(),
              expiresAt,
              stripeSubId: sub.id,
            });

            user.subscribed = true;
            await user.save();

            console.log(`✅ Subscription created for ${email} - Plan: ${mappedPlan}`);
            
            // Send subscription confirmation email
            try {
              const planFeatures = {
                'free': ['Basic player profile', 'Limited submissions'],
                'basic': ['Player profile creation', 'Agent connections', 'Monthly submissions', 'Email support'],
                'premium': ['All basic features', 'Priority support', 'Advanced analytics', 'Unlimited submissions', 'Direct agent contact']
              };
              
              await sendSubscriptionConfirmationEmail({
                customerEmail: email,
                customerName: user.firstName || 'Valued Customer',
                planName: mappedPlan.charAt(0).toUpperCase() + mappedPlan.slice(1),
                subscriptionId: sub.id,
                amount: `$${(price.unit_amount / 100).toFixed(2)}`,
                billingCycle: price.recurring?.interval || 'monthly',
                nextBillingDate: expiresAt.toLocaleDateString(),
                features: planFeatures[mappedPlan] || planFeatures['basic']
              });
              console.log(`✅ Subscription confirmation email sent to ${email}`);
            } catch (emailError) {
              console.error(`❌ Error sending subscription email:`, emailError);
            }
          });
        } else if (session.mode === "payment") {
          await processWithRetry(async () => {
            // Handle one-time product purchases
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
              expand: ["data.price.product"]
            });
            
            // 🔍 Log raw Stripe line items data
            console.log(`🔍 Raw Stripe line items for session ${session.id}:`, JSON.stringify(lineItems.data, null, 2));
            
            const orderItems = lineItems.data.map(item => ({
              name: item.description || item.price.product.name,
              quantity: item.quantity,
              price: item.price.unit_amount / 100,
              productId: item.price.product.metadata?.productId,
              variationId: item.price.product.metadata?.variationId
            }));
            
            // 🔍 Log processed order items
            console.log(`🔍 Processed order items:`, JSON.stringify(orderItems, null, 2));

            const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Check if order already exists to prevent duplicates
            const existingOrder = await Order.findOne({ stripeSessionId: session.id });
            if (existingOrder) {
              console.log(`✅ Order already exists for session ${session.id}, skipping creation`);
              return;
            }

            // Get shipping address from session metadata
            let shippingAddress = null;
            if (session.metadata?.selectedAddressId && session.metadata.selectedAddressId !== "none") {
              try {
                // Fetch the user's shipping addresses directly from the database
                const userWithAddresses = await User.findById(user._id).select('shippingAddresses');
                if (userWithAddresses && userWithAddresses.shippingAddresses) {
                  shippingAddress = userWithAddresses.shippingAddresses.find(addr => addr.id === session.metadata.selectedAddressId);
                  console.log(`📦 Found shipping address:`, shippingAddress);
                }
              } catch (error) {
                console.error('Error fetching shipping address:', error);
              }
            }

            const order = await Order.create({
              userId: user._id,
              items: orderItems,
              status: "pending", // Orders start as pending, admin fulfills them
              paymentStatus: session.payment_status === "paid" ? "completed" : "failed",
              totalAmount: totalAmount,
              stripeSessionId: session.id,
              stripePaymentIntentId: session.payment_intent,
              shippingAddress: shippingAddress || null,
              statusHistory: [{
                status: "pending",
                note: "Order created via webhook",
                updatedBy: "system"
              }]
            });

            console.log(`✅ Product purchase completed for ${email} - Items: ${orderItems.length}, Payment: ${session.payment_status}`);

            // Update product stock after successful payment with atomic operations
            if (session.payment_status === "paid") {
              try {
                console.log(`📦 Updating product stock for ${orderItems.length} items`);
                
                for (const item of orderItems) {
                  if (!item.productId) {
                    console.warn(`⚠️ Skipping stock update — missing productId for ${item.name}`);
                    continue;
                  }

                  // Use atomic update operations to prevent race conditions
                  if (item.variationId) {
                    // Handle product variations with atomic update
                    const updateResult = await Product.updateOne(
                      { 
                        _id: item.productId,
                        "variations._id": item.variationId,
                        "variations.stock": { $gte: item.quantity }
                      },
                      { 
                        $inc: { "variations.$.stock": -item.quantity }
                      }
                    );
                    
                    if (updateResult.modifiedCount === 0) {
                      console.warn(`⚠️ Failed to update variation stock - insufficient stock or variation not found for ${item.name}`);
                    } else {
                      console.log(`📦 Atomically updated variation stock for ${item.name}`);
                    }
                  } else {
                    // Handle simple products with atomic update
                    const updateResult = await Product.updateOne(
                      { 
                        _id: item.productId,
                        stock: { $gte: item.quantity }
                      },
                      { 
                        $inc: { stock: -item.quantity }
                      }
                    );
                    
                    if (updateResult.modifiedCount === 0) {
                      console.warn(`⚠️ Failed to update product stock - insufficient stock for product ID: ${item.productId}`);
                    } else {
                      console.log(`📦 Atomically updated product stock for ${item.name}`);
                    }
                  }
                }
                
                console.log(`✅ All stock updates completed atomically`);
              } catch (stockError) {
                console.error(`❌ Error updating product stock:`, stockError);
                // Don't fail the entire process for stock update errors
              }
            }

            // Send order confirmation email
            try {
              await sendOrderConfirmationEmail({
                customerEmail: email,
                customerName: user.firstName || 'Valued Customer',
                orderId: order._id.toString(),
                items: orderItems,
                totalAmount: `$${totalAmount.toFixed(2)}`,
                orderDate: new Date().toLocaleDateString(),
                shippingAddress: shippingAddress || user.address || null
              });
              console.log(`✅ Order confirmation email sent to ${email}`);
            } catch (emailError) {
              console.error(`❌ Error sending order confirmation email:`, emailError);
            }
            
            // Send admin notification email
            try {
              await sendAdminOrderNotificationEmail({
                orderId: order._id.toString(),
                customerName: user.firstName || 'Valued Customer',
                customerEmail: email,
                customerAddress: user.address || null,
                shippingAddress: shippingAddress,
                items: orderItems,
                totalAmount: `$${totalAmount.toFixed(2)}`,
                orderDate: new Date().toLocaleDateString(),
                paymentStatus: session.payment_status === "paid" ? "Completed" : "Failed",
                stripeSessionId: session.id
              });
              console.log(`✅ Admin notification email sent for order ${order._id}`);
            } catch (adminEmailError) {
              console.error(`❌ Error sending admin notification email:`, adminEmailError);
            }
          });
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const email = paymentIntent.receipt_email;
        if (!email) break;

        const user = await User.findOne({ email });
        if (!user) break;

        console.log(`💳 Manual payment succeeded for ${email}`);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        if (!invoice.lines.data.length) break;

        const customer = await stripe.customers.retrieve(invoice.customer);
        const email = customer.email;
        if (!email) break;

        const user = await User.findOne({ email });
        if (!user) break;

        await Subscription.updateOne(
          { userId: user._id, isActive: true },
          { $set: { expiresAt: new Date(invoice.lines.data[0].period.end * 1000) } }
        );

        console.log(`💰 Subscription renewed for ${email}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        const email = customer.email;
        if (!email) break;

        const user = await User.findOne({ email });
        if (!user) break;

        await Subscription.updateMany(
          { userId: user._id, isActive: true },
          { $set: { isActive: false } }
        );

        user.subscribed = false;
        await user.save();

        console.log(`❌ Subscription canceled for ${email}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        console.log(`💳 Payment failed for intent: ${paymentIntent.id}`);
        
        // Find order by payment intent ID and update status
        const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
        if (order) {
          await order.updatePaymentStatus('failed', 'Payment failed via Stripe webhook', 'system');
          console.log(`❌ Order ${order._id} marked as payment failed`);
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        console.log(`⏰ Checkout session expired: ${session.id}`);
        
        // Find order by session ID and update status
        const order = await Order.findOne({ stripeSessionId: session.id });
        if (order) {
          await order.updateStatus('cancelled', 'Checkout session expired', 'system');
          console.log(`❌ Order ${order._id} marked as cancelled due to expired session`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customer = await stripe.customers.retrieve(invoice.customer);
        const email = customer.email;
        if (!email) break;

        const user = await User.findOne({ email });
        if (!user) break;

        // Update subscription status
        await Subscription.updateMany(
          { userId: user._id, isActive: true },
          { $set: { isActive: false } }
        );

        user.subscribed = false;
        await user.save();

        console.log(`❌ Subscription payment failed for ${email}`);
        break;
      }

      case "charge.dispute.created": {
        const dispute = event.data.object;
        console.log(`⚖️ Charge dispute created: ${dispute.id}`);
        
        // Find order by charge ID and update status
        const order = await Order.findOne({ stripePaymentIntentId: dispute.payment_intent });
        if (order) {
          await order.updatePaymentStatus('failed', 'Charge disputed by customer', 'system');
          console.log(`⚖️ Order ${order._id} marked as disputed`);
        }
        break;
      }

      default:
        console.log(`⚪ Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return new Response("Internal Error", { status: 500 });
  }
}