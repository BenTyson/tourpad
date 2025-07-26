#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

class StableDevServer {
  constructor() {
    this.server = null;
    this.isRunning = false;
    this.restartCount = 0;
    this.maxRestarts = 10;
    this.lastRestart = 0;
    this.restartCooldown = 5000; // 5 seconds between restarts
    
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

  getMemorySettings() {
    const totalMemory = os.totalmem();
    const memoryGB = Math.floor(totalMemory / (1024 * 1024 * 1024));
    
    // Conservative memory allocation
    let maxOldSpace = Math.min(4096, Math.max(2048, Math.floor(memoryGB * 0.4 * 1024)));
    
    this.log(`System Memory: ${memoryGB}GB, Allocating: ${maxOldSpace}MB`);
    
    return {
      maxOldSpace,
      maxSemiSpace: Math.floor(maxOldSpace / 16)
    };
  }

  createServerProcess() {
    const memory = this.getMemorySettings();
    
    // Conservative Node.js flags for stability
    const nodeFlags = [
      `--max-old-space-size=${memory.maxOldSpace}`,
      '--trace-warnings',
      '--no-deprecation'
    ];

    // Environment variables for stability
    const env = {
      ...process.env,
      NODE_OPTIONS: nodeFlags.join(' '),
      NEXT_TELEMETRY_DISABLED: '1',
      FORCE_COLOR: '1',
      NODE_ENV: 'development',
      // Disable aggressive optimizations
      WEBPACK_DEVTOOL: 'eval-cheap-module-source-map',
      // Conservative memory management
      UV_THREADPOOL_SIZE: '64',
      // Disable file watching issues
      CHOKIDAR_USEPOLLING: 'false',
      CHOKIDAR_INTERVAL: '2000',
      // Disable experimental features
      NEXT_WEBPACK_USEPOLLING: 'false',
      NEXT_WEBPACK_POLL: 'false'
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
    if (this.isRunning) {
      this.log('Server already running');
      return;
    }

    try {
      this.server = this.createServerProcess();
      this.isRunning = true;
      
      this.server.on('exit', this.handleExit);
      this.server.on('error', this.handleError);
      
      this.log('Development server started successfully');
      
    } catch (error) {
      this.log(`Failed to start server: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  handleExit(code, signal) {
    this.isRunning = false;
    this.server = null;
    
    if (code !== 0 && code !== null) {
      this.log(`Server exited with code ${code}${signal ? ` (signal: ${signal})` : ''}`, 'error');
      
      const now = Date.now();
      const timeSinceLastRestart = now - this.lastRestart;
      
      // Only restart if enough time has passed
      if (timeSinceLastRestart > this.restartCooldown && this.restartCount < this.maxRestarts) {
        this.lastRestart = now;
        this.restartCount++;
        this.log(`Restarting server (attempt ${this.restartCount}/${this.maxRestarts})...`, 'warn');
        
        setTimeout(() => {
          this.start();
        }, 2000);
      } else if (this.restartCount >= this.maxRestarts) {
        this.log(`Maximum restart attempts (${this.maxRestarts}) reached. Manual intervention required.`, 'error');
        process.exit(1);
      } else {
        this.log('Server restart skipped due to cooldown period', 'warn');
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
    if (!this.isRunning) {
      this.start();
      return;
    }
    
    this.log('Restarting server...', 'warn');
    
    if (this.server) {
      this.server.kill('SIGTERM');
    }
    
    setTimeout(() => {
      this.start();
    }, 1000);
  }

  stop() {
    this.log('Shutting down development server...');
    
    if (this.server) {
      this.server.kill('SIGTERM');
      
      // Force kill after 5 seconds if it doesn't stop gracefully
      setTimeout(() => {
        if (this.server) {
          this.log('Force killing server process', 'warn');
          this.server.kill('SIGKILL');
        }
      }, 5000);
    }
    
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }
}

// Create and start the server
const server = new StableDevServer();
server.start(); 