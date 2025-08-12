<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Http\Response;
use Illuminate\Support\ServiceProvider;

final class ResponseServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Response::macro('apiError', fn (string $error, int $code = 400) => response()->json([
            'error' => $error,
        ], $code));
    }
}
