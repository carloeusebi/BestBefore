<?php

declare(strict_types=1);

use App\Http\Controllers\AuthenticatedSessionController;
use App\Http\Controllers\AuthenticatedUserController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::post('/auth/login', [AuthenticatedSessionController::class, 'store'])->name('login');
});

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/auth/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/auth/user', AuthenticatedUserController::class)->name('user');
});
