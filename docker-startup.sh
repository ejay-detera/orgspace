#!/bin/bash
set -e

echo "============================================"
echo "  OrgSpace - Docker Reset Script"
echo "============================================"
echo ""

# --------------------------------------------------
# Step 1: Stop and remove existing containers
# --------------------------------------------------
echo "[1/4] Stopping and removing existing containers..."
docker compose down -v --remove-orphans 2>/dev/null || true
echo "      Done."
echo ""

# --------------------------------------------------
# Step 2: Copy .env.docker to .env
# --------------------------------------------------
echo "[2/4] Setting up environment file..."
cp .env.docker .env
echo "      Copied .env.docker to .env"
echo ""

# --------------------------------------------------
# Step 3: Build images from scratch
# --------------------------------------------------
echo "[3/4] Building Docker images (this may take a few minutes)..."
docker compose build --no-cache
echo "      Build complete."
echo ""

# --------------------------------------------------
# Step 4: Start containers
# --------------------------------------------------
echo "[4/4] Starting containers..."
docker compose up -d
echo "      Containers started."
echo ""

# --------------------------------------------------
# Print summary
# --------------------------------------------------
echo "============================================"
echo "  OrgSpace is starting up!"
echo "============================================"
echo ""
echo "  Please wait ~30 seconds for the database"
echo "  to initialize and migrations to run."
echo ""
echo "  Application:  http://localhost:8005"
echo "  phpMyAdmin:   http://localhost:8080"
echo ""
echo "  DB Credentials:"
echo "    Username: orgspace"
echo "    Password: orgspace"
echo "    Database: orgspace"
echo ""
echo "  Useful commands:"
echo "    docker compose logs -f app    (view app logs)"
echo "    docker compose ps             (check status)"
echo "    docker compose down           (stop all)"
echo "============================================"
