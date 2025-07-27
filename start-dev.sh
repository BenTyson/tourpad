#!/bin/bash

# Kill any existing processes on port 3001
echo "Cleaning up port 3001..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Wait a moment
sleep 2

# Start Next.js development server directly
echo "Starting Next.js development server..."
exec npx next dev -p 3001