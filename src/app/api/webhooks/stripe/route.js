import { NextResponse } from "next/server";
import Stripe from "stripe";
import { User, Subscription, Order } from "@/lib/schemas";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        console.log("Checkout session completed:", session.id);
        break;

      case "customer.subscription.created":
        const subscription = event.data.object;
        console.log("Subscription created:", subscription.id);
        break;

      case "customer.subscription.updated":
        const updatedSubscription = event.data.object;
        console.log("Subscription updated:", updatedSubscription.id);
        
        // Update subscription status in database
        await Subscription.updateMany(
          { stripeSubscriptionId: updatedSubscription.id },
          {
            status: updatedSubscription.status,
            isActive: updatedSubscription.status === "active",
          }
        );
        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object;
        console.log("Subscription deleted:", deletedSubscription.id);
        
        // Mark subscription as cancelled
        await Subscription.updateMany(
          { stripeSubscriptionId: deletedSubscription.id },
          {
            status: "cancelled",
            isActive: false,
          }
        );
        break;

      case "invoice.payment_succeeded":
        const invoice = event.data.object;
        console.log("Payment succeeded for invoice:", invoice.id);
        break;

      case "invoice.payment_failed":
        const failedInvoice = event.data.object;
        console.log("Payment failed for invoice:", failedInvoice.id);
        
        // Mark subscription as past due
        await Subscription.updateMany(
          { stripeSubscriptionId: failedInvoice.subscription },
          {
            status: "past_due",
            isActive: false,
          }
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
