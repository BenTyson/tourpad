#!/bin/bash

# Ultimate Development Server Monitor
# This script provides the most robust monitoring and auto-restart capabilities

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
HEALTH_CHECK_URL="http://localhost:3001"
CHECK_INTERVAL=10  # seconds
MAX_FAILURES=3
FAILURE_COUNT=0
LOG_FILE="dev-monitor.log"

log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "INFO") echo -e "${GREEN}[MONITOR]${NC} $message" ;;
        "WARN") echo -e "${YELLOW}[MONITOR]${NC} $message" ;;
        "ERROR") echo -e "${RED}[MONITOR]${NC} $message" ;;
    esac
    
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

check_server_health() {
    # Try to connect to the server
    if curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$HEALTH_CHECK_URL" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

restart_server() {
    log "WARN" "Restarting server..."
    
    # Kill existing processes
    pkill -f "next dev" 2>/dev/null || true
    pkill -f "node.*dev-server" 2>/dev/null || true
    
    sleep 2
    
    # Start the robust dev server in background
    nohup npm run dev > /dev/null 2>&1 &
    
    # Wait for server to come up
    local wait_time=0
    local max_wait=60
    
    while [ $wait_time -lt $max_wait ]; do
        if check_server_health; then
            log "INFO" "Server restarted successfully"
            FAILURE_COUNT=0
            return 0
        fi
        sleep 2
        wait_time=$((wait_time + 2))
    done
    
    log "ERROR" "Failed to restart server after ${max_wait} seconds"
    return 1
}

monitor_loop() {
    log "INFO" "Starting server monitor (checking every ${CHECK_INTERVAL}s)"
    log "INFO" "Monitoring: $HEALTH_CHECK_URL"
    
    while true; do
        if check_server_health; then
            if [ $FAILURE_COUNT -gt 0 ]; then
                log "INFO" "Server recovered (was down for $FAILURE_COUNT checks)"
                FAILURE_COUNT=0
            fi
        else
            FAILURE_COUNT=$((FAILURE_COUNT + 1))
            log "WARN" "Server not responding (failure $FAILURE_COUNT/$MAX_FAILURES)"
            
            if [ $FAILURE_COUNT -ge $MAX_FAILURES ]; then
                log "ERROR" "Server down for $MAX_FAILURES consecutive checks"
                restart_server
            fi
        fi
        
        sleep $CHECK_INTERVAL
    done
}

# Handle signals
trap 'log "INFO" "Monitor stopped"; exit 0' INT TERM

# Main
case "${1:-}" in
    "start")
        # Check if monitor is already running
        if pgrep -f "dev-monitor.sh" | grep -v $$ > /dev/null; then
            log "WARN" "Monitor already running"
            exit 1
        fi
        
        log "INFO" "Development server monitor starting..."
        monitor_loop
        ;;
    "stop")
        pkill -f "dev-monitor.sh" 2>/dev/null || true
        log "INFO" "Monitor stopped"
        ;;
    "status")
        if pgrep -f "dev-monitor.sh" > /dev/null; then
            echo "Monitor is running"
            if check_server_health; then
                echo "Server is healthy"
            else
                echo "Server is not responding"
            fi
        else
            echo "Monitor is not running"
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|status}"
        echo ""
        echo "This monitor will:"
        echo "  - Check server health every ${CHECK_INTERVAL} seconds"
        echo "  - Automatically restart after ${MAX_FAILURES} consecutive failures"
        echo "  - Log all activities to ${LOG_FILE}"
        exit 1
        ;;
esac