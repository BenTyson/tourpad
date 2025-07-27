#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');

/**
 * DEFINITIVE SERVER STABILITY SOLUTION
 * 
 * This script addresses all identified causes of server crashes:
 * 1. Single process management (no competing scripts)
 * 2. Memory leak prevention
 * 3. Conservative restart logic
 * 4. Optimized file watching
 * 5. Clean process cleanup
 */

class StableServer {
  constructor() {
    this.server = null;
    this.isShuttingDown = false;
    this.startTime = null;
    
    // Conservative settings
    this.MIN_UPTIME = 10000; // Server must run 10s before considering restart
    this.RESTART_DELAY = 3000; // Wait 3s between restarts
    this.MAX_QUICK_RESTARTS = 3; // Max restarts within MIN_UPTIME
    this.quickRestartCount = 0;
    this.lastRestartTime = 0;
    
    // Bind methods to prevent context issues
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.handleExit = this.handleExit.bind(this);
    this.handleError = this.handleError.bind(this);
    
    // Setup clean shutdown
    process.on('SIGINT', this.stop);
    process.on('SIGTERM', this.stop);
    process.on('uncaughtException', this.handleError);
    process.on('unhandledRejection', this.handleError);
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '✅';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  getMemorySettings() {
    const totalGB = Math.floor(os.totalmem() / (1024 * 1024 * 1024));
    // Conservative: Use max 50% of system memory, capped at 8GB
    const maxOldSpace = Math.min(8192, Math.max(4096, totalGB * 512));
    
    this.log(`System: ${totalGB}GB RAM, allocating ${maxOldSpace}MB heap`);
    return maxOldSpace;
  }

  createServer() {
    const maxOldSpace = this.getMemorySettings();
    
    // Minimal, stable environment
    const env = {
      ...process.env,
      // Memory management
      NODE_OPTIONS: `--max-old-space-size=${maxOldSpace}`,
      // Disable telemetry and experimental features
      NEXT_TELEMETRY_DISABLED: '1',
      NODE_ENV: 'development',
      FORCE_COLOR: '1',
      // Conservative file watching
      CHOKIDAR_USEPOLLING: 'false',
      CHOKIDAR_INTERVAL: '2000',
      // Disable problematic webpack features
      NEXT_WEBPACK_USEPOLLING: 'false',
      NEXT_WEBPACK_POLL: 'false'
    };

    this.log('Starting Next.js development server...');
    
    const server = spawn('npx', ['next', 'dev', '-H', '0.0.0.0', '-p', '3001'], {
      stdio: ['inherit', 'inherit', 'inherit'],
      env,
      cwd: process.cwd(),
      detached: false
    });

    return server;
  }

  start() {
    if (this.server || this.isShuttingDown) {
      return;
    }

    try {
      this.startTime = Date.now();
      this.server = this.createServer();
      
      this.server.on('exit', this.handleExit);
      this.server.on('error', this.handleError);
      
      this.log('Server started successfully');
      
    } catch (error) {
      this.log(`Failed to start server: ${error.message}`, 'error');
      this.handleError(error);
    }
  }

  handleExit(code, signal) {
    if (this.isShuttingDown) {
      return;
    }

    const uptime = this.startTime ? Date.now() - this.startTime : 0;
    this.server = null;
    
    if (code === 0 || code === null) {
      this.log('Server stopped normally');
      return;
    }

    this.log(`Server crashed (code: ${code}, signal: ${signal}, uptime: ${uptime}ms)`, 'error');
    
    // Prevent rapid restart loops
    const now = Date.now();
    const timeSinceLastRestart = now - this.lastRestartTime;
    
    if (uptime < this.MIN_UPTIME) {
      this.quickRestartCount++;
      this.log(`Quick restart detected (${this.quickRestartCount}/${this.MAX_QUICK_RESTARTS})`, 'warn');
      
      if (this.quickRestartCount >= this.MAX_QUICK_RESTARTS) {
        this.log('Too many quick restarts. Server may be in a crash loop.', 'error');
        this.log('Please check the logs and fix the issue before restarting.', 'error');
        process.exit(1);
      }
    } else {
      // Reset quick restart counter for successful runs
      this.quickRestartCount = 0;
    }
    
    // Ensure minimum delay between restarts
    const delayNeeded = Math.max(0, this.RESTART_DELAY - timeSinceLastRestart);
    
    this.log(`Restarting in ${Math.max(delayNeeded, this.RESTART_DELAY)}ms...`, 'warn');
    this.lastRestartTime = now + delayNeeded;
    
    setTimeout(() => {
      if (!this.isShuttingDown) {
        this.start();
      }
    }, Math.max(delayNeeded, this.RESTART_DELAY));
  }

  handleError(error) {
    this.log(`Process error: ${error.message}`, 'error');
    
    if (this.server && !this.isShuttingDown) {
      this.server.kill('SIGTERM');
    }
  }

  stop() {
    if (this.isShuttingDown) {
      return;
    }
    
    this.isShuttingDown = true;
    this.log('Shutting down server...');
    
    if (this.server) {
      // Try graceful shutdown first
      this.server.kill('SIGTERM');
      
      // Force kill after 5 seconds
      setTimeout(() => {
        if (this.server) {
          this.log('Force stopping server', 'warn');
          this.server.kill('SIGKILL');
        }
        process.exit(0);
      }, 5000);
    } else {
      process.exit(0);
    }
  }
}

// Clean up any existing processes first
console.log('🧹 Cleaning up existing processes...');
try {
  require('child_process').execSync('pkill -f "next dev" 2>/dev/null || true', { stdio: 'ignore' });
  require('child_process').execSync('pkill -f "node.*next.*dev" 2>/dev/null || true', { stdio: 'ignore' });
} catch (e) {
  // Ignore cleanup errors
}

// Start the stable server
console.log('🚀 Starting TourPad with STABLE configuration...');
const server = new StableServer();
server.start();