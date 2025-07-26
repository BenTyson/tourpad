#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing Next.js cache...');

// Clear Next.js cache
if (fs.existsSync('.next')) {
  fs.rmSync('.next', { recursive: true, force: true });
  console.log('✅ Cleared .next directory');
}

// Clear node modules cache
if (fs.existsSync('node_modules/.cache')) {
  fs.rmSync('node_modules/.cache', { recursive: true, force: true });
  console.log('✅ Cleared node_modules cache');
}

// Clear any lock files that might cause issues
const lockFiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];
lockFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`✅ Removed ${file}`);
  }
});

console.log('🚀 Starting server with clean cache...');

// Start the stable server
const { spawn: spawnChild } = require('child_process');
const server = spawnChild('node', ['scripts/dev-stable.js'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

server.on('exit', (code) => {
  process.exit(code);
});

process.on('SIGINT', () => {
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
}); 