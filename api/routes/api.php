<?php

use App\Http\Controllers\GoogleController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/auth/google/redirect', [GoogleController::class, 'create']);
    Route::get('/auth/google/callback', [GoogleController::class, 'store']);
});
