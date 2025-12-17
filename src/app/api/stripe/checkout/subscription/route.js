// // src/app/api/stripe/checkout/subscription/route.js
// import Stripe from "stripe";
// import { NextResponse } from "next/server";
// import { getPriceId, isValidPlanDuration } from "@/lib/stripeUtils";

// const stripe = process.env.STRIPE_SECRET_KEY
//   ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
//   : null;

// export async function POST(req) {
//   try {
//     if (!stripe || !process.env.STRIPE_SECRET_KEY) {
//       console.error("STRIPE_SECRET_KEY missing");
//       return NextResponse.json({
//         error: "Stripe not configured properly"
//       }, { status: 500 });
//     }

//     const { plan, duration, redirect } = await req.json();

//     if (!plan || !duration)
//       return NextResponse.json({ error: "Missing plan or duration" }, { status: 400 });

//     if (!isValidPlanDuration(plan, duration)) {
//       return NextResponse.json({ error: "Invalid plan/duration combo" }, { status: 400 });
//     }

//     if (redirect && !redirect.startsWith('/')) {
//       return NextResponse.json({ error: "Invalid redirect path" }, { status: 400 });
//     }

//     const priceId = getPriceId(plan, duration);
//     if (!priceId) {
//       return NextResponse.json({ error: "Invalid plan configuration" }, { status: 400 });
//     }

//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

//     const session = await stripe.checkout.sessions.create({
//       mode: "subscription",
//       payment_method_types: ["card"],
//       line_items: [{ price: priceId, quantity: 1 }],
//       success_url: `${baseUrl}/payment-successful?session_id={CHECKOUT_SESSION_ID}${
//         redirect ? `&redirect=${encodeURIComponent(redirect)}` : ''
//       }`,
//       cancel_url: `${baseUrl}/pricing${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`,
//       billing_address_collection: 'auto',
//       client_reference_id: `subscription_${plan}_${duration}_${Date.now()}`,
//       metadata: {
//         plan,
//         duration,
//         redirect: redirect || '',
//         source: "subscription_checkout",
//         timestamp: new Date().toISOString()
//       },
//       allow_promotion_codes: false,
//       automatic_tax: { enabled: false }
//     });

//     return NextResponse.json({ url: session.url });

//   } catch (err) {
//     console.error("Subscription checkout error:", err);
//     return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
//   }
// }

// ✅ src/app/api/stripe/checkout/subscription/route.js
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getPriceId, isValidPlanDuration } from "@/lib/stripeUtils";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" })
  : null;

export async function POST(req) {
  try {
    // ✅ Ensure Stripe is configured
    if (!stripe || !process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY missing");
      return NextResponse.json(
        { error: "Stripe not configured properly" },
        { status: 500 }
      );
    }

    const { plan, duration, redirect } = await req.json();
    console.log(redirect);

    // ✅ Validate required fields
    if (!plan || !duration) {
      return NextResponse.json(
        { error: "Missing plan or duration" },
        { status: 400 }
      );
    }

    if (!isValidPlanDuration(plan, duration)) {
      return NextResponse.json(
        { error: "Invalid plan/duration combo" },
        { status: 400 }
      );
    }

    // ✅ Prevent unsafe redirect paths
    if (redirect && !redirect.startsWith("/")) {
      return NextResponse.json(
        { error: "Invalid redirect path" },
        { status: 400 }
      );
    }

    const priceId = getPriceId(plan, duration);
    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid plan configuration" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // ✅ Build URLs with redirect preserved
    const successUrl = `${baseUrl}/en/payment-successful?session_id={CHECKOUT_SESSION_ID}${
      redirect ? `&redirect=${encodeURIComponent(redirect)}` : ""}`;

    const cancelUrl = `${baseUrl}/en/pricing${
      redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`;

    // ✅ Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl.toString(),
      cancel_url: cancelUrl.toString(),
      billing_address_collection: "auto",
      client_reference_id: `subscription_${plan}_${duration}_${Date.now()}`,
      metadata: {
        plan,
        duration,
        redirect: redirect || "",
        source: "subscription_checkout",
        timestamp: new Date().toISOString(),
      },
      allow_promotion_codes: false,
      automatic_tax: { enabled: false },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Subscription checkout error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
