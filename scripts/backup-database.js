#!/usr/bin/env node

/**
 * Database Backup Script for TourPad
 * Creates timestamped backups of the PostgreSQL database
 *
 * Usage:
 *   npm run db:backup                 # Create backup with timestamp
 *   npm run db:backup -- --name custom # Create backup with custom name
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Load environment variables
require('dotenv').config();

// Configuration
const BACKUP_DIR = path.join(process.cwd(), 'backups');
const DATABASE_URL = process.env.DATABASE_URL;

// Parse command line arguments
const args = process.argv.slice(2);
const customName = args.includes('--name') ? args[args.indexOf('--name') + 1] : null;

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log(`📁 Created backup directory: ${BACKUP_DIR}`);
}

// Parse database URL
function parseDatabaseUrl(url) {
  if (!url) {
    console.error('\n❌ DATABASE_URL environment variable is not set\n');
    console.log('Please create a .env file with your database connection:');
    console.log('DATABASE_URL="postgresql://username:password@localhost:5432/tourpad"\n');
    console.log('You can copy .env.example to .env and update with your credentials:');
    console.log('cp .env.example .env\n');
    process.exit(1);
  }

  // Try format with password first
  let match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (match) {
    const [, user, password, host, port, database] = match;
    return { user, password, host, port, database };
  }

  // Try format without password (common on macOS)
  match = url.match(/postgresql:\/\/([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (match) {
    const [, user, host, port, database] = match;
    return { user, password: '', host, port, database };
  }

  // Try format without password and port
  match = url.match(/postgresql:\/\/([^@]+)@([^\/]+)\/(.+)/);
  if (match) {
    const [, user, host, database] = match;
    return { user, password: '', host, port: '5432', database };
  }

  console.error('\n❌ Invalid DATABASE_URL format\n');
  console.log('Supported formats:');
  console.log('  postgresql://username:password@host:port/database');
  console.log('  postgresql://username@host:port/database');
  console.log('  postgresql://username@host/database\n');
  console.log('Current value:', url ? url.substring(0, 50) + '...' : 'undefined');
  process.exit(1);
}

// Generate backup filename
function generateBackupFilename(customName) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const name = customName || `backup-${timestamp}`;
  return `${name}.sql`;
}

// Create database backup
async function createBackup() {
  try {
    console.log('🚀 Starting TourPad database backup...\n');

    // Parse database connection details
    const { user, password, host, port, database } = parseDatabaseUrl(DATABASE_URL);

    // Generate backup filename
    const backupFilename = generateBackupFilename(customName);
    const backupPath = path.join(BACKUP_DIR, backupFilename);

    // Display connection info (without password)
    console.log('📊 Database Information:');
    console.log(`   Host: ${host}:${port}`);
    console.log(`   Database: ${database}`);
    console.log(`   User: ${user}`);
    console.log(`   Backup file: ${backupFilename}\n`);

    // Set PGPASSWORD environment variable for pg_dump (only if password exists)
    const env = { ...process.env };
    if (password) {
      env.PGPASSWORD = password;
    }

    // Create the backup using pg_dump
    console.log('💾 Creating backup...');

    const pgDumpCommand = [
      'pg_dump',
      `-h ${host}`,
      `-p ${port}`,
      `-U ${user}`,
      `-d ${database}`,
      '--no-password',
      '--verbose',
      '--clean',
      '--no-owner',
      '--no-privileges',
      '--if-exists',
      '--format=plain',
      '--encoding=UTF8',
      '--schema=public',
      '--exclude-schema=_prisma_migrations',
      `-f "${backupPath}"`
    ].join(' ');

    try {
      execSync(pgDumpCommand, {
        env,
        stdio: ['ignore', 'pipe', 'pipe'],
        maxBuffer: 1024 * 1024 * 100 // 100MB buffer
      });
    } catch (error) {
      // Check if pg_dump is installed
      if (error.message.includes('command not found') || error.message.includes('is not recognized')) {
        console.error('\n❌ Error: pg_dump is not installed.');
        console.log('\n📦 To install PostgreSQL tools:');
        console.log('   macOS: brew install postgresql');
        console.log('   Ubuntu/Debian: sudo apt-get install postgresql-client');
        console.log('   Windows: Download from https://www.postgresql.org/download/windows/\n');
        process.exit(1);
      }
      throw error;
    }

    // Check if backup was created successfully
    if (fs.existsSync(backupPath)) {
      const stats = fs.statSync(backupPath);
      const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);

      console.log('\n✅ Backup created successfully!');
      console.log(`📁 Location: ${backupPath}`);
      console.log(`📊 Size: ${sizeInMB} MB`);

      // Get record counts for verification
      console.log('\n📈 Database Statistics:');
      try {
        const tables = [
          'users',
          'artists',
          'hosts',
          'fans',
          'bookings',
          'messages',
          'conversations',
          'payments'
        ];

        for (const table of tables) {
          try {
            const countCommand = `psql "postgresql://${user}:${password}@${host}:${port}/${database}" -t -c "SELECT COUNT(*) FROM ${table};"`;
            const count = execSync(countCommand, {
              encoding: 'utf8',
              stdio: ['ignore', 'pipe', 'ignore']
            }).trim();
            console.log(`   ${table}: ${count} records`);
          } catch (e) {
            // Table might not exist, skip silently
          }
        }
      } catch (e) {
        console.log('   (Could not retrieve table statistics)');
      }

      // List recent backups
      console.log('\n📚 Recent Backups:');
      const backups = fs.readdirSync(BACKUP_DIR)
        .filter(file => file.endsWith('.sql'))
        .map(file => {
          const filePath = path.join(BACKUP_DIR, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            size: (stats.size / 1024 / 1024).toFixed(2),
            date: stats.mtime
          };
        })
        .sort((a, b) => b.date - a.date)
        .slice(0, 5);

      backups.forEach(backup => {
        const dateStr = backup.date.toLocaleString();
        console.log(`   ${backup.name} (${backup.size} MB) - ${dateStr}`);
      });

      console.log('\n💡 To restore this backup later, run:');
      console.log(`   npm run db:restore -- --file ${backupFilename}\n`);

    } else {
      throw new Error('Backup file was not created');
    }

  } catch (error) {
    console.error('\n❌ Backup failed:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run the backup
createBackup().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});