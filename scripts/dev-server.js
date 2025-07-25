#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

class DevServerManager {
  constructor() {
    this.server = null;
    this.restartCount = 0;
    this.maxRestarts = 5;
    this.restartDelay = 2000;
    this.lastCrash = 0;
    this.watchedFiles = new Set();
    this.isRestarting = false;
    
    // Bind methods
    this.start = this.start.bind(this);
    this.restart = this.restart.bind(this);
    this.stop = this.stop.bind(this);
    this.handleExit = this.handleExit.bind(this);
    this.handleError = this.handleError.bind(this);
    
    // Setup graceful shutdown
    process.on('SIGINT', this.stop);
    process.on('SIGTERM', this.stop);
    process.on('uncaughtException', this.handleError);
    process.on('unhandledRejection', this.handleError);
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : '✅';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  getOptimalMemorySettings() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const memoryGB = Math.floor(totalMemory / (1024 * 1024 * 1024));
    
    // Allocate 50-75% of available memory, with reasonable limits
    let maxOldSpace = Math.min(8192, Math.max(4096, Math.floor(memoryGB * 0.6 * 1024)));
    let maxSemiSpace = Math.min(512, Math.max(256, Math.floor(maxOldSpace / 16)));
    
    this.log(`System Memory: ${memoryGB}GB, Allocating: ${maxOldSpace}MB old space, ${maxSemiSpace}MB semi space`);
    
    return {
      maxOldSpace,
      maxSemiSpace
    };
  }

  createServerProcess() {
    const memory = this.getOptimalMemorySettings();
    
    // Enhanced Node.js flags for stability (only allowed options)
    const nodeFlags = [
      `--max-old-space-size=${memory.maxOldSpace}`,
      '--trace-warnings',
      '--unhandled-rejections=warn'
    ];

    // Environment variables for Next.js optimization
    const env = {
      ...process.env,
      NODE_OPTIONS: nodeFlags.join(' '),
      NEXT_TELEMETRY_DISABLED: '1',
      FORCE_COLOR: '1',
      NODE_ENV: 'development',
      // Webpack optimization
      WEBPACK_DEVTOOL: 'eval-cheap-module-source-map',
      // Memory management
      UV_THREADPOOL_SIZE: '128',
      // File watching optimization
      CHOKIDAR_USEPOLLING: 'false',
      CHOKIDAR_INTERVAL: '1000'
    };

    this.log(`Starting Next.js server with memory: ${memory.maxOldSpace}MB`);
    
    const server = spawn('npx', ['next', 'dev', '-H', '0.0.0.0', '-p', '3001'], {
      stdio: 'inherit',
      env,
      cwd: process.cwd(),
      detached: false
    });

    return server;
  }

  start() {
    if (this.server) {
      this.log('Server already running');
      return;
    }

    try {
      this.server = this.createServerProcess();
      
      this.server.on('exit', this.handleExit);
      this.server.on('error', this.handleError);
      
      // Monitor memory usage
      this.startMemoryMonitoring();
      
      this.log('Development server started successfully');
      
    } catch (error) {
      this.log(`Failed to start server: ${error.message}`, 'error');
      this.handleError(error);
    }
  }

  startMemoryMonitoring() {
    // Monitor memory every 30 seconds
    this.memoryInterval = setInterval(() => {
      if (!this.server) return;
      
      const usage = process.memoryUsage();
      const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
      const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024);
      const externalMB = Math.round(usage.external / 1024 / 1024);
      
      // Log memory stats every 5 minutes or if memory is high
      const isHighMemory = heapUsedMB > 2048;
      
      if (Date.now() % 300000 < 30000 || isHighMemory) {
        this.log(`Memory: Heap ${heapUsedMB}/${heapTotalMB}MB, External ${externalMB}MB${isHighMemory ? ' (HIGH)' : ''}`);
      }
      
      // Force garbage collection if available and memory is high
      if (global.gc && heapUsedMB > 3072) {
        global.gc();
        this.log('Forced garbage collection due to high memory usage');
      }
      
    }, 30000);
  }

  handleExit(code, signal) {
    if (this.memoryInterval) {
      clearInterval(this.memoryInterval);
    }
    
    this.server = null;
    
    if (this.isRestarting) {
      this.log('Server stopped during restart process');
      return;
    }

    const now = Date.now();
    const timeSinceLastCrash = now - this.lastCrash;
    
    if (code !== 0 && code !== null) {
      this.log(`Server exited with code ${code}${signal ? ` (signal: ${signal})` : ''}`, 'error');
      
      // Reset restart count if it's been more than 5 minutes since last crash
      if (timeSinceLastCrash > 300000) {
        this.restartCount = 0;
      }
      
      if (this.restartCount < this.maxRestarts) {
        this.lastCrash = now;
        this.restart();
      } else {
        this.log(`Maximum restart attempts (${this.maxRestarts}) reached. Manual intervention required.`, 'error');
        process.exit(1);
      }
    } else {
      this.log('Server stopped normally');
    }
  }

  handleError(error) {
    this.log(`Server error: ${error.message}`, 'error');
    
    if (this.server) {
      this.server.kill('SIGTERM');
    }
  }

  restart() {
    if (this.isRestarting) {
      this.log('Restart already in progress');
      return;
    }
    
    this.isRestarting = true;
    this.restartCount++;
    
    this.log(`Restarting server (attempt ${this.restartCount}/${this.maxRestarts})...`, 'warn');
    
    if (this.server) {
      this.server.kill('SIGTERM');
    }
    
    setTimeout(() => {
      this.isRestarting = false;
      this.start();
    }, this.restartDelay);
  }

  stop() {
    this.log('Shutting down development server...');
    
    if (this.memoryInterval) {
      clearInterval(this.memoryInterval);
    }
    
    if (this.server) {
      this.server.kill('SIGTERM');
      
      // Force kill after 10 seconds if it doesn't stop gracefully
      setTimeout(() => {
        if (this.server) {
          this.log('Force killing server process', 'warn');
          this.server.kill('SIGKILL');
        }
      }, 10000);
    }
    
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }
}

// Create and start the server manager
const manager = new DevServerManager();
manager.start();

// Handle manual restart via SIGUSR2 (sent by nodemon)
process.on('SIGUSR2', () => {
  manager.log('Received restart signal');
  manager.restart();
});