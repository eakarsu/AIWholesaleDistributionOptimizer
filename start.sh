#!/bin/bash

# ============================================================
# AI Wholesale Distribution Optimizer - Start Script
# ============================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     AI Wholesale Distribution Optimizer                  ║"
echo "║     Territory | Orders | Cross-Sell | Routes | Inventory ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Navigate to project directory
cd "$(dirname "$0")"

# ============================================================
# Step 1: Clean up used ports (4000 for backend, 3000 for frontend)
# ============================================================
echo -e "${YELLOW}[1/7] Cleaning up ports...${NC}"

cleanup_port() {
  local port=$1
  local pids=$(lsof -ti :$port 2>/dev/null || true)
  if [ -n "$pids" ]; then
    echo -e "${RED}  Killing processes on port $port: $pids${NC}"
    echo "$pids" | xargs kill -9 2>/dev/null || true
    sleep 1
  else
    echo -e "${GREEN}  Port $port is available${NC}"
  fi
}

cleanup_port 4000
cleanup_port 3000

# ============================================================
# Step 2: Check prerequisites
# ============================================================
echo -e "${YELLOW}[2/7] Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
  echo -e "${RED}Node.js is not installed. Please install Node.js first.${NC}"
  exit 1
fi
echo -e "${GREEN}  Node.js: $(node --version)${NC}"

if ! command -v psql &> /dev/null; then
  echo -e "${RED}PostgreSQL is not installed. Please install PostgreSQL first.${NC}"
  exit 1
fi
echo -e "${GREEN}  PostgreSQL: $(psql --version | head -1)${NC}"

# ============================================================
# Step 3: Setup environment
# ============================================================
echo -e "${YELLOW}[3/7] Setting up environment...${NC}"

if [ ! -f .env ]; then
  echo -e "${RED}  .env file not found! Creating default...${NC}"
  cat > .env << 'ENVEOF'
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wholesale_optimizer
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wholesale_optimizer
DB_USER=postgres
DB_PASSWORD=postgres
PORT=4000
NODE_ENV=development
OPENROUTER_API_KEY=your_openrouter_key_here
OPENROUTER_MODEL=anthropic/claude-haiku-4.5
JWT_SECRET=wholesale-optimizer-secret-key-2024
ENVEOF
fi
echo -e "${GREEN}  .env file ready${NC}"

# ============================================================
# Step 4: Setup PostgreSQL database
# ============================================================
echo -e "${YELLOW}[4/7] Setting up PostgreSQL database...${NC}"

# Source env vars
export $(grep -v '^#' .env | xargs 2>/dev/null) || true

# Create database if it doesn't exist
if psql -U "$DB_USER" -h "$DB_HOST" -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
  echo -e "${GREEN}  Database '$DB_NAME' already exists${NC}"
else
  echo -e "${CYAN}  Creating database '$DB_NAME'...${NC}"
  createdb -U "$DB_USER" -h "$DB_HOST" "$DB_NAME" 2>/dev/null || \
    psql -U "$DB_USER" -h "$DB_HOST" -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || \
    echo -e "${YELLOW}  Could not create DB automatically - it may already exist${NC}"
fi

# ============================================================
# Step 5: Install dependencies
# ============================================================
echo -e "${YELLOW}[5/7] Installing dependencies...${NC}"

if [ ! -d "node_modules" ]; then
  echo -e "${CYAN}  Installing server dependencies...${NC}"
  npm install --silent 2>&1 | tail -1
else
  echo -e "${GREEN}  Server dependencies already installed${NC}"
fi

if [ ! -d "client/node_modules" ]; then
  echo -e "${CYAN}  Installing client dependencies...${NC}"
  cd client && npm install --silent 2>&1 | tail -1 && cd ..
else
  echo -e "${GREEN}  Client dependencies already installed${NC}"
fi

# ============================================================
# Step 6: Seed database
# ============================================================
echo -e "${YELLOW}[6/7] Seeding database with sample data...${NC}"
echo -e "${CYAN}  Loading 16 items for each of 15 features (240 total records)...${NC}"
node server/seed.js 2>&1

# ============================================================
# Step 7: Start application with hot reload
# ============================================================
echo -e "${YELLOW}[7/7] Starting application with hot reload...${NC}"
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Application is starting...                              ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║  Backend:  http://localhost:4000  (nodemon - auto reload) ║${NC}"
echo -e "${GREEN}║  Frontend: http://localhost:3000  (React - hot reload)    ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║  Login Credentials:                                      ║${NC}"
echo -e "${GREEN}║    Admin:   admin@wholesale.com / password123             ║${NC}"
echo -e "${GREEN}║    Manager: manager@wholesale.com / password123           ║${NC}"
echo -e "${GREEN}║    Rep:     rep@wholesale.com / password123               ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║  Press Ctrl+C to stop all services                       ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Start both backend (nodemon for hot reload) and frontend (React hot reload)
npx concurrently \
  --names "SERVER,CLIENT" \
  --prefix-colors "blue,magenta" \
  "npx nodemon --watch server server/index.js" \
  "cd client && BROWSER=none PORT=3000 npm start"
