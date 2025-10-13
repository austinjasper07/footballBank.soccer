import Stripe from "stripe";
import { NextResponse } from "next/server";

// ✅ Initialize Stripe with error handling
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function POST(req) {
  try {
    // Check if Stripe is properly configured
    if (!stripe || !process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return NextResponse.json({ 
        error: "Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.",
        details: "Missing STRIPE_SECRET_KEY in environment variables"
      }, { status: 500 });
    }

    const { products, tax, shipping, subtotal, total, selectedAddressId } = await req.json();

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "No products provided" }, { status: 400 });
    }

    // Transform each product into a Stripe line item
    const line_items = products.map((product) => {
      if (!product.name || !product.amount || !product.quantity) {
        throw new Error("Missing product fields (name, amount, quantity)");
      }

      return {
        price_data: {
          currency: product.currency || "usd",
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : [],
            metadata: {
              productId: product.id, // Store our database product ID
              variationId: product.variationId || null, // Store variation ID if applicable
            },
          },
          unit_amount: Math.round(product.amount * 100), // Stripe uses cents
        },
        quantity: product.quantity,
      };
    });

    // Add tax and shipping as separate line items if they exist
    if (tax && tax > 0) {
      line_items.push({
        price_data: {
          currency: products[0]?.currency || "usd",
          product_data: {
            name: "Tax (6.625%)",
          },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      });
    }

    if (shipping && shipping > 0) {
      line_items.push({
        price_data: {
          currency: products[0]?.currency || "usd",
          product_data: {
            name: "Shipping",
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/en/payment-successful?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/en/payment-cancel`,
      // Add metadata to help with debugging
      metadata: {
        source: "product_checkout",
        timestamp: new Date().toISOString(),
        subtotal: subtotal?.toString() || "0",
        tax: tax?.toString() || "0",
        shipping: shipping?.toString() || "0",
        total: total?.toString() || "0",
        selectedAddressId: selectedAddressId || "none"
      }
    });

    console.log(`🛒 Checkout session created: ${session.id}`);
    console.log(`🛒 Success URL: ${session.success_url}`);
    console.log(`🛒 Webhook endpoint: ${process.env.STRIPE_WEBHOOK_ENDPOINT || 'Not configured'}`);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Ecommerce checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
