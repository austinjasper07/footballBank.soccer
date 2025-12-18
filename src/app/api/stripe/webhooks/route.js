import Stripe from "stripe";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import { User, Subscription, Order, Product } from "@/lib/schemas";
import { mapPlanName } from "@/lib/stripeUtils";
import {
  sendOrderConfirmationEmail,
  sendSubscriptionConfirmationEmail,
  sendAdminOrderNotificationEmail,
} from "@/utils/resendEmail";

/* ──────────────────────────────────────────────
   Environment safety
────────────────────────────────────────────── */
if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("Stripe environment variables are missing");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ──────────────────────────────────────────────
   Webhook Idempotency Model
────────────────────────────────────────────── */
const WebhookEvent =
  mongoose.models.WebhookEvent ||
  mongoose.model(
    "WebhookEvent",
    new mongoose.Schema({ webhookId: String }, { timestamps: true })
  );

/* ──────────────────────────────────────────────
   Retry helper
────────────────────────────────────────────── */
const processWithRetry = async (operation, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await new Promise((r) =>
        setTimeout(r, Math.pow(2, attempt) * 1000)
      );
    }
  }
};

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookId = req.headers.get("stripe-webhook-id");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    if (mongoose.connection.readyState === 0) await dbConnect();

    /* ──────────────────────────────────────────────
       Idempotency guard
    ─────────────────────────────────────────────── */
    if (webhookId) {
      const processed = await WebhookEvent.findOne({ webhookId });
      if (processed) {
        return new Response("Duplicate webhook ignored", { status: 200 });
      }
      await WebhookEvent.create({ webhookId });
    }

    switch (event.type) {
      /* ──────────────────────────────────────────────
         CHECKOUT COMPLETED
      ─────────────────────────────────────────────── */
      case "checkout.session.completed": {
        const session = event.data.object;

        let email = session.customer_email;
        if (!email && session.customer) {
          const customer = await stripe.customers.retrieve(session.customer);
          email = customer.email;
        }
        if (!email) break;

        const user = await User.findOne({ email });
        if (!user) break;

        /* ───── SUBSCRIPTIONS ───── */
        if (session.mode === "subscription") {
          await processWithRetry(async () => {
            const sub = await stripe.subscriptions.retrieve(
              session.subscription
            );

            const exists = await Subscription.findOne({
              stripeSubId: sub.id,
            });
            if (exists) return;

            const price = sub.items.data[0].price;
            const plan = mapPlanName(price.nickname || price.id);
            const expiresAt = new Date(sub.current_period_end * 1000);

            await Subscription.create({
              userId: user._id,
              type: "player_publication",
              plan,
              isActive: true,
              startedAt: new Date(),
              expiresAt,
              stripeSubId: sub.id,
            });

            user.subscribed = true;
            await user.save();

            await sendSubscriptionConfirmationEmail({
              customerEmail: email,
              customerName: user.firstName || "Valued Customer",
              planName: plan.toUpperCase(),
              subscriptionId: sub.id,
              amount: `$${(price.unit_amount / 100).toFixed(2)}`,
              billingCycle: price.recurring?.interval || "monthly",
              nextBillingDate: expiresAt.toLocaleDateString(),
            });
          });
        }

        /* ───── ONE-TIME PAYMENTS ───── */
        if (session.mode === "payment") {
          await processWithRetry(async () => {
            const existing = await Order.findOne({
              stripeSessionId: session.id,
            });
            if (existing) return;

            const lineItems = await stripe.checkout.sessions.listLineItems(
              session.id,
              { expand: ["data.price.product"] }
            );

            const items = lineItems.data.map((i) => ({
              name: i.description || i.price.product.name,
              quantity: i.quantity,
              price: i.price.unit_amount / 100,
              productId: i.price.product.metadata?.productId,
              variationId: i.price.product.metadata?.variationId,
            }));

            const total = items.reduce(
              (s, i) => s + i.price * i.quantity,
              0
            );

            const order = await Order.create({
              userId: user._id,
              items,
              status: "pending",
              paymentStatus:
                session.payment_status === "paid" ? "completed" : "failed",
              totalAmount: total,
              stripeSessionId: session.id,
              stripePaymentIntentId: session.payment_intent,
              statusHistory: [
                {
                  status: "pending",
                  note: "Created via Stripe webhook",
                  updatedBy: "system",
                },
              ],
            });

            /* Stock updates (atomic) */
            if (session.payment_status === "paid") {
              for (const item of items) {
                if (!item.productId) continue;

                if (item.variationId) {
                  await Product.updateOne(
                    {
                      _id: item.productId,
                      "variations._id": item.variationId,
                      "variations.stock": { $gte: item.quantity },
                    },
                    { $inc: { "variations.$.stock": -item.quantity } }
                  );
                } else {
                  await Product.updateOne(
                    {
                      _id: item.productId,
                      stock: { $gte: item.quantity },
                    },
                    { $inc: { stock: -item.quantity } }
                  );
                }
              }
            }

            await sendOrderConfirmationEmail({
              customerEmail: email,
              customerName: user.firstName || "Valued Customer",
              orderId: order._id.toString(),
              items,
              totalAmount: `$${total.toFixed(2)}`,
              orderDate: new Date().toLocaleDateString(),
            });

            await sendAdminOrderNotificationEmail({
              orderId: order._id.toString(),
              customerName: user.firstName || "Valued Customer",
              customerEmail: email,
              items,
              totalAmount: `$${total.toFixed(2)}`,
              paymentStatus:
                session.payment_status === "paid" ? "Completed" : "Failed",
            });
          });
        }
        break;
      }

      /* ──────────────────────────────────────────────
         INVOICE PAID
      ─────────────────────────────────────────────── */
      case "invoice.paid": {
        const invoice = event.data.object;
        const customer = await stripe.customers.retrieve(invoice.customer);
        const user = await User.findOne({ email: customer.email });
        if (!user) break;

        await Subscription.updateMany(
          { userId: user._id, isActive: true },
          {
            $set: {
              expiresAt: new Date(
                invoice.lines.data[0].period.end * 1000
              ),
            },
          }
        );
        break;
      }

      /* ──────────────────────────────────────────────
         SUBSCRIPTION CANCELED
      ─────────────────────────────────────────────── */
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const customer = await stripe.customers.retrieve(sub.customer);
        const user = await User.findOne({ email: customer.email });
        if (!user) break;

        await Subscription.updateMany(
          { userId: user._id, isActive: true },
          { $set: { isActive: false } }
        );

        user.subscribed = false;
        await user.save();
        break;
      }

      default:
        break;
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    return new Response("Internal Server Error", { status: 500 });
  }
}


