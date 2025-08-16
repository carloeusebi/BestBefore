<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

// Primary Italian URL
Route::view('/elimina-account', 'delete-account')->name('delete-account');

// Backwards-compatible redirect from English path
Route::redirect('/delete-account', '/elimina-account', 301);
