# Payment Setup Guide for PulseNexis

This guide will help you configure Clerk authentication and Stripe payments for your monthly and annual subscription plans.

## 🚨 Issues Fixed

The main issues with your payment setup were:

1. **Mismatched Integration**: You were using Clerk's experimental checkout components but your API was configured for direct Stripe checkout
2. **Plan Structure Mismatch**: Frontend used "month"/"annual" but API expected "listener"/"creator"
3. **Missing Environment Variables**: Required Stripe price IDs and webhooks weren't configured
4. **Incomplete Webhook Handling**: User metadata wasn't being properly updated after payments

## 🔧 Setup Instructions

### 1. Copy Environment Variables

```bash
cp .env.example .env.local
```

### 2. Configure Clerk (Authentication)

1. Go to [clerk.com](https://clerk.com) and create/access your project
2. Get your keys from the API Keys section:
   - Copy **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Copy **Secret Key** → `CLERK_SECRET_KEY`

### 3. Configure Stripe (Payments)

#### 3.1 Get Stripe API Keys
1. Go to [stripe.com](https://stripe.com) and access your dashboard
2. Navigate to **Developers** → **API Keys**
3. Copy keys to `.env.local`:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

#### 3.2 Create Subscription Products
1. In Stripe Dashboard, go to **Products**
2. Click **+ Add Product**
3. Create two products:

**Monthly Plan:**
- Name: "PulseNexis Monthly"
- Price: $9.99 USD
- Billing: Monthly recurring
- Copy the price ID → `STRIPE_PRICE_MONTHLY`

**Annual Plan:**
- Name: "PulseNexis Annual"  
- Price: $99 USD
- Billing: Yearly recurring
- Copy the price ID → `STRIPE_PRICE_ANNUAL`

#### 3.3 Configure Webhooks
1. Go to **Developers** → **Webhooks**
2. Click **+ Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe` (or `http://localhost:3000/api/webhooks/stripe` for local testing)
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### 4. Update Application URLs

In `.env.local`, set your domain:
```bash
# For local development
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_URL=http://localhost:3000

# For production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
APP_URL=https://yourdomain.com
```

## 🧪 Testing

### Local Testing with Stripe CLI
1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Use the webhook signing secret from the CLI output

### Test Payment Flow
1. Start your app: `npm run dev`
2. Go to `/plans`
3. Click "Get Started" on either plan
4. Use Stripe test card: `4242 4242 4242 4242`
5. Check that user metadata is updated in Clerk dashboard

## 📋 What's Changed

### Frontend (`/app/checkout/page.tsx`)
- ✅ Removed Clerk experimental checkout components
- ✅ Added direct Stripe checkout integration
- ✅ Proper error handling and loading states
- ✅ User authentication check before payment

### API Route (`/app/api/checkout/session/route.ts`)
- ✅ Updated to handle "month"/"year" intervals instead of "listener"/"creator"
- ✅ Added user ID to session metadata
- ✅ Proper error handling and logging
- ✅ Correct success/cancel URLs

### Webhook (`/app/webhooks/stripe/route.ts`)
- ✅ Enhanced to handle multiple event types
- ✅ Proper user metadata updates in Clerk
- ✅ Subscription status tracking
- ✅ Better error handling and logging

## 🔍 Troubleshooting

### Common Issues

1. **"Missing price ID" error**
   - Ensure `STRIPE_PRICE_MONTHLY` and `STRIPE_PRICE_ANNUAL` are set correctly
   - Verify the price IDs exist in your Stripe dashboard

2. **Webhook not working**
   - Check `STRIPE_WEBHOOK_SECRET` is correct
   - Ensure webhook endpoint is accessible
   - Verify selected events include the required ones

3. **User metadata not updating**
   - Check Clerk webhook secret is configured
   - Verify user ID is being passed correctly to Stripe session

### Debug Checklist
- [ ] All environment variables are set in `.env.local`
- [ ] Stripe products are created with correct pricing
- [ ] Webhook endpoint is configured and accessible
- [ ] Clerk dashboard shows proper API key configuration
- [ ] Test payments work with Stripe test cards

## 🚀 Next Steps

1. Test the payment flow thoroughly
2. Set up production webhook endpoints
3. Configure proper error monitoring
4. Add subscription management features (cancel, upgrade, etc.)
5. Implement subscription status checks in your app

Need help? Check the console logs in both your app and Stripe dashboard for detailed error information.