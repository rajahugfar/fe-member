#!/bin/bash

# Script to import game providers and games from games-data.json
# Usage: ./scripts/import-game-data.sh

API_URL="${API_URL:-http://localhost:8081}"
ADMIN_TOKEN="${ADMIN_TOKEN}"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Game Data Import Script ===${NC}\n"

# Check if admin token is provided
if [ -z "$ADMIN_TOKEN" ]; then
    echo -e "${RED}Error: ADMIN_TOKEN environment variable is not set${NC}"
    echo "Usage: ADMIN_TOKEN=your_token ./scripts/import-game-data.sh"
    exit 1
fi

# Check if games-data.json exists
if [ ! -f "scripts/games-data.json" ]; then
    echo -e "${RED}Error: scripts/games-data.json not found${NC}"
    exit 1
fi

echo -e "${GREEN}Step 1: Syncing game providers...${NC}"
PROVIDER_RESPONSE=$(curl -s -X POST "${API_URL}/api/v1/admin/game-providers/sync" \
    -H "Authorization: Bearer ${ADMIN_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{}')

PROVIDER_SUCCESS=$(echo $PROVIDER_RESPONSE | grep -o '"success":true' | wc -l)

if [ $PROVIDER_SUCCESS -eq 1 ]; then
    echo -e "${GREEN}✓ Providers synced successfully${NC}"
    echo "$PROVIDER_RESPONSE" | jq '.' 2>/dev/null || echo "$PROVIDER_RESPONSE"
else
    echo -e "${RED}✗ Failed to sync providers${NC}"
    echo "$PROVIDER_RESPONSE" | jq '.' 2>/dev/null || echo "$PROVIDER_RESPONSE"
    exit 1
fi

echo -e "\n${GREEN}Step 2: Importing games...${NC}"
GAMES_RESPONSE=$(curl -s -X POST "${API_URL}/api/v1/admin/games/import" \
    -H "Authorization: Bearer ${ADMIN_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{}')

GAMES_SUCCESS=$(echo $GAMES_RESPONSE | grep -o '"success":true' | wc -l)

if [ $GAMES_SUCCESS -eq 1 ]; then
    echo -e "${GREEN}✓ Games imported successfully${NC}"
    echo "$GAMES_RESPONSE" | jq '.' 2>/dev/null || echo "$GAMES_RESPONSE"
else
    echo -e "${RED}✗ Failed to import games${NC}"
    echo "$GAMES_RESPONSE" | jq '.' 2>/dev/null || echo "$GAMES_RESPONSE"
    exit 1
fi

echo -e "\n${GREEN}=== Import completed successfully! ===${NC}"
echo -e "\nYou can now:"
echo -e "  1. Check providers: curl ${API_URL}/api/v1/public/game-providers"
echo -e "  2. Check games: curl ${API_URL}/api/v1/member/games/all"
echo -e "  3. View frontend: http://localhost:5174"
