<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('LandingPage');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/organizations', [App\Http\Controllers\OrganizationController::class, 'index'])->name('organizations.index');
    Route::get('/organizations/discover', [App\Http\Controllers\OrganizationController::class, 'discover'])->name('organizations.discover');
    Route::get('/organizations/create', [App\Http\Controllers\OrganizationController::class, 'create'])->name('organizations.create');
    Route::post('/organizations', [App\Http\Controllers\OrganizationController::class, 'store'])->name('organizations.store');

    // Join Organization endpoints
    Route::post('/organizations/{organization}/join', [App\Http\Controllers\OrganizationController::class, 'join'])->name('organizations.join');
    Route::get('/organizations/{organization}/requests', [App\Http\Controllers\OrganizationController::class, 'requests'])->name('organizations.requests');
    Route::post('/organizations/{organization}/approve/{user}', [App\Http\Controllers\OrganizationController::class, 'approveRequest'])->name('organizations.approve');
    Route::post('/organizations/{organization}/reject/{user}', [App\Http\Controllers\OrganizationController::class, 'rejectRequest'])->name('organizations.reject');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
