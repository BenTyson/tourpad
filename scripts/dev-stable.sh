#!/bin/bash

# Stable development script for TourPad
echo "🚀 Starting stable development environment..."

# 1. Clean everything
echo "🧹 Cleaning up..."
killall node 2>/dev/null
rm -rf .next
rm -rf node_modules/.cache

# 2. Set environment
echo "⚙️  Setting environment..."
export NODE_OPTIONS="--max-old-space-size=8192"
export NEXT_TELEMETRY_DISABLED=1

# 3. Start with minimal logging
echo "🏃 Starting server..."
npm run dev 2>&1 | grep -E "Ready|Compiled|GET|POST|Error" 

# This filters out the noise and only shows important messages