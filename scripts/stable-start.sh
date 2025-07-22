#!/bin/bash

# TourPad Stable Start Script
# Prevents localhost crashes and ensures clean startup

echo "🔄 Starting TourPad stable startup sequence..."

# 1. Kill any existing Node processes
echo "📋 Killing existing Node processes..."
killall node 2>/dev/null || true
sleep 1

# 2. Clear Next.js cache
echo "🗑️  Clearing Next.js cache..."
rm -rf .next

# 3. Clear Node.js require cache
echo "🧹 Clearing Node module cache..."
rm -rf node_modules/.cache

# 4. Set memory limits to prevent crashes
echo "💾 Setting memory limits..."
export NODE_OPTIONS="--max-old-space-size=4096 --max-semi-space-size=256"

# 5. Set NextAuth environment explicitly
echo "🔐 Configuring NextAuth..."
export NEXTAUTH_URL="http://localhost:3000"

# 6. Ensure Prisma client is fresh
echo "🔄 Regenerating Prisma client..."
npx prisma generate

# 7. Start server with explicit host binding
echo "🚀 Starting development server..."
echo "   Server will be available at: http://localhost:3000"
echo "   Press Ctrl+C to stop"
echo ""

# Start with host binding to prevent macOS localhost issues
exec npx next dev -H 0.0.0.0 -p 3000