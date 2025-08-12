<?php

namespace App\Providers;

use Illuminate\Http\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\ServiceProvider;

class ResponseServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Response::macro('apiResponse', function (mixed $data = null, ?string $message = null, ?int $code = 200) {
            return response()->json(Arr::whereNotNull([
                'data' => $data,
                'message' => $message,
            ]), $code);
        });

        Response::macro('apiError', function (string $error, int $code = 400) {
            return response()->json([
                'error' => $error,
            ], $code);
        });
    }
}
