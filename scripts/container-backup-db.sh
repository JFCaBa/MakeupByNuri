#!/bin/sh
set -e

# Database and Images backup script for MakeupByNuri (container version)
# This script creates timestamped backups of the SQLite database and images

# Configuration - using the shared volume path inside container
BACKUP_DIR="/app/backups/db"
DB_PATH="/app/prisma/db/custom.db"  # This is the actual database used by the application
IMAGES_DIR="/app/public/images"  # Images directory to back up

MAX_BACKUPS=30  # Keep last 30 backups

echo "=== Database and Images Backup Script ==="

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate timestamp (format: YYYYMMDD_HHMMSS)
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/custom_db_backup_$TIMESTAMP.db"

# Backup the database file (it's the same file in the shared volume)
echo "Backing up database from shared volume..."
cp "$DB_PATH" "$BACKUP_FILE"
echo "✓ Backed up database from shared volume"

# Backup the images directory if it exists
if [ -d "$IMAGES_DIR" ]; then
  IMAGES_BACKUP_FILE="$BACKUP_DIR/images_backup_$TIMESTAMP.tar.gz"
  echo "Backing up images directory..."
  tar -czf "$IMAGES_BACKUP_FILE" -C "$(dirname "$IMAGES_DIR")" "$(basename "$IMAGES_DIR")"
  echo "✓ Backed up images to $IMAGES_BACKUP_FILE"
else
  echo "ℹ️ No images directory found to backup"
fi

# Skip SQL dump creation as sqlite3 is not available in container
echo "ℹ️ Skipping SQL dump creation (sqlite3 not available in container)"

# Get file sizes (simplified)
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
IMAGES_SIZE=""
if [ -f "$IMAGES_BACKUP_FILE" ]; then
  IMAGES_SIZE=$(du -h "$IMAGES_BACKUP_FILE" | cut -f1)
else
  IMAGES_SIZE="N/A (no images)"
fi

echo "✓ Backup completed successfully!"
echo "  Database backup: $BACKUP_FILE ($BACKUP_SIZE)"
echo "  Images backup: $IMAGES_BACKUP_FILE ($IMAGES_SIZE)"
echo "  SQL dump: Skipped (sqlite3 not available)"

# Clean up old backups (keep only last MAX_BACKUPS)
echo "Cleaning up old backups..."

# Count all .db files and remove the oldest if we have too many
cd "$BACKUP_DIR"

# Use a simple loop to remove excess database backups
total_backups=$(ls -1 custom_db_backup_*.db 2>/dev/null | wc -l)
while [ "$total_backups" -gt "$MAX_BACKUPS" ]; do
  # Find oldest database backup file
  oldest_backup=$(ls -tr custom_db_backup_*.db 2>/dev/null | head -n 1)
  if [ -n "$oldest_backup" ]; then
    rm "$oldest_backup"
    echo "Removed old database backup: $oldest_backup"
    total_backups=$(ls -1 custom_db_backup_*.db 2>/dev/null | wc -l)
  else
    break
  fi
done

# Also clean up old image backups
total_img_backups=$(ls -1 images_backup_*.tar.gz 2>/dev/null | wc -l)
while [ "$total_img_backups" -gt "$MAX_BACKUPS" ]; do
  # Find oldest image backup file
  oldest_img_backup=$(ls -tr images_backup_*.tar.gz 2>/dev/null | head -n 1)
  if [ -n "$oldest_img_backup" ]; then
    rm "$oldest_img_backup"
    echo "Removed old images backup: $oldest_img_backup"
    total_img_backups=$(ls -1 images_backup_*.tar.gz 2>/dev/null | wc -l)
  else
    break
  fi
done

REMAINING=$(ls -1 custom_db_backup_*.db 2>/dev/null | wc -l)
echo "✓ Kept $REMAINING most recent backups"

# Show backup statistics
echo ""
echo "Backup Statistics:"
echo "Total backups: $REMAINING"
echo "Backup location: $BACKUP_DIR"
latest_backup=$(ls -t custom_db_backup_*.db 2>/dev/null | head -n 1)
echo "Latest backup: $latest_backup"