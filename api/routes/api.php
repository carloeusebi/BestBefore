<?php

use App\Http\Controllers\AuthenticatedSessionController;
use App\Http\Controllers\AuthenticatedUserController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::post('/auth/login', [AuthenticatedSessionController::class, 'store']);
    Route::post('/auth/logout', [AuthenticatedSessionController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/user', AuthenticatedUserController::class);
});