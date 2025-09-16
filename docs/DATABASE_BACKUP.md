# Database Backup System

## Overview
TourPad includes a comprehensive database backup and restore system to protect your data.

## Prerequisites

### 1. Install PostgreSQL Tools
The backup system requires `pg_dump` and `psql` commands:

**macOS:**
```bash
brew install postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql-client
```

**Windows:**
Download from [PostgreSQL website](https://www.postgresql.org/download/windows/)

### 2. Configure Database Connection
Create a `.env` file with your database connection:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

## Manual Backup Commands

### Create a Backup
```bash
# Create backup with timestamp
npm run db:backup

# Create backup with custom name
npm run db:backup -- --name my-backup
```

Backups are stored in the `backups/` directory (gitignored).

### Restore from Backup
```bash
# List available backups and choose
npm run db:restore

# Restore specific backup
npm run db:restore -- --file backup-2025-01-15.sql

# Force restore without confirmation (dangerous!)
npm run db:restore -- --file backup.sql --force
```

**⚠️ WARNING:** Restoring will completely replace your current database!

## Automated Backups

### Run Automated Backup
```bash
npm run db:auto-backup
```

This command:
- Creates daily, weekly, or monthly backups based on the date
- Cleans old backups according to retention policy
- Compresses backups with gzip
- Generates a backup report

### Retention Policy
Default settings (configurable in `scripts/auto-backup.js`):
- **Daily backups:** Keep for 7 days
- **Weekly backups:** Keep for 4 weeks (created on Sundays)
- **Monthly backups:** Keep for 3 months (created on the 1st)
- **Max total size:** 500MB

### Schedule with Cron
Add to your crontab for automatic daily backups at 2 AM:
```bash
crontab -e
# Add this line:
0 2 * * * cd /path/to/tourpad && npm run db:auto-backup
```

## Backup Directory Structure
```
backups/
├── daily/
│   ├── daily-backup-2025-01-15.sql.gz
│   └── daily-backup-2025-01-14.sql.gz
├── weekly/
│   └── weekly-backup-2025-01-12.sql.gz
├── monthly/
│   └── monthly-backup-2025-01-01.sql.gz
├── backup.log          # Automated backup logs
└── manual-backups.sql  # Manual backups
```

## Best Practices

### 1. Regular Backups
- Run automated backups daily in production
- Create manual backups before major changes
- Test restore process regularly

### 2. Offsite Storage
Consider copying important backups to:
- Cloud storage (AWS S3, Google Drive)
- External drives
- Remote servers

### 3. Testing Restores
Periodically test your backups:
```bash
# Create test database
createdb tourpad_test

# Restore backup to test database
DATABASE_URL="postgresql://user:pass@localhost:5432/tourpad_test" \
  npm run db:restore -- --file backup.sql

# Verify data integrity
psql tourpad_test -c "SELECT COUNT(*) FROM users;"
```

### 4. Security
- Never commit `.env` files
- Encrypt sensitive backups
- Restrict backup directory permissions
- Use secure transfer methods for offsite backups

## Troubleshooting

### "pg_dump: command not found"
Install PostgreSQL client tools (see Prerequisites).

### "Invalid DATABASE_URL format"
Check your `.env` file has the correct format:
```
DATABASE_URL="postgresql://username:password@host:port/database"
```

### "Permission denied"
Ensure your database user has sufficient privileges:
```sql
GRANT ALL PRIVILEGES ON DATABASE tourpad TO your_user;
```

### Large Database Backups
For databases over 100MB:
1. Increase buffer size in backup scripts
2. Use compression (already enabled in auto-backup)
3. Consider using `pg_dump` with custom format:
   ```bash
   pg_dump -Fc -d tourpad > backup.dump
   ```

## Recovery Scenarios

### Accidental Data Deletion
1. Stop the application immediately
2. Create a safety backup of current state
3. Restore from most recent good backup
4. Verify data integrity

### Database Corruption
1. Stop all database connections
2. Create backup attempt (may be partial)
3. Restore from last known good backup
4. Run integrity checks

### Migration Rollback
1. Always backup before migrations
2. If migration fails, restore pre-migration backup
3. Fix migration issues
4. Re-attempt with new backup

## Monitoring

Check backup logs regularly:
```bash
tail -f backups/backup.log
```

Monitor backup sizes:
```bash
du -sh backups/*
```

## Support

For issues or questions about the backup system:
1. Check this documentation
2. Review backup logs
3. Consult PostgreSQL documentation
4. Contact system administrator

---

Remember: **A backup is only as good as your ability to restore it!**
Test your restore process regularly.