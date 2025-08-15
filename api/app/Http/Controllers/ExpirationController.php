<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ExpirationRequest;
use App\Models\Expiration;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

final class ExpirationController extends Controller
{
    public function index(Request $request)
    {
        $expirations = $request->user()?->expirations()
            ->with('product')
            ->orderBy('expires_at')
            ->paginate();

        return $expirations->toResourceCollection();
    }

    public function store(ExpirationRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $expiration = $user->expirations()->create($request->validated());

        return response()->json($expiration->load('product')->toResource(), 201);
    }

    public function update(ExpirationRequest $request, Expiration $expiration): JsonResponse
    {
        Gate::authorize('update', $expiration);

        $expiration->update($request->validated());

        return response()->json($expiration->load('product')->toResource());
    }

    public function destroy(Expiration $expiration): Response
    {
        Gate::authorize('delete', $expiration);

        $expiration->delete();

        return response()->noContent();
    }
}
