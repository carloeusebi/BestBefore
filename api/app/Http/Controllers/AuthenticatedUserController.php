<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class AuthenticatedUserController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json($request->user()?->toResource());
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'notify_by_email' => ['sometimes', 'boolean'],
            'notify_by_push' => ['sometimes', 'boolean'],
        ]);

        /** @var User $user */
        $user = $request->user();

        if (array_key_exists('notify_by_email', $data)) {
            $user->notify_by_email = (bool) $data['notify_by_email'];
        }

        if (array_key_exists('notify_by_push', $data)) {
            $user->notify_by_push = (bool) $data['notify_by_push'];
        }

        $user->save();

        return response()->json($user->toResource());
    }
}
