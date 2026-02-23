<?php

use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CommitteeController;
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
    Route::get('/organizations/create', [App\Http\Controllers\OrganizationController::class, 'create'])->name('organizations.create');
    Route::post('/organizations', [App\Http\Controllers\OrganizationController::class, 'store'])->name('organizations.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/organizations/', [OrganizationController::class, 'index'])->name('organizations.index');
    Route::get('/organizations/{organization}', [OrganizationController::class, 'show'])->name('organizations.show');

    /* Committees */
    Route::get('/organizations/{organization}/committees/create', [CommitteeController::class, 'create'])->name('committees.create');
    Route::post('/organizations/{organization}/committees', [CommitteeController::class, 'store'])->name('committees.store');
    Route::get('/committees/{committee}/edit', [CommitteeController::class, 'edit'])->name('committees.edit');
    Route::put('/committees/{committee}', [CommitteeController::class, 'update'])->name('committees.update');
    Route::delete('/committees/{committee}', [CommitteeController::class, 'destroy'])->name('committees.destroy');
});

require __DIR__ . '/auth.php';
