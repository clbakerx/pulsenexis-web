// Test script to verify Clerk keys are working
// Run this with: node test-clerk-keys.js

const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

async function testClerkKeys() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;
  
  console.log('Testing Clerk Configuration...');
  console.log('Publishable Key:', publishableKey ? `${publishableKey.substring(0, 20)}...` : 'MISSING');
  console.log('Secret Key:', secretKey ? `${secretKey.substring(0, 20)}...` : 'MISSING');
  
  if (!publishableKey || !secretKey) {
    console.error('❌ Missing Clerk keys in .env.local');
    return;
  }
  
  if (!publishableKey.startsWith('pk_test_') && !publishableKey.startsWith('pk_live_')) {
    console.error('❌ Invalid publishable key format');
    return;
  }
  
  if (!secretKey.startsWith('sk_test_') && !secretKey.startsWith('sk_live_')) {
    console.error('❌ Invalid secret key format');
    return;
  }
  
  console.log('✅ Clerk keys appear to be in correct format');
}

testClerkKeys();