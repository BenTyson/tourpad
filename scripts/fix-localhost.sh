#!/bin/bash

# TourPad Localhost Fix Script for macOS
# Resolves persistent connection refused issues

echo "🔧 TourPad Localhost Fix Script"
echo "================================"

# 1. Kill all Node processes
echo "1️⃣ Killing all Node processes..."
killall node 2>/dev/null || true
killall npm 2>/dev/null || true
killall npx 2>/dev/null || true
sleep 2

# 2. Check for conflicting processes
echo "2️⃣ Checking for conflicting processes..."
lsof -i :3000 2>/dev/null && echo "⚠️  Port 3000 in use!" || echo "✅ Port 3000 is free"
lsof -i :3001 2>/dev/null && echo "⚠️  Port 3001 in use!" || echo "✅ Port 3001 is free"
lsof -i :3002 2>/dev/null && echo "⚠️  Port 3002 in use!" || echo "✅ Port 3002 is free"

# 3. Reset network interfaces
echo "3️⃣ Resetting network interfaces..."
# Note: sudo commands removed since they require terminal interaction

# 4. Clear all caches
echo "4️⃣ Clearing all caches..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf ~/.npm/_cacache

# 5. Test network connectivity
echo "5️⃣ Testing network connectivity..."
ping -c 1 127.0.0.1 > /dev/null 2>&1 && echo "✅ Loopback interface working" || echo "❌ Loopback interface issue!"

# 6. Check hosts file
echo "6️⃣ Checking hosts file..."
grep -q "127.0.0.1.*localhost" /etc/hosts && echo "✅ Hosts file OK" || echo "⚠️  Hosts file missing localhost entry"

# 7. Set proper environment
echo "7️⃣ Setting environment variables..."
export NODE_OPTIONS="--max-old-space-size=4096 --max-semi-space-size=256"
export NEXTAUTH_URL="http://localhost:3000"
export NODE_ENV="development"

# 8. Regenerate Prisma client
echo "8️⃣ Regenerating Prisma client..."
npx prisma generate

# 9. Try different startup methods
echo "9️⃣ Starting server with fallback options..."
echo ""
echo "Attempting to start on port 3000..."
echo "If this fails, try manually running:"
echo "  npx next dev -p 3001"
echo "  npx next dev -p 3002"
echo ""

# Start with explicit IPv4 binding
exec npx next dev -H 127.0.0.1 -p 3000