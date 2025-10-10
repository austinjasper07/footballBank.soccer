import Stripe from "stripe";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongoose";
import { User, Subscription } from "@/lib/schemas";

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

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Stripe signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    if (mongoose.connection.readyState === 0) await connectDB();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const customer = await stripe.customers.retrieve(session.customer);
        const email = customer.email || session.customer_email;
        if (!email) break;

        const user = await User.findOne({ email });
        if (!user) break;

        if (session.mode === "subscription") {
          const sub = await stripe.subscriptions.retrieve(session.subscription);
          const price = sub.items.data[0].price;
          const planName = price.nickname || price.id || "basic";
          const expiresAt = new Date(sub.current_period_end * 1000);

          await Subscription.create({
            userId: user._id,
            type: "player_publication",
            plan: planName.toLowerCase(),
            isActive: true,
            startedAt: new Date(),
            expiresAt,
            stripeSubId: sub.id,
          });

          user.subscribed = true;
          await user.save();

          console.log(`✅ Subscription created for ${email}`);
        } else if (session.mode === "payment") {
          console.log(`✅ One-time payment completed for ${email}`);
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

      default:
        console.log(`⚪ Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return new Response("Internal Error", { status: 500 });
  }
}
