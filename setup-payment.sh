#!/bin/bash

echo "🚀 PulseNexis Payment Setup Script"
echo "=================================="
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ Created .env.local file"
else
    echo "⚠️  .env.local already exists - please update it manually"
fi

echo ""
echo "🔧 Next Steps:"
echo ""
echo "1. 🔐 Configure Clerk Authentication:"
echo "   • Go to https://clerk.com"
echo "   • Navigate to your project -> API Keys"
echo "   • Copy Publishable Key -> NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in .env.local"
echo "   • Copy Secret Key -> CLERK_SECRET_KEY in .env.local"
echo ""
echo "2. 💳 Configure Stripe Payments:"
echo "   • Go to https://stripe.com/dashboard"
echo "   • Navigate to Developers -> API Keys"
echo "   • Copy Publishable key -> NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local"
echo "   • Copy Secret key -> STRIPE_SECRET_KEY in .env.local"
echo ""
echo "3. 🏷️ Create Stripe Products & Get Price IDs:"
echo "   • In Stripe Dashboard, go to Products"
echo "   • Create 'Monthly Plan' product: \$9.99 USD, monthly recurring"
echo "   • Create 'Annual Plan' product: \$99 USD, yearly recurring"
echo "   • Copy the price IDs to STRIPE_PRICE_MONTHLY and STRIPE_PRICE_ANNUAL"
echo ""
echo "4. 🔗 Configure Stripe Webhooks (for production):"
echo "   • Go to Developers -> Webhooks -> Add endpoint"
echo "   • URL: https://yourdomain.com/api/webhooks/stripe"
echo "   • Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted"
echo "   • Copy signing secret -> STRIPE_WEBHOOK_SECRET in .env.local"
echo ""
echo "5. 🧪 Test Your Setup:"
echo "   • Run: npm run dev"
echo "   • Visit: http://localhost:3000/plans"
echo "   • Try checkout with test card: 4242 4242 4242 4242"
echo ""
echo "📄 For detailed instructions, see PAYMENT_SETUP.md"
echo ""

# Check if we can start the dev server
if [ -f package.json ]; then
    echo "🚀 Ready to start development server? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "Starting development server..."
        npm run dev
    fi
else
    echo "⚠️  No package.json found - make sure you're in the right directory"
fi