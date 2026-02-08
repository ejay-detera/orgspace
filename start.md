# OrgSpace Start Guide

This guide covers how to start, migrate, seed, and run the OrgSpace Laravel + React application.

## Quick Start

### 1. Environment Setup

Copy the environment file:
```bash
cp .env.example .env
```

Generate application key:
```bash
php artisan key:generate
```

### 2. Database Setup

#### Option A: MySQL/PostgreSQL
1. Create a database named `orgspace`
2. Update your `.env` file with database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=orgspace
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

#### Option B: SQLite (for development)
1. Create SQLite database:
```bash
touch database/database.sqlite
```

2. Update `.env`:
```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

### 3. Install Dependencies

Install PHP dependencies:
```bash
composer install
```

Install Node.js dependencies:
```bash
npm install
```

### 4. Database Migration

Run database migrations:
```bash
php artisan migrate
```

### 5. Database Seeding (Optional)

If you have seeders, run:
```bash
php artisan db:seed
```

Or run a specific seeder:
```bash
php artisan db:seed --class=UserSeeder
```

### 6. Build Assets

Build frontend assets for production:
```bash
npm run build
```

Or for development with hot reload:
```bash
npm run dev
```

## Running the Application

### Development Mode

**Terminal 1 - Laravel Server:**
```bash
php artisan serve
```
This starts the Laravel development server at `http://localhost:8000`

**Terminal 2 - Vite Dev Server:**
```bash
npm run dev
```
This starts the Vite development server for hot module replacement

### Using Laravel Sail (Docker)

If you prefer Docker, use Laravel Sail:
```bash
# Install Sail (first time only)
php artisan sail:install

# Start all services
php artisan sail up

# Run commands within Sail
php artisan sail npm run dev
php artisan sail artisan migrate
```

### Using Composer Dev Script

The project includes a convenient dev script that starts all services:
```bash
composer run dev
```
This command runs:
- `php artisan serve` (Laravel server)
- `php artisan queue:listen --tries=1` (Queue worker)
- `php artisan pail --timeout=0` (Log viewer)
- `npm run dev` (Vite dev server)

## Common Development Tasks

### Fresh Database Reset

To completely reset your database:
```bash
php artisan migrate:fresh --seed
```

### Clearing Caches

Clear all Laravel caches:
```bash
php artisan optimize:clear
```

Or clear specific caches:
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Creating New Migrations

Create a new migration:
```bash
php artisan make:migration create_table_name
```

Create a migration with model:
```bash
php artisan make:model ModelName -m
```

### Creating New Seeders

Create a new seeder:
```bash
php artisan make:seeder SeederName
```

### Creating New React Components

Create a new page component:
```bash
# Create the file manually in resources/js/Pages/
touch resources/js/Pages/NewPage.jsx
```

Add the route in `routes/web.php`:
```php
Route::get('/new-page', function () {
    return Inertia::render('NewPage');
});
```

## Testing

### Running Tests

Run all tests:
```bash
php artisan test
```

Run specific test file:
```bash
php artisan test tests/Feature/ExampleTest.php
```

Run tests with coverage:
```bash
php artisan test --coverage
```

### Code Style

Run Laravel Pint for code formatting:
```bash
./vendor/bin/pint
```

## Production Deployment

### Environment Setup

Set production environment:
```env
APP_ENV=production
APP_DEBUG=false
```

### Optimization

Optimize the application:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

### Build Assets

Build optimized assets:
```bash
npm run build
```

### File Permissions

Ensure proper file permissions:
```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

## Troubleshooting

### Common Issues

**1. Vite 404 Errors**
- Make sure `npm run dev` is running
- Check if `APP_URL` in `.env` matches your server URL

**2. Database Connection Errors**
- Verify database credentials in `.env`
- Ensure database server is running
- Check if database exists

**3. Permission Errors**
```bash
chmod -R 755 storage bootstrap/cache
```

**4. Composer Autoload Issues**
```bash
composer dump-autoload
```

**5. Node Module Issues**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode

Enable debug mode in `.env`:
```env
APP_DEBUG=true
```

View detailed error logs:
```bash
php artisan log:clear
php artisan tail
```

## URLs After Setup

- **Landing Page**: `http://localhost:8000`
- **Login**: `http://localhost:8000/login`
- **Register**: `http://localhost:8000/register`
- **Dashboard**: `http://localhost:8000/dashboard` (requires login)
- **Profile**: `http://localhost:8000/profile` (requires login)

## Development Workflow

1. Make changes to React components
2. Vite automatically rebuilds (hot reload)
3. Test in browser at `http://localhost:8000`
4. Commit changes when ready
5. Run tests before deploying

## Additional Commands

### Queue Management

Start queue worker:
```bash
php artisan queue:work
```

Failed queue jobs:
```bash
php artisan queue:failed
php artisan queue:retry all
```

### Storage

Create storage link:
```bash
php artisan storage:link
```

Clear compiled views:
```bash
php artisan view:clear
```

### Scheduler

Run scheduled tasks:
```bash
php artisan schedule:run
```
