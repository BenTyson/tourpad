#!/bin/bash

# Monitor development server health

echo "📊 Monitoring development server..."

# Function to check server health
check_server() {
    curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/ || echo "000"
}

# Monitor loop
while true; do
    STATUS=$(check_server)
    MEMORY=$(ps aux | grep "next dev" | grep -v grep | awk '{print $6}')
    
    if [ "$STATUS" = "200" ]; then
        echo "✅ [$(date '+%Y-%m-%d %H:%M:%S')] Server OK - Memory: ${MEMORY}KB"
    else
        echo "❌ [$(date '+%Y-%m-%d %H:%M:%S')] Server DOWN - Status: $STATUS"
    fi
    
    sleep 10
done