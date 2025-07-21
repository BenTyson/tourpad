#!/bin/bash

# Robust Development Server Script
# This script provides comprehensive error handling and recovery for Next.js development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
MAX_RETRIES=5
RETRY_DELAY=3
LOG_FILE="dev-server.log"
PID_FILE=".dev-server.pid"

# Functions
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "INFO")
            echo -e "${GREEN}[INFO]${NC} $message"
            ;;
        "WARN")
            echo -e "${YELLOW}[WARN]${NC} $message"
            ;;
        "ERROR")
            echo -e "${RED}[ERROR]${NC} $message"
            ;;
        "DEBUG")
            echo -e "${BLUE}[DEBUG]${NC} $message"
            ;;
    esac
    
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

cleanup() {
    log "INFO" "Cleaning up..."
    
    # Kill any running Next.js processes
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            log "INFO" "Stopping server process $pid"
            kill "$pid" 2>/dev/null || true
            sleep 2
            kill -9 "$pid" 2>/dev/null || true
        fi
        rm -f "$PID_FILE"
    fi
    
    # Kill any orphaned Next.js processes
    pkill -f "next dev" 2>/dev/null || true
    pkill -f "node.*next.*dev" 2>/dev/null || true
    
    log "INFO" "Cleanup completed"
}

check_prerequisites() {
    log "INFO" "Checking prerequisites..."
    
    # Check Node.js version
    if ! command -v node &> /dev/null; then
        log "ERROR" "Node.js is not installed"
        exit 1
    fi
    
    local node_version=$(node --version | cut -d'v' -f2)
    log "INFO" "Node.js version: $node_version"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log "ERROR" "npm is not installed"
        exit 1
    fi
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        log "WARN" "node_modules not found, installing dependencies..."
        npm install
    fi
    
    # Check if .next cache is problematic
    if [ -d ".next" ]; then
        local cache_size=$(du -s .next 2>/dev/null | cut -f1 || echo "0")
        if [ "$cache_size" -gt 1000000 ]; then  # > 1GB
            log "WARN" "Large .next cache detected (${cache_size}KB), clearing..."
            rm -rf .next
        fi
    fi
    
    log "INFO" "Prerequisites check completed"
}

optimize_environment() {
    log "INFO" "Optimizing environment..."
    
    # Set optimal memory settings
    local total_memory=$(sysctl -n hw.memsize 2>/dev/null || echo "8589934592") # Default 8GB
    local memory_gb=$((total_memory / 1024 / 1024 / 1024))
    local max_old_space=$((memory_gb * 512))  # 50% of memory in MB
    
    if [ "$max_old_space" -lt 4096 ]; then
        max_old_space=4096
    elif [ "$max_old_space" -gt 8192 ]; then
        max_old_space=8192
    fi
    
    export NODE_OPTIONS="--max-old-space-size=$max_old_space --optimize-for-size --gc-interval=100"
    export NEXT_TELEMETRY_DISABLED=1
    export FORCE_COLOR=1
    export UV_THREADPOOL_SIZE=128
    
    log "INFO" "Memory optimized: ${max_old_space}MB heap"
}

start_server() {
    local attempt=$1
    
    log "INFO" "Starting development server (attempt $attempt/$MAX_RETRIES)..."
    
    # Start the server in background and capture PID
    npm run dev:stable > "$LOG_FILE" 2>&1 &
    local server_pid=$!
    echo "$server_pid" > "$PID_FILE"
    
    log "INFO" "Server started with PID: $server_pid"
    
    # Wait for server to start (check for success indicators)
    local wait_time=0
    local max_wait=60
    local server_ready=false
    
    while [ $wait_time -lt $max_wait ]; do
        if grep -q "Ready" "$LOG_FILE" 2>/dev/null || grep -q "Local:" "$LOG_FILE" 2>/dev/null; then
            server_ready=true
            break
        fi
        
        # Check if process is still running
        if ! kill -0 "$server_pid" 2>/dev/null; then
            log "ERROR" "Server process died during startup"
            return 1
        fi
        
        sleep 2
        wait_time=$((wait_time + 2))
    done
    
    if [ "$server_ready" = true ]; then
        log "INFO" "Server is ready and running at http://localhost:3000"
        return 0
    else
        log "ERROR" "Server failed to start within ${max_wait} seconds"
        return 1
    fi
}

monitor_server() {
    local server_pid=$(cat "$PID_FILE" 2>/dev/null || echo "")
    
    if [ -z "$server_pid" ]; then
        log "ERROR" "No server PID found"
        return 1
    fi
    
    log "INFO" "Monitoring server (PID: $server_pid)"
    
    while true; do
        if ! kill -0 "$server_pid" 2>/dev/null; then
            log "WARN" "Server process has died"
            return 1
        fi
        
        # Check for memory issues in logs
        if tail -n 20 "$LOG_FILE" | grep -qi "out of memory\|heap out of memory\|allocation failed"; then
            log "WARN" "Memory issues detected in logs"
            return 2
        fi
        
        sleep 10
    done
}

main() {
    log "INFO" "Starting robust development server..."
    
    # Setup trap for cleanup
    trap cleanup EXIT INT TERM
    
    # Initial setup
    check_prerequisites
    optimize_environment
    
    local attempt=1
    
    while [ $attempt -le $MAX_RETRIES ]; do
        log "INFO" "=== Attempt $attempt/$MAX_RETRIES ==="
        
        # Clean up any previous attempts
        cleanup
        
        # Start server
        if start_server $attempt; then
            # Monitor server and handle crashes
            monitor_server
            local exit_code=$?
            
            if [ $exit_code -eq 1 ]; then
                log "WARN" "Server crashed, attempting restart..."
            elif [ $exit_code -eq 2 ]; then
                log "WARN" "Memory issues detected, clearing cache and restarting..."
                rm -rf .next
            fi
        else
            log "ERROR" "Failed to start server on attempt $attempt"
        fi
        
        if [ $attempt -lt $MAX_RETRIES ]; then
            log "INFO" "Waiting ${RETRY_DELAY} seconds before retry..."
            sleep $RETRY_DELAY
        fi
        
        attempt=$((attempt + 1))
    done
    
    log "ERROR" "Maximum retry attempts reached. Server failed to start reliably."
    log "INFO" "Check $LOG_FILE for detailed error information"
    exit 1
}

# Handle script arguments
case "${1:-}" in
    "stop")
        cleanup
        log "INFO" "Server stopped"
        exit 0
        ;;
    "restart")
        cleanup
        sleep 2
        main
        ;;
    "status")
        if [ -f "$PID_FILE" ]; then
            local pid=$(cat "$PID_FILE")
            if kill -0 "$pid" 2>/dev/null; then
                log "INFO" "Server is running (PID: $pid)"
                exit 0
            else
                log "INFO" "Server is not running (stale PID file)"
                rm -f "$PID_FILE"
                exit 1
            fi
        else
            log "INFO" "Server is not running"
            exit 1
        fi
        ;;
    "")
        main
        ;;
    *)
        echo "Usage: $0 [start|stop|restart|status]"
        exit 1
        ;;
esac