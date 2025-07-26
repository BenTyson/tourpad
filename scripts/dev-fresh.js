#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 COMPLETE FRESH START - Clearing everything...');

// Kill any existing processes
try {
  const { execSync } = require('child_process');
  execSync('pkill -f "next dev"', { stdio: 'ignore' });
  execSync('pkill -f "node.*next"', { stdio: 'ignore' });
  console.log('✅ Killed existing processes');
} catch (error) {
  console.log('ℹ️ No existing processes to kill');
}

// Clear all cache and build files
const dirsToRemove = [
  '.next',
  'node_modules/.cache',
  '.turbo',
  'dist',
  'build'
];

dirsToRemove.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`✅ Removed ${dir}`);
  }
});

// Clear lock files
const lockFiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];
lockFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`✅ Removed ${file}`);
  }
});

// Reinstall dependencies
console.log('📦 Reinstalling dependencies...');
try {
  const { execSync } = require('child_process');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies reinstalled');
} catch (error) {
  console.error('❌ Failed to reinstall dependencies:', error.message);
  process.exit(1);
}

console.log('🚀 Starting fresh server...');

// Start the simple server
const server = spawn('node', ['scripts/dev-simple.js'], {
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