#!/bin/bash
set -e

# 1. Kill all lingering Node/Next.js processes
pkill -f "next dev" 2>/dev/null || true
pkill -f "node.*next" 2>/dev/null || true

# 2. Free up port 3001
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# 3. Clean all caches
rm -rf .next node_modules/.cache .turbo

# 4. Bump file watcher limits (macOS only, manual sysctl required after reboot)
if [[ "$(uname)" == "Darwin" ]]; then
  echo "macOS file watcher limits should be set manually after reboot."
  ulimit -n 1048576
fi

# 5. Start Next.js with stable settings
export NODE_ENV=development
export NODE_OPTIONS="--max-old-space-size=4096 --no-deprecation"
export NEXT_TELEMETRY_DISABLED=1
export CHOKIDAR_USEPOLLING=false
export CHOKIDAR_INTERVAL=2000
export NEXT_WEBPACK_USEPOLLING=false
export NEXT_WEBPACK_POLL=false

npx next dev -H 0.0.0.0 -p 3001 