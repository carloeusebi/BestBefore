<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::view('/', 'homepage')->name('homepage');

Route::view('/elimina-account', 'delete-account')->name('delete-account');

Route::view('/termini', 'terms')->name('terms');

Route::view('/privacy', 'privacy')->name('privacy');
