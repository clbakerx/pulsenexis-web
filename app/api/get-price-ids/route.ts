// Temporary API route to help get price IDs from your products
// This will be removed after setup

import { NextResponse } from 'next/server';

export async function GET() {
  // You'll need to add your Stripe secret key to test this
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeKey || stripeKey === 'sk_test_your_stripe_secret_key_here') {
    return NextResponse.json({ 
      error: 'Please add your Stripe secret key to .env.local first',
      instructions: [
        '1. Go to https://dashboard.stripe.com/apikeys',
        '2. Copy your Secret key (starts with sk_test_ or sk_live_)',
        '3. Update STRIPE_SECRET_KEY in .env.local',
        '4. Restart your dev server',
        '5. Visit this endpoint again'
      ]
    });
  }

  try {
    const Stripe = require('stripe');
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' });
    
    // Get prices for your products
    const prices = await stripe.prices.list({
      product: 'prod_TP8RWv75JBFkoz', // Monthly product
      limit: 10,
    });
    
    const annualPrices = await stripe.prices.list({
      product: 'prod_TP8OM1lhtipz3z', // Annual product  
      limit: 10,
    });

    return NextResponse.json({
      monthly_prices: prices.data.map(p => ({
        id: p.id,
        amount: p.unit_amount,
        currency: p.currency,
        interval: p.recurring?.interval,
        product: p.product
      })),
      annual_prices: annualPrices.data.map(p => ({
        id: p.id,
        amount: p.unit_amount,
        currency: p.currency,
        interval: p.recurring?.interval,
        product: p.product
      }))
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to fetch prices',
      message: error.message,
      hint: 'Make sure your Stripe secret key is correct'
    });
  }
}