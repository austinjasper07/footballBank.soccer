# Stripe Integration Setup Guide

This guide will help you set up Stripe payment processing for both subscription services and shop purchases.

## 🔧 Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_... # Your Stripe publishable key
STRIPE_WEBHOOK_SECRET=whsec_... # Your Stripe webhook secret

# App URL (for redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## 🚀 Stripe Dashboard Setup

### 1. Create Stripe Account
- Go to [stripe.com](https://stripe.com) and create an account
- Complete the account verification process

### 2. Get API Keys
- Go to Developers → API Keys in your Stripe dashboard
- Copy the **Secret key** and **Publishable key**
- Add them to your `.env.local` file

### 3. Set Up Webhooks
- Go to Developers → Webhooks in your Stripe dashboard
- Click "Add endpoint"
- Set endpoint URL to: `https://yourdomain.com/api/webhooks/stripe`
- Select these events:

**Subscription Events:**
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

**Shop Purchase Events:**
  - `checkout.session.completed` (for one-time payments)
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `payment_intent.canceled`

- Copy the webhook signing secret and add it to `.env.local`

## 📋 Database Schema

The system uses these database models for both subscriptions and shop purchases:

### Subscription Schema
```javascript
// Mongoose Schema for Subscription
const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: String },
  planName: { type: String },
  status: { type: String }, // active, cancelled, past_due
  startDate: { type: Date },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
  price: { type: Number },
  currency: { type: String },
  stripeSessionId: { type: String },
  stripeSubscriptionId: { type: String },
  trialPeriod: { type: Boolean, default: false },
  maxSubmissions: { type: Number },
  usedSubmissions: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### Shop Purchase Schemas
```javascript
// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: [{ type: String }],
  featured: { type: Boolean, default: false },
  discount: { type: Number, default: 0 },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  stock: { type: Number, default: 0 },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending' 
  },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  stripeSessionId: { type: String },
  stripePaymentIntentId: { type: String },
  shippingAddress: { type: mongoose.Schema.Types.Mixed },
  billingAddress: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
  size: { type: String },
  color: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

## 🔄 Payment Flows

### Subscription Flow

#### 1. Free Trial (60 days)
- New users get 1 free profile submission
- No payment required
- Automatically expires after 60 days

#### 2. Paid Plans
- **Basic Plan**: $29/month, 5 submissions
- **Premium Plan**: $79/month, unlimited submissions
- Secure payment through Stripe

#### 3. Profile Submission Check
- Users must have active subscription
- System checks submission limits
- Redirects to subscription page if needed

### Shop Purchase Flow

#### 1. Product Browsing
- Users browse products in the shop
- Add items to cart with size/color options
- View cart with pricing breakdown (subtotal, VAT, discounts)

#### 2. Checkout Process
- Proceed to secure checkout
- Enter shipping and billing information
- Review order summary with total costs

#### 3. Payment Processing
- Secure payment through Stripe Checkout
- Support for multiple payment methods
- Real-time payment status updates

#### 4. Order Confirmation
- Order confirmation page with details
- Email confirmation sent to customer
- Order tracking information provided

## 🔌 API Endpoints

### Subscription Endpoints
- `POST /api/stripe/create-checkout-session` - Create subscription checkout session
- `POST /api/stripe/verify-session` - Verify subscription payment completion
- `GET /api/subscriptions/check` - Check user subscription status
- `POST /api/subscriptions/free-trial` - Activate free trial

### Shop Purchase Endpoints
- `POST /api/stripe/create-shop-checkout-session` - Create shop checkout session
- `POST /api/stripe/verify-shop-session` - Verify shop payment completion
- `GET /api/shop/products` - Get available products
- `POST /api/shop/cart/add` - Add item to cart
- `DELETE /api/shop/cart/remove` - Remove item from cart
- `GET /api/shop/cart` - Get user's cart
- `GET /api/profile/orders` - Get user's order history
- `POST /api/shop/orders/create` - Create new order

### Webhook Endpoints
- `POST /api/webhooks/stripe` - Handle Stripe webhook events

## 🛠️ Testing

### Test Mode
- Use Stripe test keys (starts with `sk_test_` and `pk_test_`)
- Use test card numbers:
  - Success: `4242 4242 4242 4242`
  - Decline: `4000 0000 0000 0002`
  - 3D Secure: `4000 0025 0000 3155`

### Test Webhooks
- Use Stripe CLI: `stripe listen --forward-to localhost:3001/api/webhooks/stripe`
- Or use ngrok for public URL testing

### Shop Purchase Testing
- Test cart functionality with multiple products
- Test checkout flow with different payment methods
- Test order confirmation and email notifications
- Test inventory management and stock updates

## 🔒 Security Features

- All payment data handled by Stripe
- No card details stored locally
- Webhook signature verification
- HTTPS required for production
- PCI DSS compliance through Stripe
- Secure customer data handling

## 📡 Webhook Event Handling

### Subscription Events
- `checkout.session.completed` - Subscription payment successful
- `customer.subscription.created` - New subscription activated
- `customer.subscription.updated` - Subscription status changed
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.payment_succeeded` - Monthly payment successful
- `invoice.payment_failed` - Payment failed, mark as past due

### Shop Purchase Events
- `checkout.session.completed` - One-time payment successful
- `payment_intent.succeeded` - Payment confirmed
- `payment_intent.payment_failed` - Payment failed
- `payment_intent.canceled` - Payment cancelled by user

### Webhook Implementation
```javascript
// Example webhook handler for shop purchases
case "checkout.session.completed":
  const session = event.data.object;
  if (session.mode === 'payment') {
    // Handle shop purchase completion
    await createOrderFromSession(session);
  } else if (session.mode === 'subscription') {
    // Handle subscription completion
    await createSubscriptionFromSession(session);
  }
  break;

case "payment_intent.succeeded":
  const paymentIntent = event.data.object;
  await updateOrderStatus(paymentIntent.metadata.orderId, 'completed');
  break;
```

## 📱 User Experience

### Subscription Flow
1. **New User**: Gets free trial automatically
2. **Trial Expired**: Redirected to subscription page
3. **Limit Reached**: Prompted to upgrade plan
4. **Payment**: Secure Stripe checkout
5. **Success**: Redirected to profile submission

### Shop Purchase Flow
1. **Browse Products**: Users explore shop catalog
2. **Add to Cart**: Select products with options (size, color)
3. **Review Cart**: View items, pricing, and discounts
4. **Checkout**: Enter shipping and payment details
5. **Payment**: Secure Stripe checkout process
6. **Confirmation**: Order confirmation and email receipt
7. **Tracking**: Order status updates and shipping info

## 🚨 Troubleshooting

### Common Issues:

#### Subscription Issues:
1. **Webhook not receiving events**: Check endpoint URL and events selected
2. **Payment not processing**: Verify API keys and webhook secret
3. **Subscription not updating**: Check webhook handler and database connection

#### Shop Purchase Issues:
1. **Cart not persisting**: Check CartContext implementation and localStorage
2. **Checkout session creation fails**: Verify product data and pricing
3. **Order not created**: Check webhook handlers and database connections
4. **Payment confirmation not working**: Verify session verification logic
5. **Inventory not updating**: Check stock management in webhook handlers

### Debug Steps:
1. Check Stripe dashboard for webhook delivery logs
2. Verify environment variables are set correctly
3. Test with Stripe test mode first
4. Check browser console for client-side errors
5. Check server logs for API errors
6. Test cart functionality with different products
7. Verify order creation in database
8. Check email delivery for order confirmations

## 📞 Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

For application issues:
- Check the application logs
- Verify database connections
- Test API endpoints manually
