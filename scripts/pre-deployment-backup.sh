#!/bin/bash
set -e

# Pre-deployment backup script
# Run this before deploying/restarting the application

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Pre-Deployment Database Backup ===${NC}"

# Get the absolute path to the backup script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_SCRIPT="$SCRIPT_DIR/backup-db.sh"

if [ ! -f "$BACKUP_SCRIPT" ]; then
    echo -e "${RED}✗ Error: Backup script not found at $BACKUP_SCRIPT${NC}"
    exit 1
fi

# Run the backup
echo -e "${YELLOW}Creating pre-deployment backup...${NC}"
bash "$BACKUP_SCRIPT"

echo -e "\n${GREEN}✓✓✓ Pre-deployment backup completed! ✓✓✓${NC}"
echo -e "${BLUE}It's now safe to deploy/restart the application${NC}"
