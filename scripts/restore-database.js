#!/usr/bin/env node

/**
 * Database Restore Script for TourPad
 * Restores database from a backup file
 *
 * Usage:
 *   npm run db:restore -- --file backup.sql  # Restore specific backup
 *   npm run db:restore                       # List available backups and choose
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
const fileIndex = args.indexOf('--file');
const forceIndex = args.indexOf('--force');
const specificFile = fileIndex !== -1 ? args[fileIndex + 1] : null;
const force = forceIndex !== -1;

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
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

// List available backups
function listBackups() {
  if (!fs.existsSync(BACKUP_DIR)) {
    console.log('❌ No backup directory found. Run a backup first with: npm run db:backup');
    return [];
  }

  const backups = fs.readdirSync(BACKUP_DIR)
    .filter(file => file.endsWith('.sql'))
    .map(file => {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        path: filePath,
        size: (stats.size / 1024 / 1024).toFixed(2),
        date: stats.mtime
      };
    })
    .sort((a, b) => b.date - a.date);

  return backups;
}

// Prompt user for confirmation
function promptConfirmation(message) {
  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// Prompt user to select a backup
function promptBackupSelection(backups) {
  return new Promise((resolve) => {
    console.log('\n📚 Available Backups:\n');
    backups.forEach((backup, index) => {
      const dateStr = backup.date.toLocaleString();
      console.log(`  ${index + 1}. ${backup.name} (${backup.size} MB) - ${dateStr}`);
    });

    rl.question('\nEnter the number of the backup to restore (or "q" to quit): ', (answer) => {
      if (answer.toLowerCase() === 'q') {
        resolve(null);
      } else {
        const index = parseInt(answer) - 1;
        if (index >= 0 && index < backups.length) {
          resolve(backups[index]);
        } else {
          console.log('❌ Invalid selection');
          resolve(null);
        }
      }
    });
  });
}

// Restore database from backup
async function restoreDatabase() {
  try {
    console.log('🔄 TourPad Database Restore Utility\n');

    // Parse database connection details
    const { user, password, host, port, database } = parseDatabaseUrl(DATABASE_URL);

    // Display connection info
    console.log('📊 Database Information:');
    console.log(`   Host: ${host}:${port}`);
    console.log(`   Database: ${database}`);
    console.log(`   User: ${user}`);

    // Determine which backup to restore
    let backupToRestore = null;

    if (specificFile) {
      // User specified a file
      const fullPath = path.join(BACKUP_DIR, specificFile);
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        backupToRestore = {
          name: specificFile,
          path: fullPath,
          size: (stats.size / 1024 / 1024).toFixed(2),
          date: stats.mtime
        };
      } else {
        console.error(`\n❌ Backup file not found: ${specificFile}`);
        process.exit(1);
      }
    } else {
      // List backups and let user choose
      const backups = listBackups();
      if (backups.length === 0) {
        console.log('\n❌ No backups found in the backups directory');
        process.exit(1);
      }

      backupToRestore = await promptBackupSelection(backups);
      if (!backupToRestore) {
        console.log('\n👋 Restore cancelled');
        rl.close();
        process.exit(0);
      }
    }

    console.log(`\n📁 Selected backup: ${backupToRestore.name}`);
    console.log(`   Size: ${backupToRestore.size} MB`);
    console.log(`   Date: ${backupToRestore.date.toLocaleString()}`);

    // Warn user about data loss
    console.log('\n⚠️  WARNING: This will completely replace your current database!');
    console.log('   All existing data will be permanently deleted.');

    if (!force) {
      const confirmed = await promptConfirmation('\n🔴 Are you sure you want to continue? (y/N): ');
      if (!confirmed) {
        console.log('\n👋 Restore cancelled');
        rl.close();
        process.exit(0);
      }

      // Double confirmation for production environments
      if (DATABASE_URL.includes('prod') || DATABASE_URL.includes('live')) {
        console.log('\n🚨 PRODUCTION DATABASE DETECTED!');
        const doubleConfirmed = await promptConfirmation('🔴 Are you REALLY sure? Type "yes" to confirm: ');
        if (!doubleConfirmed) {
          console.log('\n👋 Restore cancelled');
          rl.close();
          process.exit(0);
        }
      }
    }

    // Create a safety backup before restoring
    console.log('\n🛡️  Creating safety backup before restore...');
    const safetyBackupName = `safety-backup-before-restore-${Date.now()}.sql`;
    const safetyBackupPath = path.join(BACKUP_DIR, safetyBackupName);

    try {
      const env = { ...process.env, PGPASSWORD: password };
      const safetyBackupCommand = [
        'pg_dump',
        `-h ${host}`,
        `-p ${port}`,
        `-U ${user}`,
        `-d ${database}`,
        '--no-password',
        '--clean',
        '--if-exists',
        `-f "${safetyBackupPath}"`
      ].join(' ');

      execSync(safetyBackupCommand, {
        env,
        stdio: ['ignore', 'ignore', 'ignore']
      });

      console.log(`   Safety backup created: ${safetyBackupName}`);
    } catch (error) {
      console.log('   ⚠️  Could not create safety backup (continuing anyway)');
    }

    // Restore the database
    console.log('\n💾 Restoring database...');

    const env = { ...process.env, PGPASSWORD: password };
    const restoreCommand = [
      'psql',
      `-h ${host}`,
      `-p ${port}`,
      `-U ${user}`,
      `-d ${database}`,
      '--no-password',
      '--set',
      'ON_ERROR_STOP=1',
      `-f "${backupToRestore.path}"`
    ].join(' ');

    try {
      execSync(restoreCommand, {
        env,
        stdio: ['ignore', 'pipe', 'pipe'],
        maxBuffer: 1024 * 1024 * 100 // 100MB buffer
      });
    } catch (error) {
      // Check if psql is installed
      if (error.message.includes('command not found') || error.message.includes('is not recognized')) {
        console.error('\n❌ Error: psql is not installed.');
        console.log('\n📦 To install PostgreSQL tools:');
        console.log('   macOS: brew install postgresql');
        console.log('   Ubuntu/Debian: sudo apt-get install postgresql-client');
        console.log('   Windows: Download from https://www.postgresql.org/download/windows/\n');
        process.exit(1);
      }
      throw error;
    }

    console.log('\n✅ Database restored successfully!');

    // Verify the restoration
    console.log('\n📈 Verifying restored database:');
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

    // Run Prisma migrations to ensure schema is up to date
    console.log('\n🔧 Running Prisma migrations...');
    try {
      execSync('npx prisma migrate deploy', {
        stdio: 'inherit'
      });
      console.log('   ✅ Migrations applied successfully');
    } catch (error) {
      console.log('   ⚠️  Could not run migrations. Run manually with: npx prisma migrate deploy');
    }

    // Generate Prisma client
    console.log('\n🔧 Regenerating Prisma client...');
    try {
      execSync('npx prisma generate', {
        stdio: 'inherit'
      });
      console.log('   ✅ Prisma client regenerated');
    } catch (error) {
      console.log('   ⚠️  Could not regenerate Prisma client. Run manually with: npx prisma generate');
    }

    console.log('\n🎉 Restoration complete!');
    console.log('\n💡 Next steps:');
    console.log('   1. Restart your development server: npm run dev');
    console.log('   2. Verify your application is working correctly');
    console.log('   3. If there are issues, restore the safety backup:');
    console.log(`      npm run db:restore -- --file ${safetyBackupName}\n`);

    rl.close();

  } catch (error) {
    console.error('\n❌ Restore failed:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    rl.close();
    process.exit(1);
  }
}

// Run the restore
restoreDatabase().catch(error => {
  console.error('Unexpected error:', error);
  rl.close();
  process.exit(1);
});