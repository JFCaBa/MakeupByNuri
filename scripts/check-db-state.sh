#!/bin/bash

# Script to check the database state and validate data

DB_PATH="/opt/MakeupByNuri/db/custom.db"
CONTAINER_NAME="makeupbynuri"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Database State Checker ===${NC}"

# Check if database file exists
if [ ! -f "$DB_PATH" ]; then
    echo -e "${RED}✗ Database file does not exist: $DB_PATH${NC}"
    exit 1
fi

# Get database size
DB_SIZE=$(du -h "$DB_PATH" | cut -f1)
echo -e "${GREEN}✓ Database file exists: $DB_PATH ($DB_SIZE)${NC}"

# Count tables in the database
TABLES=$(sqlite3 "$DB_PATH" "SELECT name FROM sqlite_master WHERE type='table';" | tr '\n' ', ' | sed 's/,$//')
echo -e "${GREEN}✓ Tables in database: $TABLES${NC}"

# Count records in each table
echo -e "${BLUE}\nRecord counts:${NC}"
for table in $(sqlite3 "$DB_PATH" "SELECT name FROM sqlite_master WHERE type='table';"); do
    count=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM $table;")
    echo -e "  ${GREEN}- $table: $count records${NC}"
done

# Check if container is running
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "\n${GREEN}✓ Container '$CONTAINER_NAME' is running${NC}"
    
    # Copy a temporary copy of the database to test access
    TEMP_DB_PATH="/tmp/test_custom.db"
    cp "$DB_PATH" "$TEMP_DB_PATH"
    echo -e "${GREEN}✓ Copied database to temp location for testing${NC}"
    
    # Test the copied database to ensure it's not corrupted
    TABLE_COUNT=$(sqlite3 "$TEMP_DB_PATH" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';")
    if [ "$TABLE_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✓ Database file is accessible and contains tables${NC}"
    else
        echo -e "${RED}✗ Database file may be corrupted${NC}"
    fi
    
    # Clean up
    rm -f "$TEMP_DB_PATH"
else
    echo -e "\n${YELLOW}⚠ Container '$CONTAINER_NAME' is not running${NC}"
fi

echo -e "\n${GREEN}✓ Database state check completed successfully${NC}"