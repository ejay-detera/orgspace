<?php

use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\ScheduleController;
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
    //announcements
    Route::post('/announcements', [AnnouncementController::class, 'store'])->name('announcements.store');
    Route::get('/announcements', [AnnouncementController::class, 'index'])->name('announcements.index');
    Route::get('/announcements/create', [AnnouncementController::class, 'create'])->name('announcements.create');

    //schedules
    Route::get('/schedule', [ScheduleController::class, 'index'])->name('schedule.index');
    Route::post('/schedule', [ScheduleController::class, 'store'])->name('schedule.store');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    /* Committees */
    Route::get('/organizations/{organization}/committees/create', [CommitteeController::class, 'create'])->name('committees.create');
    Route::post('/organizations/{organization}/committees', [CommitteeController::class, 'store'])->name('committees.store');
    Route::get('/committees/{committee}', [CommitteeController::class, 'show'])->name('committees.show');
    Route::get('/committees/{committee}/edit', [CommitteeController::class, 'edit'])->name('committees.edit');
    Route::put('/committees/{committee}', [CommitteeController::class, 'update'])->name('committees.update');
    Route::delete('/committees/{committee}', [CommitteeController::class, 'destroy'])->name('committees.destroy');
});

require __DIR__ . '/auth.php';
