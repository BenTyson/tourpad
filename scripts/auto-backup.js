#!/usr/bin/env node

/**
 * Automated Database Backup Script for TourPad
 * Manages automatic backups with retention policies
 *
 * Usage:
 *   npm run db:auto-backup     # Run automated backup with cleanup
 *   node scripts/auto-backup.js # Direct execution
 *
 * Schedule with cron:
 *   0 2 * * * cd /path/to/tourpad && npm run db:auto-backup
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Configuration
const BACKUP_DIR = path.join(process.cwd(), 'backups');
const DATABASE_URL = process.env.DATABASE_URL;

// Retention policy (customize as needed)
const RETENTION_POLICY = {
  daily: 7,    // Keep daily backups for 7 days
  weekly: 4,   // Keep weekly backups for 4 weeks
  monthly: 3,  // Keep monthly backups for 3 months
  maxSize: 500 // Maximum total backup size in MB
};

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Add subdirectories for organized storage
const DAILY_DIR = path.join(BACKUP_DIR, 'daily');
const WEEKLY_DIR = path.join(BACKUP_DIR, 'weekly');
const MONTHLY_DIR = path.join(BACKUP_DIR, 'monthly');

[DAILY_DIR, WEEKLY_DIR, MONTHLY_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Parse database URL
function parseDatabaseUrl(url) {
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) {
    throw new Error('Invalid DATABASE_URL format');
  }

  const [, user, password, host, port, database] = match;
  return { user, password, host, port, database };
}

// Get backup type based on date
function getBackupType(date = new Date()) {
  const dayOfWeek = date.getDay();
  const dayOfMonth = date.getDate();

  // Monthly backup on the 1st
  if (dayOfMonth === 1) {
    return 'monthly';
  }
  // Weekly backup on Sundays
  if (dayOfWeek === 0) {
    return 'weekly';
  }
  // Daily backup otherwise
  return 'daily';
}

// Generate backup filename
function generateBackupFilename(type) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 10);
  return `${type}-backup-${timestamp}.sql`;
}

// Get directory for backup type
function getBackupDirectory(type) {
  switch(type) {
    case 'monthly':
      return MONTHLY_DIR;
    case 'weekly':
      return WEEKLY_DIR;
    default:
      return DAILY_DIR;
  }
}

// Create backup
function createBackup(type) {
  const { user, password, host, port, database } = parseDatabaseUrl(DATABASE_URL);
  const backupFilename = generateBackupFilename(type);
  const backupDir = getBackupDirectory(type);
  const backupPath = path.join(backupDir, backupFilename);

  console.log(`📦 Creating ${type} backup: ${backupFilename}`);

  const env = { ...process.env, PGPASSWORD: password };
  const pgDumpCommand = [
    'pg_dump',
    `-h ${host}`,
    `-p ${port}`,
    `-U ${user}`,
    `-d ${database}`,
    '--no-password',
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
      stdio: ['ignore', 'ignore', 'ignore'],
      maxBuffer: 1024 * 1024 * 100
    });

    // Compress the backup
    console.log('   Compressing backup...');
    execSync(`gzip -9 "${backupPath}"`);

    const compressedPath = `${backupPath}.gz`;
    const stats = fs.statSync(compressedPath);
    const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);

    console.log(`   ✅ Backup created: ${backupFilename}.gz (${sizeInMB} MB)`);
    return compressedPath;
  } catch (error) {
    console.error(`   ❌ Backup failed: ${error.message}`);
    throw error;
  }
}

// Clean old backups based on retention policy
function cleanOldBackups() {
  console.log('\n🧹 Cleaning old backups...');

  const cleanDirectory = (dir, type, retentionDays) => {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir)
      .filter(file => file.endsWith('.sql.gz'))
      .map(file => ({
        name: file,
        path: path.join(dir, file),
        stats: fs.statSync(path.join(dir, file))
      }));

    const now = Date.now();
    const maxAge = retentionDays * 24 * 60 * 60 * 1000; // Convert days to milliseconds

    let deletedCount = 0;
    files.forEach(file => {
      const age = now - file.stats.mtime.getTime();
      if (age > maxAge) {
        fs.unlinkSync(file.path);
        deletedCount++;
        console.log(`   Deleted old ${type} backup: ${file.name}`);
      }
    });

    if (deletedCount === 0) {
      console.log(`   No old ${type} backups to clean`);
    }
  };

  cleanDirectory(DAILY_DIR, 'daily', RETENTION_POLICY.daily);
  cleanDirectory(WEEKLY_DIR, 'weekly', RETENTION_POLICY.weekly * 7);
  cleanDirectory(MONTHLY_DIR, 'monthly', RETENTION_POLICY.monthly * 30);
}

// Check total backup size
function checkTotalBackupSize() {
  let totalSize = 0;

  [DAILY_DIR, WEEKLY_DIR, MONTHLY_DIR, BACKUP_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) return;

    fs.readdirSync(dir)
      .filter(file => file.endsWith('.sql') || file.endsWith('.sql.gz'))
      .forEach(file => {
        const stats = fs.statSync(path.join(dir, file));
        totalSize += stats.size;
      });
  });

  const totalSizeMB = totalSize / 1024 / 1024;

  if (totalSizeMB > RETENTION_POLICY.maxSize) {
    console.log(`\n⚠️  Warning: Total backup size (${totalSizeMB.toFixed(2)} MB) exceeds limit (${RETENTION_POLICY.maxSize} MB)`);
    console.log('   Consider adjusting retention policy or cleaning old backups manually');
  }

  return totalSizeMB;
}

// Generate backup report
function generateBackupReport() {
  console.log('\n📊 Backup Report:');

  const countBackups = (dir, type) => {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir)
      .filter(file => file.endsWith('.sql.gz'));

    if (files.length > 0) {
      const totalSize = files.reduce((sum, file) => {
        const stats = fs.statSync(path.join(dir, file));
        return sum + stats.size;
      }, 0);

      const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
      console.log(`   ${type}: ${files.length} backups (${sizeMB} MB)`);

      // Show most recent backup
      const mostRecent = files.sort().pop();
      if (mostRecent) {
        const stats = fs.statSync(path.join(dir, mostRecent));
        console.log(`     Latest: ${mostRecent} (${stats.mtime.toLocaleDateString()})`);
      }
    } else {
      console.log(`   ${type}: No backups`);
    }
  };

  countBackups(DAILY_DIR, 'Daily');
  countBackups(WEEKLY_DIR, 'Weekly');
  countBackups(MONTHLY_DIR, 'Monthly');

  const totalSizeMB = checkTotalBackupSize();
  console.log(`\n   Total backup size: ${totalSizeMB.toFixed(2)} MB`);
}

// Main execution
async function runAutoBackup() {
  console.log('🤖 TourPad Automated Backup System');
  console.log('===================================\n');

  try {
    // Check if pg_dump is available
    try {
      execSync('which pg_dump', { stdio: 'ignore' });
    } catch (error) {
      console.error('❌ pg_dump is not installed. Please install PostgreSQL client tools.');
      process.exit(1);
    }

    // Determine backup type
    const backupType = getBackupType();
    console.log(`📅 Date: ${new Date().toLocaleDateString()}`);
    console.log(`📁 Backup type: ${backupType}\n`);

    // Create the backup
    const backupPath = createBackup(backupType);

    // Clean old backups
    cleanOldBackups();

    // Generate report
    generateBackupReport();

    console.log('\n✅ Automated backup completed successfully!\n');

    // Log for cron monitoring
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: backupType,
      status: 'success',
      file: path.basename(backupPath)
    };

    const logFile = path.join(BACKUP_DIR, 'backup.log');
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');

  } catch (error) {
    console.error('\n❌ Automated backup failed:', error.message);

    // Log failure
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'error',
      status: 'failed',
      error: error.message
    };

    const logFile = path.join(BACKUP_DIR, 'backup.log');
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');

    process.exit(1);
  }
}

// Run the automated backup
runAutoBackup();