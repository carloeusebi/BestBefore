<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use NotificationChannels\Expo\ExpoPushToken;

final class ExpoPushTokenController extends Controller
{
    public function store(Request $request): Response
    {
        $request->validate([
            'expo_push_token' => ['required', ExpoPushToken::rule()],
        ]);

        $request->user()?->update([
            'expo_push_token' => $request->input('expo_push_token'),
        ]);

        return response()->noContent();
    }
}
