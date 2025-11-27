#!/bin/bash

echo "🍽️  Futurescape Lunch Tracker - Vercel Setup Script"
echo "=================================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"
echo ""

# Check if already linked
if [ -f ".vercel/project.json" ]; then
    echo "✅ Project already linked to Vercel"
else
    echo "🔗 Linking to Vercel project..."
    echo "   (You'll need to login and select your project)"
    vercel link
fi

echo ""
echo "📥 Pulling environment variables from Vercel..."
vercel env pull .env.local

echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate

echo ""
echo "📊 Pushing database schema..."
npx prisma db push --accept-data-loss

echo ""
echo "👤 Creating admin user..."
node scripts/setup-db.js

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Go to Vercel Dashboard and redeploy your project"
echo "   2. Visit: https://lunch-break-mocha.vercel.app/api/health"
echo "   3. Test login with ADMIN001 / admin123"
echo ""

