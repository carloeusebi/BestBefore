<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GoogleProvider;
use Throwable;

class AuthenticatedSessionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'idToken' => ['required', 'string']
        ]);

        /** @var GoogleProvider $socialite */
        $socialite = Socialite::driver('google');

        try {
            $googleUser = $socialite->userFromToken($request->input('idToken'));

            $user = User::firstOrCreate(['google_id' => $googleUser->getId()], [
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'avatar' => $googleUser->getAvatar(),
            ]);

            Auth::login($user);

            return Response::apiResponse([
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
        Auth::logout();
        $request->user()?->currentAccessToken()->delete();

        return response()->noContent();
    }
}
