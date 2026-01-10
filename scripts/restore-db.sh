#!/bin/bash
set -e

# Database restore script for MakeupByNuri
# This script restores the database from a backup

# Configuration
BACKUP_DIR="/opt/MakeupByNuri/backups/db"
DB_PATH="/opt/MakeupByNuri/db/custom.db"
CONTAINER_NAME="makeupbynuri"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Database Restore Script ===${NC}"

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}✗ Error: Backup directory not found: $BACKUP_DIR${NC}"
    exit 1
fi

# List available backups
echo -e "\n${BLUE}Available backups:${NC}"
BACKUPS=($(ls -t "$BACKUP_DIR"/custom_db_backup_*.db 2>/dev/null))

if [ ${#BACKUPS[@]} -eq 0 ]; then
    echo -e "${RED}✗ No backups found in $BACKUP_DIR${NC}"
    exit 1
fi

# Display backups with numbers
for i in "${!BACKUPS[@]}"; do
    BACKUP_FILE="${BACKUPS[$i]}"
    BACKUP_NAME=$(basename "$BACKUP_FILE")
    BACKUP_DATE=$(echo "$BACKUP_NAME" | grep -oP '\d{8}_\d{6}')
    FORMATTED_DATE=$(date -d "${BACKUP_DATE:0:8} ${BACKUP_DATE:9:2}:${BACKUP_DATE:11:2}:${BACKUP_DATE:13:2}" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "$BACKUP_DATE")
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "  ${GREEN}[$i]${NC} $FORMATTED_DATE ($SIZE)"
done

# Prompt user to select a backup
echo -e "\n${YELLOW}Enter the number of the backup to restore [0-$((${#BACKUPS[@]}-1))]:${NC}"
read -r SELECTION

# Validate selection
if ! [[ "$SELECTION" =~ ^[0-9]+$ ]] || [ "$SELECTION" -lt 0 ] || [ "$SELECTION" -ge ${#BACKUPS[@]} ]; then
    echo -e "${RED}✗ Invalid selection${NC}"
    exit 1
fi

SELECTED_BACKUP="${BACKUPS[$SELECTION]}"
echo -e "\n${BLUE}Selected backup: $(basename "$SELECTED_BACKUP")${NC}"

# Confirmation
echo -e "${YELLOW}⚠ WARNING: This will overwrite the current database!${NC}"
echo -e "${YELLOW}Do you want to continue? (yes/no):${NC}"
read -r CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${RED}Restore cancelled${NC}"
    exit 0
fi

# Create a backup of current database before restoring
echo -e "\n${BLUE}Creating backup of current database...${NC}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SAFETY_BACKUP="$BACKUP_DIR/pre_restore_backup_$TIMESTAMP.db"

if [ -f "$DB_PATH" ]; then
    cp "$DB_PATH" "$SAFETY_BACKUP"
    echo -e "${GREEN}✓ Current database backed up to: $(basename "$SAFETY_BACKUP")${NC}"
fi

# Stop container if running
CONTAINER_WAS_RUNNING=false
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${BLUE}Stopping container...${NC}"
    docker stop $CONTAINER_NAME
    CONTAINER_WAS_RUNNING=true
    echo -e "${GREEN}✓ Container stopped${NC}"
fi

# Restore the database
echo -e "${BLUE}Restoring database...${NC}"
cp "$SELECTED_BACKUP" "$DB_PATH"
echo -e "${GREEN}✓ Database restored to: $DB_PATH${NC}"

# Restart container if it was running
if [ "$CONTAINER_WAS_RUNNING" = true ]; then
    echo -e "${BLUE}Starting container...${NC}"
    docker start $CONTAINER_NAME
    echo -e "${GREEN}✓ Container started${NC}"

    # Wait for container to be healthy
    echo -e "${BLUE}Waiting for application to start...${NC}"
    sleep 5
fi

echo -e "\n${GREEN}✓✓✓ Database restore completed successfully! ✓✓✓${NC}"
echo -e "${BLUE}Safety backup saved at: $(basename "$SAFETY_BACKUP")${NC}"
