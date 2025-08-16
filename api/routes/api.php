<?php

declare(strict_types=1);

use App\Http\Controllers\AuthenticatedSessionController;
use App\Http\Controllers\AuthenticatedUserController;
use App\Http\Controllers\BarcodeProductController;
use App\Http\Controllers\ExpirationController;
use App\Http\Controllers\ExpoPushTokenController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::post('/auth/login', [AuthenticatedSessionController::class, 'store'])->name('login');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/auth/user', [AuthenticatedUserController::class, 'show'])->name('user.show');
    Route::patch('/auth/user', [AuthenticatedUserController::class, 'update'])->name('user.update');

    Route::post('/expo-push-token', [ExpoPushTokenController::class, 'store'])->name('expo-push-token.store');

    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');

    Route::apiResource('/expirations', ExpirationController::class)->names('expirations');

    Route::get('/barcodes/{barcode}/products', BarcodeProductController::class)->name('barcodes.products.index');
});
