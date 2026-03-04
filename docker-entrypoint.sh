#!/bin/bash

echo "============================================"
echo "  OrgSpace - Docker Entrypoint"
echo "============================================"

# --------------------------------------------------
# Wait for MySQL to be ready
# --------------------------------------------------
echo "[1/6] Waiting for MySQL to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0

until php -r "try { new PDO('mysql:host='.\$_SERVER['DB_HOST'].';port='.(\$_SERVER['DB_PORT']??3306).';dbname='.\$_SERVER['DB_DATABASE'], \$_SERVER['DB_USERNAME'], \$_SERVER['DB_PASSWORD']); } catch(Exception \$e) { exit(1); }" 2>/dev/null; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "ERROR: MySQL did not become ready in time. Exiting."
        exit 1
    fi
    echo "  MySQL not ready yet... retrying ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done
echo "  MySQL is ready!"

# --------------------------------------------------
# Generate app key if not set
# --------------------------------------------------
echo "[2/6] Checking application key..."
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then
    echo "  Generating application key..."
    php artisan key:generate --force
else
    echo "  Application key already set."
fi

# --------------------------------------------------
# Run migrations
# --------------------------------------------------
echo "[3/6] Running database migrations..."
php artisan migrate --force

# --------------------------------------------------
# Run seeders
# --------------------------------------------------
echo "[4/6] Seeding database..."
php artisan db:seed --force 2>/dev/null || echo "  No seeders to run or already seeded."

# --------------------------------------------------
# Storage link
# --------------------------------------------------
echo "[5/6] Creating storage link..."
php artisan storage:link 2>/dev/null || echo "  Storage link already exists."

# --------------------------------------------------
# Optimize
# --------------------------------------------------
echo "[6/6] Optimizing application..."
php artisan optimize

echo ""
echo "============================================"
echo "  OrgSpace is ready!"
echo "  Access at: http://localhost:8005"
echo "============================================"
echo ""

# --------------------------------------------------
# Fix permissions (artisan commands above ran as root)
# --------------------------------------------------
echo "Fixing storage permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Start Apache in foreground
exec apache2-foreground
