# Stripe Payment Integration Setup Guide

## Overview
This guide will help you set up Stripe payments for your Meeting Management SaaS with a $10/month subscription model.

## Step 1: Stripe Account Setup

### 1.1 Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete business verification
3. Enable live mode when ready for production

### 1.2 Get API Keys
1. Go to Developers → API Keys
2. Copy your **Publishable Key** (starts with `pk_`)
3. Copy your **Secret Key** (starts with `sk_`)

### 1.3 Create Product and Price
1. Go to Products → Create Product
2. Name: "Meeting Management SaaS"
3. Description: "Monthly subscription for meeting management features"
4. Pricing: $10.00 USD, Recurring monthly
5. Copy the **Price ID** (starts with `price_`)

## Step 2: Environment Configuration

### 2.1 Update .env.local
Replace the placeholder values in `.env.local`:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID=price_your_actual_price_id

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### 2.2 Update Stripe Configuration
Update `src/lib/stripe.ts` with your actual price ID:

```typescript
export const STRIPE_CONFIG = {
  priceId: process.env.STRIPE_PRICE_ID || 'price_your_actual_price_id',
  currency: 'usd',
  amount: 1000, // $10.00 in cents
  interval: 'month' as const,
}
```

## Step 3: Webhook Setup

### 3.1 Create Webhook Endpoint
1. Go to Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the **Webhook Secret** (starts with `whsec_`)

### 3.2 Test Webhooks Locally
For local development, use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Step 4: Database Integration

### 4.1 Add Subscription Fields
Add these fields to your user model:

```sql
ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255);
ALTER TABLE users ADD COLUMN subscription_status VARCHAR(50) DEFAULT 'inactive';
ALTER TABLE users ADD COLUMN subscription_id VARCHAR(255);
ALTER TABLE users ADD COLUMN current_period_end TIMESTAMP;
```

### 4.2 Update User Interface
Update your User type in `src/types/index.ts`:

```typescript
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'USER';
  departmentId?: string;
  department?: Department;
  stripeCustomerId?: string;
  subscriptionStatus?: 'active' | 'inactive' | 'past_due' | 'canceled';
  subscriptionId?: string;
  currentPeriodEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Step 5: Testing

### 5.1 Test Cards
Use these test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires authentication: `4000 0025 0000 3155`

### 5.2 Test Flow
1. Start the development server: `npm run dev`
2. Navigate to `/pricing`
3. Click "Subscribe Now"
4. Use test card details
5. Complete payment
6. Check webhook logs
7. Verify subscription status

## Step 6: Production Deployment

### 6.1 Update Environment Variables
Replace test keys with live keys in production:
- Use live publishable key (`pk_live_...`)
- Use live secret key (`sk_live_...`)
- Update webhook endpoint to production URL

### 6.2 Security Considerations
- Never expose secret keys in client-side code
- Use environment variables for all sensitive data
- Implement proper error handling
- Add rate limiting to API endpoints

## Step 7: Monitoring and Analytics

### 7.1 Stripe Dashboard
Monitor payments, subscriptions, and customer data in the Stripe dashboard.

### 7.2 Webhook Monitoring
Set up webhook monitoring to ensure all events are processed correctly.

## Features Implemented

### ✅ Payment Processing
- Stripe Checkout integration
- Subscription management
- Customer portal access

### ✅ User Interface
- Pricing page with plan comparison
- Subscription status display
- Payment management interface

### ✅ API Endpoints
- `/api/stripe/create-checkout-session` - Create payment sessions
- `/api/stripe/create-portal-session` - Manage subscriptions
- `/api/stripe/webhook` - Handle Stripe events

### ✅ Components
- `PricingCard` - Display pricing plans
- `SubscriptionManager` - Manage user subscriptions
- Enhanced navigation with pricing link

## Support

For issues or questions:
1. Check Stripe documentation
2. Review webhook logs
3. Test with Stripe test mode first
4. Contact Stripe support for payment issues

## Next Steps

1. Set up your Stripe account
2. Update environment variables
3. Test the payment flow
4. Deploy to production
5. Monitor and optimize

Happy coding! 🚀
