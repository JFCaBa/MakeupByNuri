#!/bin/bash
set -e

# Setup automatic database backups with cron
# This script adds a cron job to run backups daily

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Setup Automated Database Backups ===${NC}"

# Get the absolute path to the backup script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_SCRIPT="$SCRIPT_DIR/backup-db.sh"

if [ ! -f "$BACKUP_SCRIPT" ]; then
    echo -e "${RED}✗ Error: Backup script not found at $BACKUP_SCRIPT${NC}"
    exit 1
fi

# Check if cron job already exists
CRON_JOB="0 2 * * * $BACKUP_SCRIPT >> /var/log/makeupbynuri-backup.log 2>&1"
EXISTING_CRON=$(crontab -l 2>/dev/null | grep -F "$BACKUP_SCRIPT" || true)

if [ -n "$EXISTING_CRON" ]; then
    echo -e "${YELLOW}Cron job already exists:${NC}"
    echo "$EXISTING_CRON"
    echo -e "\n${YELLOW}Do you want to update it? (yes/no):${NC}"
    read -r UPDATE

    if [ "$UPDATE" != "yes" ]; then
        echo -e "${BLUE}No changes made${NC}"
        exit 0
    fi

    # Remove old cron job
    (crontab -l 2>/dev/null | grep -vF "$BACKUP_SCRIPT") | crontab -
    echo -e "${GREEN}✓ Removed old cron job${NC}"
fi

# Add new cron job (daily at 2 AM)
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
echo -e "${GREEN}✓ Added cron job for daily backups at 2:00 AM${NC}"

# Create log file if it doesn't exist
sudo touch /var/log/makeupbynuri-backup.log
sudo chown $(whoami):$(whoami) /var/log/makeupbynuri-backup.log
echo -e "${GREEN}✓ Created backup log file${NC}"

# Display the cron schedule
echo -e "\n${BLUE}Current backup schedule:${NC}"
crontab -l | grep "$BACKUP_SCRIPT"

echo -e "\n${GREEN}✓✓✓ Automated backups configured successfully! ✓✓✓${NC}"
echo -e "${BLUE}Backups will run daily at 2:00 AM${NC}"
echo -e "${BLUE}Logs: /var/log/makeupbynuri-backup.log${NC}"
echo -e "\n${YELLOW}To manually run a backup now, execute:${NC}"
echo -e "  $BACKUP_SCRIPT"
