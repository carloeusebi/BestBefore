<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ExpirationRequest;
use App\Http\Resources\ExpirationResource;
use App\Models\Expiration;
use Illuminate\Http\JsonResponse;

final class ExpirationController extends Controller
{
    public function store(ExpirationRequest $request): JsonResponse
    {
        $expiration = new Expiration();
        $expiration->user_id = $request->input('user_id');
        $expiration->product_id = $request->input('product_id');
        $expiration->expires_at = $request->input('expires_at');
        $expiration->quantity = $request->input('quantity');
        $expiration->notes = $request->input('notes');
        $expiration->notification_days_before = (int) $request->input('notification_days_before', 1);
        $expiration->notification_method = $request->input('notification_method', 'push');
        $expiration->save();

        return (new ExpirationResource($expiration->refresh()))->response()->setStatusCode(201);
    }
}
