# Stripe Integration Setup Guide

This guide will help you set up Stripe payment processing for the subscription system.

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
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- Copy the webhook signing secret and add it to `.env.local`

## 📋 Database Schema

The subscription system uses these database models:

```prisma
model Subscription {
  id                    String    @id @default(auto()) @map("_id") @db.ObjectId
  userId                String    @db.ObjectId
  user                  User      @relation(fields: [userId], references: [id])
  planId                String
  planName              String
  status                String    // active, cancelled, past_due
  startDate             DateTime
  endDate               DateTime
  isActive              Boolean
  price                 Float
  currency              String
  stripeSessionId       String?
  stripeSubscriptionId  String?
  trialPeriod           Boolean   @default(false)
  maxSubmissions        Int
  usedSubmissions       Int       @default(0)
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}
```

## 🔄 Subscription Flow

### 1. Free Trial (60 days)
- New users get 1 free profile submission
- No payment required
- Automatically expires after 60 days

### 2. Paid Plans
- **Basic Plan**: $29/month, 5 submissions
- **Premium Plan**: $79/month, unlimited submissions
- Secure payment through Stripe

### 3. Profile Submission Check
- Users must have active subscription
- System checks submission limits
- Redirects to subscription page if needed

## 🛠️ Testing

### Test Mode
- Use Stripe test keys (starts with `sk_test_` and `pk_test_`)
- Use test card numbers:
  - Success: `4242 4242 4242 4242`
  - Decline: `4000 0000 0000 0002`

### Test Webhooks
- Use Stripe CLI: `stripe listen --forward-to localhost:3001/api/webhooks/stripe`
- Or use ngrok for public URL testing

## 🔒 Security Features

- All payment data handled by Stripe
- No card details stored locally
- Webhook signature verification
- HTTPS required for production

## 📱 User Experience

1. **New User**: Gets free trial automatically
2. **Trial Expired**: Redirected to subscription page
3. **Limit Reached**: Prompted to upgrade plan
4. **Payment**: Secure Stripe checkout
5. **Success**: Redirected to profile submission

## 🚨 Troubleshooting

### Common Issues:
1. **Webhook not receiving events**: Check endpoint URL and events selected
2. **Payment not processing**: Verify API keys and webhook secret
3. **Subscription not updating**: Check webhook handler and database connection

### Debug Steps:
1. Check Stripe dashboard for webhook delivery logs
2. Verify environment variables are set correctly
3. Test with Stripe test mode first
4. Check browser console for client-side errors
5. Check server logs for API errors

## 📞 Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

For application issues:
- Check the application logs
- Verify database connections
- Test API endpoints manually
