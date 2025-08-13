<?php

declare(strict_types=1);

use App\Http\Controllers\AuthenticatedSessionController;
use App\Http\Controllers\AuthenticatedUserController;
use App\Http\Controllers\BarcodeProductController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::post('/auth/login', [AuthenticatedSessionController::class, 'store'])->name('login');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/auth/user', [AuthenticatedUserController::class, 'show'])->name('user.show');
    Route::patch('/auth/user', [AuthenticatedUserController::class, 'update'])->name('user.update');

    Route::post('/products', [ProductController::class, 'store'])->name('products.store');

    Route::get('/barcodes/{barcode}/products', BarcodeProductController::class)->name('barcodes.products.index');
});
