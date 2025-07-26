#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('🚀 Starting simple, stable development server...');

// Simple environment setup
const env = {
  ...process.env,
  NODE_ENV: 'development',
  NEXT_TELEMETRY_DISABLED: '1',
  FORCE_COLOR: '1',
  // Conservative memory settings
  NODE_OPTIONS: '--max-old-space-size=4096 --no-deprecation',
  // Disable problematic features
  CHOKIDAR_USEPOLLING: 'false',
  CHOKIDAR_INTERVAL: '2000',
  // Disable webpack polling
  NEXT_WEBPACK_USEPOLLING: 'false',
  NEXT_WEBPACK_POLL: 'false'
};

// Start Next.js directly with minimal options
const server = spawn('npx', ['next', 'dev', '-H', '0.0.0.0', '-p', '3001'], {
  stdio: 'inherit',
  env,
  cwd: process.cwd()
});

// Simple error handling
server.on('error', (error) => {
  console.error('❌ Server error:', error.message);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
    process.exit(code);
  } else {
    console.log('✅ Server stopped normally');
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGTERM');
}); 