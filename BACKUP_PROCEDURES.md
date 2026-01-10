# Database Backup and Restore Procedures

This document describes how to backup and restore the MakeupByNuri database.

## Overview

The MakeupByNuri application uses SQLite as its database. To prevent data loss, we've implemented a comprehensive backup system with:

- **Manual backups**: Run on-demand
- **Automated backups**: Daily scheduled backups via cron
- **Pre-deployment backups**: Automatic backups before container restarts
- **Restore functionality**: Easy restoration from any backup

## Backup Location

All backups are stored in: `/opt/MakeupByNuri/backups/db/`

Each backup consists of two files:
- `custom_db_backup_YYYYMMDD_HHMMSS.db` - Binary SQLite database file
- `custom_db_backup_YYYYMMDD_HHMMSS.sql.gz` - Compressed SQL dump (human-readable)

## Manual Backup

To create a manual backup at any time:

```bash
cd /opt/MakeupByNuri
./scripts/backup-db.sh
```

This will:
1. Create a timestamped backup of the current database
2. Generate a SQL dump (compressed)
3. Clean up old backups (keeps last 30)
4. Show backup statistics

## Automated Daily Backups

### Setup

To enable automated daily backups (runs at 2:00 AM):

```bash
cd /opt/MakeupByNuri
./scripts/setup-backup-cron.sh
```

### Check Status

View the cron schedule:
```bash
crontab -l | grep backup-db
```

View backup logs:
```bash
tail -f /var/log/makeupbynuri-backup.log
```

### Disable Automated Backups

```bash
crontab -e
# Comment out or remove the line containing backup-db.sh
```

## Pre-Deployment Backups

A backup is automatically created before deploying/restarting the application when using:

```bash
./restart-container.sh
```

Or run manually before any risky operation:

```bash
./scripts/pre-deployment-backup.sh
```

## Restore from Backup

### Interactive Restore

To restore the database from a backup:

```bash
cd /opt/MakeupByNuri
./scripts/restore-db.sh
```

This will:
1. Show you a list of available backups
2. Let you select which backup to restore
3. Create a safety backup of the current database
4. Stop the container (if running)
5. Restore the selected backup
6. Restart the container

### Manual Restore

If you need to manually restore:

```bash
# Stop the container
docker stop makeupbynuri

# Copy the backup file
cp /opt/MakeupByNuri/backups/db/custom_db_backup_YYYYMMDD_HHMMSS.db /opt/MakeupByNuri/db/custom.db

# Start the container
docker start makeupbynuri
```

## Important Notes

### Database Location

The database is mounted from the host at:
- **Host path**: `/opt/MakeupByNuri/db/custom.db`
- **Container path**: `/app/db/custom.db`

Changes made through the admin panel are persisted to the host-mounted database.

### Retention Policy

By default, the backup system keeps the last **30 backups**. Older backups are automatically deleted. You can change this by editing the `MAX_BACKUPS` variable in `scripts/backup-db.sh`.

### What to Backup

The database contains:
- Service content (descriptions and detailed descriptions)
- Testimonials (user reviews)
- User data
- Other application data

**Note**: Image files are NOT in the database. They are stored in `public/images/` and should be backed up separately.

## Troubleshooting

### Backup Script Fails

If the backup script fails, check:
1. The Docker container is running: `docker ps | grep makeupbynuri`
2. The database file exists: `ls -lh /opt/MakeupByNuri/db/custom.db`
3. You have write permissions to the backup directory

### Container Won't Start After Restore

If the container fails to start after restoring:
1. Check Docker logs: `docker logs makeupbynuri`
2. Verify database file integrity: `sqlite3 /opt/MakeupByNuri/db/custom.db "PRAGMA integrity_check;"`
3. Restore from a different backup

### Lost Recent Changes

If you lost recent changes after a deployment:
1. Check if there's a `pre_restore_backup_*.db` file in the backups directory
2. Check the backup timestamps to find the most recent backup before data loss
3. Use the restore script to restore from the appropriate backup

## Best Practices

1. **Before making major changes**: Run a manual backup
2. **Before deploying**: The system does this automatically, but verify the backup completed
3. **After updating content**: Check that automated backups are working
4. **Weekly**: Verify you have recent backups: `ls -lht /opt/MakeupByNuri/backups/db/ | head`
5. **Monthly**: Test the restore procedure to ensure backups are valid

## Emergency Recovery

If you've lost data and need to recover:

1. **Stop making changes immediately** to prevent overwriting backups
2. List all available backups:
   ```bash
   ls -lht /opt/MakeupByNuri/backups/db/
   ```
3. Identify the backup from before data loss (check timestamps)
4. Run the restore script and select that backup
5. Verify the restored data through the admin panel

## Backup Verification

To verify a backup file is valid:

```bash
sqlite3 /opt/MakeupByNuri/backups/db/custom_db_backup_YYYYMMDD_HHMMSS.db "PRAGMA integrity_check;"
```

Should output: `ok`

To view what's in a backup:

```bash
sqlite3 /opt/MakeupByNuri/backups/db/custom_db_backup_YYYYMMDD_HHMMSS.db "SELECT * FROM ServiceContent;"
```

## Additional Recommendations

### Off-Site Backups

Consider copying backups to a remote location:

```bash
# Example: Copy to a remote server
rsync -avz /opt/MakeupByNuri/backups/db/ user@backup-server:/backups/makeupbynuri/
```

### Backup the Entire Application

To backup everything (including images):

```bash
tar -czf makeupbynuri-full-backup-$(date +%Y%m%d).tar.gz \
  /opt/MakeupByNuri/db/ \
  /opt/MakeupByNuri/public/images/
```

## Support

If you encounter issues with backups:
1. Check the backup logs: `/var/log/makeupbynuri-backup.log`
2. Verify disk space: `df -h /opt/MakeupByNuri/backups`
3. Check file permissions in the backups directory
