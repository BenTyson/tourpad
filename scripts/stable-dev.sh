#!/bin/bash

# Simple stable development server script
echo "🚀 Starting TourPad development server with optimized settings..."

# Set environment variables for stability
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS="--max-old-space-size=4096"

# Clear Next.js cache if requested
if [ "$1" = "--clean" ]; then
  echo "🧹 Clearing Next.js cache..."
  rm -rf .next
fi

# Start the development server
echo "✅ Starting server on http://localhost:3001"
exec npx next dev -H 0.0.0.0 -p 3001