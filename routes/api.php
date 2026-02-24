//announcement route

Route::post('/announcements', [AnnouncementController::class, 'store']);