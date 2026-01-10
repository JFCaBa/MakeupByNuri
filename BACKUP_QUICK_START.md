# Database Backup - Quick Start Guide

## ✅ Backup System Status

The database backup system has been successfully installed and configured!

### What's Installed:

1. **Manual backup script**: `/opt/MakeupByNuri/scripts/backup-db.sh`
2. **Restore script**: `/opt/MakeupByNuri/scripts/restore-db.sh`
3. **Automated daily backups**: Configured via cron (runs at 2:00 AM daily)
4. **Pre-deployment backups**: Integrated into `restart-container.sh`
5. **Backup storage**: `/opt/MakeupByNuri/backups/db/`

### Initial Backup Created

✓ First backup created at: `custom_db_backup_20260110_115359.db`

---

## Common Tasks

### Create a Backup Now

```bash
cd /opt/MakeupByNuri
./scripts/backup-db.sh
```

### Restore from Backup

```bash
cd /opt/MakeupByNuri
./scripts/restore-db.sh
```
This will show you a list of available backups to restore from.

### View Available Backups

```bash
ls -lht /opt/MakeupByNuri/backups/db/
```

### Deploy/Restart (with automatic backup)

```bash
cd /opt/MakeupByNuri
./restart-container.sh
```
This now automatically creates a backup before restarting!

---

## Automated Backups

Daily backups are scheduled at **2:00 AM** via cron.

**Check cron schedule:**
```bash
crontab -l | grep backup
```

**View backup logs:**
```bash
tail -f /opt/MakeupByNuri/backups/backup.log
```

---

## Important Notes

⚠️ **Before making major changes**: Always run a manual backup first!

⚠️ **Backups are kept for 30 days**: Older backups are automatically deleted.

⚠️ **Images are NOT backed up**: This only backs up the database. Image files in `public/images/` should be backed up separately if needed.

---

## Full Documentation

For complete documentation, see: [BACKUP_PROCEDURES.md](./BACKUP_PROCEDURES.md)

---

## Testing the System

To verify backups are working:

1. **Test manual backup:**
   ```bash
   ./scripts/backup-db.sh
   ```

2. **Verify backup was created:**
   ```bash
   ls -lh /opt/MakeupByNuri/backups/db/
   ```

3. **Test restore (optional):**
   ```bash
   ./scripts/restore-db.sh
   # Select the most recent backup, then cancel if you don't want to restore
   ```

---

## Need Help?

- Check backup logs for errors
- Verify disk space: `df -h`
- See full documentation in `BACKUP_PROCEDURES.md`
