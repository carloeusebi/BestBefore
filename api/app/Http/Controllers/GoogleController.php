<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function create(): string
    {
        return Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
    }

    public function store()
    {
        $user = Socialite::driver('google')->user();

        dd($user);
    }
}
