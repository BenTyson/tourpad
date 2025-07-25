#!/bin/bash

# Enhanced Development Server with Nodemon Auto-Restart
# This script combines the robustness of dev-robust.sh with automatic file watching

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
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
    log "INFO" "Cleaning up nodemon processes..."
    
    # Kill any running nodemon processes
    pkill -f "nodemon" 2>/dev/null || true
    pkill -f "node.*dev-server.js" 2>/dev/null || true
    pkill -f "next dev" 2>/dev/null || true
    
    # Clean up PID file
    rm -f "$PID_FILE"
    
    log "INFO" "Cleanup completed"
}

check_prerequisites() {
    log "INFO" "Checking prerequisites for nodemon development..."
    
    # Check Node.js version
    if ! command -v node &> /dev/null; then
        log "ERROR" "Node.js is not installed"
        exit 1
    fi
    
    local node_version=$(node --version | cut -d'v' -f2)
    log "INFO" "Node.js version: $node_version"
    
    # Check if nodemon is available
    if ! command -v npx &> /dev/null; then
        log "ERROR" "npx is not available"
        exit 1
    fi
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        log "WARN" "node_modules not found, installing dependencies..."
        npm install
    fi
    
    # Check nodemon configuration
    if [ ! -f "nodemon.json" ]; then
        log "WARN" "nodemon.json not found, using default configuration"
    else
        log "INFO" "Found nodemon.json configuration"
    fi
    
    log "INFO" "Prerequisites check completed"
}

optimize_environment() {
    log "INFO" "Optimizing environment for nodemon..."
    
    # Set optimal memory settings
    local total_memory=$(sysctl -n hw.memsize 2>/dev/null || echo "8589934592") # Default 8GB
    local memory_gb=$((total_memory / 1024 / 1024 / 1024))
    local max_old_space=$((memory_gb * 512))  # 50% of memory in MB
    
    if [ "$max_old_space" -lt 4096 ]; then
        max_old_space=4096
    elif [ "$max_old_space" -gt 8192 ]; then
        max_old_space=8192
    fi
    
    export NODE_OPTIONS="--max-old-space-size=$max_old_space"
    export NEXT_TELEMETRY_DISABLED=1
    export FORCE_COLOR=1
    export UV_THREADPOOL_SIZE=128
    
    # File watching optimizations
    export CHOKIDAR_USEPOLLING=false
    export CHOKIDAR_INTERVAL=1000
    
    log "INFO" "Memory optimized: ${max_old_space}MB heap"
    log "INFO" "File watching optimized"
}

start_nodemon() {
    log "INFO" "Starting development server with nodemon auto-restart..."
    
    # Start nodemon with our configuration
    npm run dev:watch &
    local nodemon_pid=$!
    echo "$nodemon_pid" > "$PID_FILE"
    
    log "INFO" "Nodemon started with PID: $nodemon_pid"
    log "INFO" "Server will restart automatically when files change"
    log "INFO" "Available at http://localhost:3001"
    log "INFO" "Press Ctrl+C to stop, or type 'rs' and Enter to manually restart"
    
    # Wait for the nodemon process
    wait $nodemon_pid
}

main() {
    log "INFO" "🚀 Starting development server with auto-restart..."
    
    # Setup trap for cleanup
    trap cleanup EXIT INT TERM
    
    # Initial setup
    check_prerequisites
    optimize_environment
    
    # Clean up any previous processes
    cleanup
    
    # Start nodemon
    start_nodemon
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
                log "INFO" "Nodemon is running (PID: $pid)"
                exit 0
            else
                log "INFO" "Nodemon is not running (stale PID file)"
                rm -f "$PID_FILE"
                exit 1
            fi
        else
            log "INFO" "Nodemon is not running"
            exit 1
        fi
        ;;
    "")
        main
        ;;
    *)
        echo "Usage: $0 [start|stop|restart|status]"
        echo ""
        echo "This script starts the development server with nodemon for automatic restarts"
        echo "when files change. It combines the robustness of the stable dev server"
        echo "with the convenience of automatic file watching."
        echo ""
        echo "Features:"
        echo "  - Automatic restart on file changes"
        echo "  - Memory optimization"
        echo "  - Enhanced error handling"
        echo "  - File watching optimization"
        echo "  - Manual restart with 'rs' command"
        exit 1
        ;;
esac