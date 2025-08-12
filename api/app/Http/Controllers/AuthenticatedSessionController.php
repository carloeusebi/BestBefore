<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GoogleProvider;
use Throwable;

final class AuthenticatedSessionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'idToken' => ['required', 'string'],
        ]);

        try {

            /** @var GoogleProvider $socialite */
            $socialite = Socialite::driver('google');

            $googleUser = $socialite->userFromToken($request->input('idToken'));

            $user = User::firstOrCreate(['google_id' => $googleUser->getId()], [
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'avatar' => $googleUser->getAvatar(),
            ]);

            Auth::login($user);

            return response()->json([
                'token' => $user->createToken('auth-token')->plainTextToken,
                'user' => $user->toResource(),
            ]);
        } catch (Throwable $e) {
            report($e);

            return Response::apiError($e->getMessage(), 500);
        }
    }

    public function destroy(Request $request): Response
    {
        $request->user()?->tokens()->delete();

        return response()->noContent();
    }
}
