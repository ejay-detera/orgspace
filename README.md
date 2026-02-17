# OrgSpace

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-11-red" alt="Laravel Version">
  <img src="https://img.shields.io/badge/React-18-blue" alt="React Version">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC" alt="TailwindCSS Version">
  <img src="https://img.shields.io/badge/Shadcn/ui-0.563.0-000000" alt="Shadcn/ui Version">
</p>

**OrgSpace** - The perfect Space for Student Organization. A modern web application built to help student organizations plan, manage, and grow their communities with ease.

## 🚀 Features

- **Modern Tech Stack**: Laravel 11 + React 18 + Inertia.js
- **Beautiful UI**: TailwindCSS + Shadcn/ui components
- **Authentication**: Complete auth system with Laravel Breeze
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Developer Friendly**: Hot reload, optimized builds, and comprehensive documentation

## 🛠️ Technology Stack

### Backend

- **Laravel 11** - PHP framework
- **MySQL/PostgreSQL/SQLite** - Database support
- **Laravel Sanctum** - API authentication
- **Laravel Breeze** - Authentication scaffolding

### Frontend

- **React 18** - JavaScript library
- **Inertia.js** - SPA without building an API
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern React components
- **Vite** - Build tool and dev server

## 📋 Documentation

### 📦 [Setup Guide](./setup.md)

Complete installation instructions for all libraries and dependencies.

### 🚀 [Start Guide](./start.md)

How to start the project, run migrations, seed database, and begin development.

### 📁 [File Structure & Conventions](./FileStructure.md)

Detailed file structure, naming conventions, and coding standards for the project.

### 🔄 [GitHub Guidelines](./GithubGuidelines.md)

Git workflow, commit message conventions, branch naming rules, and collaboration guidelines.

this is a test for ruleset

## 🎯 Quick Start

1. Clone the repository
2. Follow the [Setup Guide](./setup.md) to install dependencies
3. Follow the [Start Guide](./start.md) to run the application
4. Visit `http://localhost:8000` to see OrgSpace in action

## 📁 Project Structure

```
resources/
├── js/
│   ├── Components/          # React components
│   │   ├── ui/            # Shadcn/ui components
│   │   └── ...            # Breeze components
│   ├── Layouts/           # Layout components
│   ├── Pages/             # Page components
│   └── lib/
├── css/
│   └── app.css            # TailwindCSS + Shadcn/ui styles
└── views/
    └── app.blade.php      # Main layout template
```

## 🌟 Key Pages

- **Landing Page** - Beautiful introduction to OrgSpace
- **Authentication** - Login, register, password reset
- **Dashboard** - Main authenticated user dashboard
- **Profile** - User profile management

## 🔧 Development

### Prerequisites

- PHP 8.2+
- Node.js 18+
- Composer
- Database (MySQL/PostgreSQL/SQLite)

### Environment Setup

```bash
cp .env.example .env
php artisan key:generate
composer install
npm install
```

### Running the Application

```bash
# Terminal 1 - Laravel Server
php artisan serve

# Terminal 2 - Vite Dev Server
npm run dev
```

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🙏 Acknowledgments

- Built with [Laravel](https://laravel.com/)
- UI components by [Shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Authentication by [Laravel Breeze](https://laravel.com/docs/starter-kits)
