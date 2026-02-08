# OrgSpace Setup Guide

This document outlines the complete setup process for the OrgSpace Laravel + React application.

## Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- npm or yarn
- Laravel compatible database (MySQL, PostgreSQL, SQLite)

## Project Stack

- **Backend**: Laravel 11
- **Frontend**: React 18 + Inertia.js
- **Styling**: TailwindCSS + Shadcn/ui
- **Authentication**: Laravel Breeze (React stack)
- **Build Tool**: Vite

## Installation Steps

### 1. Install Laravel Breeze

```bash
composer require laravel/breeze --dev
```

### 2. Install Breeze with React Stack

```bash
php artisan breeze:install react
```

This command installs:
- React 18.2.0
- React DOM 18.2.0
- Inertia.js 2.0.0
- Laravel Sanctum
- Ziggy
- Vite React plugin
- Headless UI React components
- TailwindCSS forms plugin

### 3. Install Shadcn/ui Components

```bash
npx shadcn@latest init
```

During initialization, configure:
- Style: New York
- TypeScript: No (using JavaScript)
- Tailwind CSS config: `tailwind.config.js`
- CSS file: `resources/css/app.css`
- Base color: Stone
- CSS variables: Yes

### 4. Add Shadcn/ui Components

```bash
npx shadcn@latest add button card input label
```

This installs:
- Radix UI primitives
- Lucide React icons
- Component utilities (class-variance-authority, clsx, tailwind-merge)
- TailwindCSS animate plugin

## Package Dependencies

### Composer Dependencies

```json
{
    "require": {
        "php": "^8.2",
        "laravel/framework": "^11.31",
        "laravel/tinker": "^2.9",
        "inertiajs/inertia-laravel": "^2.0.0",
        "laravel/sanctum": "^4.0.8",
        "tightenco/ziggy": "^2.5.1"
    },
    "require-dev": {
        "laravel/breeze": "^2.3.3",
        "fakerphp/faker": "^1.23",
        "laravel/pail": "^1.1",
        "laravel/pint": "^1.13",
        "laravel/sail": "^1.26",
        "mockery/mockery": "^1.6",
        "nunomaduro/collision": "^8.1",
        "phpunit/phpunit": "^11.0.1"
    }
}
```

### NPM Dependencies

```json
{
    "devDependencies": {
        "@headlessui/react": "^2.0.0",
        "@inertiajs/react": "^2.0.0",
        "@tailwindcss/forms": "^0.5.3",
        "@vitejs/plugin-react": "^4.2.0",
        "autoprefixer": "^10.4.12",
        "axios": "^1.7.4",
        "concurrently": "^9.0.1",
        "laravel-vite-plugin": "^1.2.0",
        "postcss": "^8.4.31",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "tailwindcss": "^3.2.1",
        "vite": "^6.0.11"
    },
    "dependencies": {
        "@radix-ui/react-label": "^2.1.8",
        "@radix-ui/react-slot": "^1.2.4",
        "class-variance-authority": "^0.7.1",
        "clsx": "^2.1.1",
        "lucide-react": "^0.563.0",
        "tailwind-merge": "^3.4.0",
        "tailwindcss-animate": "^1.0.7"
    }
}
```

## Configuration Files

### TailwindCSS Configuration

The `tailwind.config.js` is configured with:
- Content paths for Blade, React, and Vue files
- Custom font family (Figtree)
- Shadcn/ui CSS variables
- Animation plugin

### Vite Configuration

The `vite.config.js` includes:
- Laravel Vite plugin
- React plugin
- Hot module replacement
- Build optimization

### Shadcn/ui Configuration

The `components.json` includes:
- Component aliases (@/components, @/lib/utils)
- New York style
- Stone base color
- Lucide icon library

## File Structure

```
resources/
├── js/
│   ├── Components/          # React components
│   │   ├── ui/            # Shadcn/ui components
│   │   └── ...            # Breeze components
│   ├── Layouts/           # Layout components
│   │   ├── AuthenticatedLayout.jsx
│   │   └── GuestLayout.jsx
│   ├── Pages/             # Page components
│   │   ├── Auth/          # Authentication pages
│   │   ├── Profile/       # Profile pages
│   │   ├── Dashboard.jsx
│   │   ├── Welcome.jsx
│   │   └── LandingPage.jsx
│   ├── lib/
│   │   └── utils.js       # Shadcn/ui utilities
│   └── app.jsx            # Main React app
├── css/
│   └── app.css            # TailwindCSS + Shadcn/ui styles
└── views/
    └── app.blade.php      # Main layout template
```

## Environment Configuration

Make sure your `.env` file is configured with:

```env
APP_NAME=OrgSpace
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=orgspace
DB_USERNAME=root
DB_PASSWORD=
```

## Next Steps

After setup, follow the [start.md](./start.md) guide to run the application.
