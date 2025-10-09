import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/oauth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { planId, userId, userEmail, billingAddress } = await request.json();

    if (!planId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Plan details
    const planDetails = {
      basic: { name: "Basic Plan", price: 29 },
      premium: { name: "Premium Plan", price: 79 }
    };

    const plan = planDetails[planId];
    if (!plan) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    // Prepare billing address for Stripe
    const billingAddressForStripe = billingAddress ? {
      line1: billingAddress.street,
      city: billingAddress.city,
      state: billingAddress.state,
      postal_code: billingAddress.postalCode,
      country: billingAddress.countryCode || billingAddress.country,
    } : undefined;

    // Create Stripe checkout session with dynamic user data
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: `Monthly subscription for ${plan.name}`,
            },
            unit_amount: plan.price * 100, // Convert to cents
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscriptions?canceled=true`,
      customer_email: userEmail || user.email,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR', 'ES', 'IT', 'BR', 'AR', 'MX', 'NG', 'ZA', 'AU', 'JP', 'CN', 'IN'],
      },
      metadata: {
        userId: userId,
        planId: planId,
        planName: plan.name,
        userEmail: userEmail || user.email,
      },
      // Pre-fill billing address if available
      ...(billingAddressForStripe && {
        billing_address_collection: 'auto',
        payment_intent_data: {
          metadata: {
            billing_address: JSON.stringify(billingAddressForStripe)
          }
        }
      })
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
