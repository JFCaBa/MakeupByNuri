#!/bin/bash
set -e

# Script to stop, rebuild, and restart containers using docker compose

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Restarting MakeupByNuri Container ===${NC}"

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_SCRIPT="$SCRIPT_DIR/scripts/pre-deployment-backup.sh"

# Run pre-deployment backup if script exists
if [ -f "$BACKUP_SCRIPT" ]; then
    echo -e "${YELLOW}Running pre-deployment backup...${NC}"
    bash "$BACKUP_SCRIPT"
else
    echo -e "${YELLOW}⚠ Warning: Pre-deployment backup script not found${NC}"
    echo -e "${YELLOW}Consider creating a manual backup before proceeding${NC}"
    sleep 2
fi

echo -e "\n${BLUE}Stopping and removing containers...${NC}"
docker compose down

echo -e "${BLUE}Building and starting containers...${NC}"
docker compose up -d --build

echo -e "\n${GREEN}✓✓✓ Containers restarted successfully! ✓✓✓${NC}"