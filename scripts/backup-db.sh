#!/bin/bash
set -e

# Database backup script for MakeupByNuri
# This script creates timestamped backups of the SQLite database

# Configuration
BACKUP_DIR="/opt/MakeupByNuri/backups/db"
DB_PATH="/opt/MakeupByNuri/db/custom.db"
CONTAINER_NAME="makeupbynuri"
MAX_BACKUPS=30  # Keep last 30 backups

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Database Backup Script ===${NC}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/custom_db_backup_$TIMESTAMP.db"

# Check if container is running and backup from container
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${BLUE}Backing up database from running container...${NC}"
    docker exec $CONTAINER_NAME sqlite3 /app/db/custom.db ".backup /app/db/backup_temp.db" 2>/dev/null || true
    docker cp $CONTAINER_NAME:/app/db/custom.db "$BACKUP_FILE"
    echo -e "${GREEN}✓ Backed up from container${NC}"
else
    # Fallback to host database
    if [ -f "$DB_PATH" ]; then
        echo -e "${BLUE}Container not running, backing up from host...${NC}"
        cp "$DB_PATH" "$BACKUP_FILE"
        echo -e "${GREEN}✓ Backed up from host${NC}"
    else
        echo -e "${RED}✗ Error: Database file not found at $DB_PATH${NC}"
        exit 1
    fi
fi

# Create a human-readable SQL dump as well
DUMP_FILE="$BACKUP_DIR/custom_db_backup_$TIMESTAMP.sql"
sqlite3 "$BACKUP_FILE" .dump > "$DUMP_FILE"
echo -e "${GREEN}✓ Created SQL dump${NC}"

# Compress the SQL dump
gzip "$DUMP_FILE"
echo -e "${GREEN}✓ Compressed SQL dump${NC}"

# Get file sizes
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
DUMP_SIZE=$(du -h "$DUMP_FILE.gz" | cut -f1)

echo -e "${GREEN}✓ Backup completed successfully!${NC}"
echo -e "  Database backup: $BACKUP_FILE ($BACKUP_SIZE)"
echo -e "  SQL dump (gzipped): $DUMP_FILE.gz ($DUMP_SIZE)"

# Clean up old backups (keep only last MAX_BACKUPS)
echo -e "${BLUE}Cleaning up old backups...${NC}"
cd "$BACKUP_DIR"
ls -t custom_db_backup_*.db 2>/dev/null | tail -n +$((MAX_BACKUPS + 1)) | xargs -r rm
ls -t custom_db_backup_*.sql.gz 2>/dev/null | tail -n +$((MAX_BACKUPS + 1)) | xargs -r rm
REMAINING=$(ls -1 custom_db_backup_*.db 2>/dev/null | wc -l)
echo -e "${GREEN}✓ Kept $REMAINING most recent backups${NC}"

# Show backup statistics
echo -e "\n${BLUE}Backup Statistics:${NC}"
echo "Total backups: $REMAINING"
echo "Backup location: $BACKUP_DIR"
echo "Latest backup: $(ls -t custom_db_backup_*.db 2>/dev/null | head -1)"
