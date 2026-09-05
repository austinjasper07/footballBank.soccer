# Complete Stripe Integration Flow Documentation

## Table of Contents
1. [Overview](#overview)
2. [Stripe Dashboard Setup](#stripe-dashboard-setup)
3. [Environment Configuration](#environment-configuration)
4. [Subscription Flow Documentation](#subscription-flow-documentation)
5. [Product Purchase Flow Documentation](#product-purchase-flow-documentation)
6. [Webhook Configuration](#webhook-configuration)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Testing Guide](#testing-guide)
10. [Troubleshooting](#troubleshooting)
11. [Security Considerations](#security-considerations)

## Overview

This documentation covers the complete Stripe integration for both subscription services and product purchases in the Football Bank application. The system supports:

- **Subscription Plans**: Free trial, Basic ($29/month), Premium ($79/month)
- **Product Purchases**: Football gear shop with cart functionality
- **Payment Methods**: Credit/Debit cards, PayPal
- **Webhook Handling**: Real-time payment status updates

## Stripe Dashboard Setup

### 1. Account Creation and Verification

#### Step 1: Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Click "Start now" and create your account
3. Complete email verification
4. Choose your business type and country

#### Step 2: Complete Business Information
1. **Business Details**:
   - Business name: "Football Bank"
   - Business type: "Technology/Software"
   - Website: Your application URL
   - Business description: "Football player profile submission platform"

2. **Tax Information**:
   - Provide your tax ID
   - Select appropriate tax settings for your region

3. **Bank Account Details**:
   - Add your bank account for payouts
   - Verify account with micro-deposits

#### Step 3: Enable Required Features
1. **Products and Pricing**:
   - Go to Products → Create products for your subscription plans
   - Create recurring prices for monthly subscriptions

2. **Payment Methods**:
   - Enable cards, digital wallets
   - Configure PayPal if needed
   - Set up Apple Pay/Google Pay

3. **Webhooks**:
   - Navigate to Developers → Webhooks
   - Create webhook endpoints (see Webhook Configuration section)

### 2. API Keys Configuration

#### Get API Keys
1. Go to **Developers → API Keys** in Stripe Dashboard
2. Copy the following keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

#### Test vs Live Mode
- **Test Mode**: Use for development and testing
- **Live Mode**: Use for production (requires account verification)

### 3. Product and Price Setup

#### Subscription Products
Create the following products in Stripe Dashboard:

1. **Basic Plan Product**:
   - Name: "Basic Plan"
   - Description: "Monthly subscription for individual agents and scouts"
   - Price: $29.00 USD
   - Billing: Recurring monthly

2. **Premium Plan Product**:
   - Name: "Premium Plan" 
   - Description: "Monthly subscription for professional agencies"
   - Price: $79.00 USD
   - Billing: Recurring monthly

#### Shop Products
Create products for your football gear shop:
- Football boots
- Jerseys
- Balls
- Training gear
- Accessories

## Environment Configuration

### Required Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_... # Your Stripe publishable key
STRIPE_WEBHOOK_SECRET=whsec_... # Your webhook signing secret

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Same as above, for client-side

# Database (if using MongoDB)
MONGODB_URI=mongodb://localhost:27017/football_bank

# Email Configuration (for notifications)
RESEND_API_KEY=re_...
```

### Environment Setup Steps

1. **Development Environment**:
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Add your Stripe keys
   STRIPE_SECRET_KEY=sk_test_51...
   STRIPE_PUBLISHABLE_KEY=pk_test_51...
   ```

2. **Production Environment**:
   ```bash
   # Use live keys (after account verification)
   STRIPE_SECRET_KEY=sk_live_51...
   STRIPE_PUBLISHABLE_KEY=pk_live_51...
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

## Subscription Flow Documentation

### 1. Free Trial Flow

#### User Journey:
1. **New User Registration**:
   - User signs up for account
   - Automatically gets 60-day free trial
   - Can submit 1 player profile

2. **Trial Activation**:
   ```javascript
   // API: POST /api/subscriptions/free-trial
   {
     "userId": "user_id",
     "trialPeriod": true,
     "maxSubmissions": 1,
     "startDate": "2024-01-01",
     "endDate": "2024-03-01"
   }
   ```

3. **Trial Expiration**:
   - System checks trial status
   - Redirects to subscription page
   - Shows upgrade prompts

### 2. Paid Subscription Flow

#### User Journey:
1. **Plan Selection**:
   - User visits `/subscriptions` page
   - Views available plans (Basic $29, Premium $79)
   - Selects desired plan

2. **Checkout Process**:
   ```javascript
   // API: POST /api/stripe/create-checkout-session
   {
     "planId": "basic", // or "premium"
     "userId": "user_id",
     "userEmail": "user@example.com",
     "billingAddress": {
       "street": "123 Main St",
       "city": "New York",
       "state": "NY",
       "postalCode": "10001",
       "country": "US"
     }
   }
   ```

3. **Stripe Checkout Session**:
   - Redirects to Stripe hosted checkout
   - User enters payment details
   - Stripe processes payment

4. **Success Handling**:
   - Webhook receives `checkout.session.completed`
   - Creates subscription record in database
   - Updates user subscription status
   - Redirects to success page

### 3. Subscription Management

#### Active Subscription Features:
- **Basic Plan**: 5 profile submissions per month
- **Premium Plan**: Unlimited submissions
- **Billing**: Monthly recurring
- **Cancellation**: Can cancel anytime

#### Subscription Status Tracking:
```javascript
// Database schema for subscriptions
{
  userId: ObjectId,
  planId: "basic" | "premium",
  status: "active" | "cancelled" | "past_due",
  stripeSubscriptionId: "sub_...",
  startDate: Date,
  endDate: Date,
  maxSubmissions: Number,
  usedSubmissions: Number
}
```

## Product Purchase Flow Documentation

### 1. Shop Browsing Flow

#### User Journey:
1. **Product Discovery**:
   - User visits `/shop/products`
   - Browses football gear categories
   - Uses filters (price, category, search)

2. **Product Details**:
   - View product images and descriptions
   - Select size, color options
   - See pricing and availability

### 2. Cart Management Flow

#### Cart Functionality:
```javascript
// Cart Context Implementation
const CartContext = {
  cart: [], // Array of cart items
  addToCart: (product) => {}, // Add product to cart
  removeFromCart: (productId) => {}, // Remove from cart
  clearCart: () => {}, // Clear entire cart
  updateQuantity: (productId, quantity) => {} // Update item quantity
}
```

#### Cart Features:
- **Persistent Storage**: Uses localStorage
- **Quantity Management**: Add/remove items
- **Save for Later**: Move items to saved list
- **Promo Codes**: Apply discounts (SAVE20, WELCOME10)
- **Bulk Discounts**: 10% off orders over $300

### 3. Checkout Process

#### Checkout Flow:
1. **Cart Review**:
   - User reviews items in cart
   - Applies promo codes
   - Sees price breakdown (subtotal, discounts, total)

2. **Checkout Initiation**:
   ```javascript
   // Navigate to checkout
   router.push('/secure-payment/order-confirmation?type=cart')
   ```

3. **Payment Processing**:
   - User enters billing information
   - Selects payment method (card/PayPal)
   - Stripe processes payment

4. **Order Confirmation**:
   - Order created in database
   - Email confirmation sent
   - Inventory updated

### 4. Order Management

#### Order Lifecycle:
```javascript
// Order status flow
pending → processing → completed → shipped → delivered
```

#### Order Tracking:
- **Order History**: User can view past orders
- **Status Updates**: Real-time order status
- **Shipping Info**: Tracking numbers and delivery dates

## Webhook Configuration

### 1. Webhook Endpoint Setup

#### Create Webhook in Stripe Dashboard:
1. Go to **Developers → Webhooks**
2. Click **"Add endpoint"**
3. Set endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events (see Event Selection below)

#### Event Selection:

**Subscription Events:**
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

**Product Purchase Events:**
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_intent.canceled`

### 2. Webhook Implementation

#### Webhook Handler:
```javascript
// /api/webhooks/stripe/route.js
export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  
  // Verify webhook signature
  const event = stripe.webhooks.constructEvent(
    body, 
    signature, 
    process.env.STRIPE_WEBHOOK_SECRET
  );
  
  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object);
      break;
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;
    // ... other event handlers
  }
}
```

### 3. Webhook Security

#### Signature Verification:
```javascript
// Always verify webhook signatures
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  webhookSecret
);
```

#### Idempotency:
- Handle duplicate webhook events
- Use Stripe event IDs for deduplication
- Implement proper error handling

## Database Schema

### 1. User Schema
```javascript
const userSchema = {
  _id: ObjectId,
  email: String,
  firstName: String,
  lastName: String,
  phone: String,
  billingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  subscription: {
    planId: String,
    status: String,
    stripeCustomerId: String
  }
}
```

### 2. Subscription Schema
```javascript
const subscriptionSchema = {
  userId: ObjectId,
  planId: String, // "basic" | "premium"
  planName: String,
  status: String, // "active" | "cancelled" | "past_due"
  stripeSubscriptionId: String,
  startDate: Date,
  endDate: Date,
  maxSubmissions: Number,
  usedSubmissions: Number,
  price: Number,
  currency: String
}
```

### 3. Product Schema
```javascript
const productSchema = {
  name: String,
  description: String,
  price: Number,
  images: [String],
  category: String,
  sizes: [String],
  colors: [String],
  stock: Number,
  featured: Boolean
}
```

### 4. Order Schema
```javascript
const orderSchema = {
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    name: String,
    quantity: Number,
    price: Number,
    size: String,
    color: String
  }],
  status: String, // "pending" | "completed" | "cancelled"
  totalAmount: Number,
  currency: String,
  stripeSessionId: String,
  shippingAddress: Object,
  billingAddress: Object
}
```

## API Endpoints

### 1. Subscription Endpoints

#### Create Checkout Session
```http
POST /api/stripe/create-checkout-session
Content-Type: application/json

{
  "planId": "basic",
  "userId": "user_id",
  "userEmail": "user@example.com",
  "billingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "US"
  }
}
```

#### Verify Session
```http
POST /api/stripe/verify-session
Content-Type: application/json

{
  "sessionId": "cs_test_..."
}
```

#### Free Trial
```http
POST /api/subscriptions/free-trial
Content-Type: application/json

{
  "userId": "user_id"
}
```

### 2. Product Purchase Endpoints

#### Create Payment Intent
```http
POST /api/stripe/create-payment-intent
Content-Type: application/json

{
  "amount": 7297, // Amount in cents
  "currency": "usd",
  "userId": "user_id",
  "userEmail": "user@example.com",
  "billingAddress": {
    "street": "123 Main St",
    "city": "London",
    "postalCode": "SW1A 1AA",
    "country": "GB"
  }
}
```

#### Shop Checkout Session
```http
POST /api/stripe/create-shop-checkout-session
Content-Type: application/json

{
  "items": [
    {
      "productId": "prod_...",
      "quantity": 2,
      "price": 4999
    }
  ],
  "userId": "user_id",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "London",
    "postalCode": "SW1A 1AA",
    "country": "GB"
  }
}
```

### 3. Cart Management Endpoints

#### Add to Cart
```http
POST /api/shop/cart/add
Content-Type: application/json

{
  "productId": "prod_...",
  "quantity": 1,
  "size": "M",
  "color": "Red"
}
```

#### Get Cart
```http
GET /api/shop/cart
Authorization: Bearer <token>
```

#### Update Cart Item
```http
PUT /api/shop/cart/update
Content-Type: application/json

{
  "itemId": "item_id",
  "quantity": 2
}
```

## Testing Guide

### 1. Test Mode Setup

#### Stripe Test Keys:
```bash
# Use test keys for development
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PUBLISHABLE_KEY=pk_test_51...
```

#### Test Card Numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`
- **Insufficient Funds**: `4000 0000 0000 9995`

### 2. Webhook Testing

#### Stripe CLI:
```bash
# Install Stripe CLI
npm install -g stripe

# Login to Stripe
stripe login

# Forward webhooks to local development
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

#### Test Webhook Events:
```bash
# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
stripe trigger payment_intent.succeeded
```

### 3. Subscription Testing

#### Test Subscription Flow:
1. **Create Test User**: Register new account
2. **Start Free Trial**: Verify 60-day trial activation
3. **Upgrade to Paid**: Test checkout process
4. **Verify Webhooks**: Check database updates
5. **Test Cancellation**: Verify subscription cancellation

#### Test Scenarios:
- **Successful Payment**: Use test card `4242 4242 4242 4242`
- **Failed Payment**: Use test card `4000 0000 0000 0002`
- **3D Secure**: Use test card `4000 0025 0000 3155`
- **Subscription Updates**: Test plan changes
- **Billing Failures**: Test payment failures

### 4. Product Purchase Testing

#### Test Shop Flow:
1. **Browse Products**: Test product listing and filters
2. **Add to Cart**: Test cart functionality
3. **Checkout Process**: Test payment flow
4. **Order Confirmation**: Verify order creation
5. **Email Notifications**: Test confirmation emails

#### Test Scenarios:
- **Single Product Purchase**: Buy one item
- **Multiple Items**: Test cart with multiple products
- **Promo Codes**: Test discount application
- **Inventory Management**: Test stock updates
- **Shipping**: Test address validation

### 5. Integration Testing

#### End-to-End Tests:
```javascript
// Example test for subscription flow
describe('Subscription Flow', () => {
  test('User can subscribe to basic plan', async () => {
    // 1. Create test user
    const user = await createTestUser();
    
    // 2. Start subscription checkout
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({
        planId: 'basic',
        userId: user.id,
        userEmail: user.email
      })
    });
    
    // 3. Verify checkout session created
    expect(response.status).toBe(200);
    
    // 4. Simulate successful payment
    await simulateWebhook('checkout.session.completed');
    
    // 5. Verify subscription created
    const subscription = await getSubscription(user.id);
    expect(subscription.planId).toBe('basic');
    expect(subscription.status).toBe('active');
  });
});
```

## Troubleshooting

### 1. Common Issues

#### Webhook Not Receiving Events:
- **Check URL**: Ensure webhook endpoint is accessible
- **Verify Events**: Confirm correct events are selected
- **Check Logs**: Review Stripe dashboard webhook logs
- **Test Locally**: Use Stripe CLI for local testing

#### Payment Processing Failures:
- **API Keys**: Verify correct keys are being used
- **Currency**: Ensure currency matches your account settings
- **Amount**: Check amount is in correct format (cents)
- **Customer**: Verify customer information is valid

#### Database Connection Issues:
- **Connection String**: Verify MongoDB connection string
- **Schema**: Ensure database schemas are properly defined
- **Indexes**: Check if required indexes are created
- **Permissions**: Verify database user permissions

### 2. Debug Steps

#### Check Stripe Dashboard:
1. **Events**: Review webhook delivery logs
2. **Payments**: Check payment status and errors
3. **Customers**: Verify customer information
4. **Subscriptions**: Check subscription status

#### Application Logs:
```javascript
// Add logging to webhook handlers
console.log('Webhook received:', event.type);
console.log('Event data:', event.data.object);
```

#### Database Queries:
```javascript
// Check subscription status
const subscription = await Subscription.findOne({ userId });
console.log('Subscription:', subscription);

// Check order status
const order = await Order.findOne({ stripeSessionId });
console.log('Order:', order);
```

### 3. Error Handling

#### Webhook Error Handling:
```javascript
try {
  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  await handleWebhookEvent(event);
} catch (err) {
  console.error('Webhook error:', err);
  return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
}
```

#### Payment Error Handling:
```javascript
try {
  const session = await stripe.checkout.sessions.create({
    // ... session configuration
  });
} catch (err) {
  console.error('Stripe error:', err);
  return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
}
```

## Security Considerations

### 1. API Security

#### Authentication:
- **JWT Tokens**: Use secure JWT tokens for API authentication
- **Rate Limiting**: Implement rate limiting on payment endpoints
- **Input Validation**: Validate all input data
- **CORS**: Configure CORS properly

#### Data Protection:
- **PCI Compliance**: Never store card details
- **Encryption**: Encrypt sensitive data in transit and at rest
- **HTTPS**: Always use HTTPS in production
- **Environment Variables**: Never commit secrets to version control

### 2. Stripe Security

#### Webhook Security:
```javascript
// Always verify webhook signatures
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  webhookSecret
);
```

#### API Key Security:
- **Environment Variables**: Store keys in environment variables
- **Key Rotation**: Regularly rotate API keys
- **Access Control**: Limit key access to necessary personnel
- **Monitoring**: Monitor key usage and access

### 3. Database Security

#### Data Encryption:
- **Field Encryption**: Encrypt sensitive fields
- **Connection Security**: Use encrypted database connections
- **Access Control**: Implement proper database access controls
- **Backup Security**: Secure database backups

#### User Data Protection:
- **GDPR Compliance**: Implement data protection measures
- **Data Retention**: Set appropriate data retention policies
- **User Consent**: Obtain proper user consent for data processing
- **Data Deletion**: Implement user data deletion capabilities

---

## Quick Reference

### Essential Stripe Dashboard URLs:
- **Dashboard**: https://dashboard.stripe.com
- **API Keys**: https://dashboard.stripe.com/apikeys
- **Webhooks**: https://dashboard.stripe.com/webhooks
- **Products**: https://dashboard.stripe.com/products
- **Customers**: https://dashboard.stripe.com/customers

### Key Environment Variables:
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Test Card Numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

### Webhook Events:
- `checkout.session.completed`
- `customer.subscription.created`
- `payment_intent.succeeded`
- `invoice.payment_succeeded`

This documentation provides a comprehensive guide for implementing and managing Stripe integration for both subscription and product purchase flows in your Football Bank application.
