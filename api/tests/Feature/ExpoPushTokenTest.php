<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;

use function Pest\Laravel\postJson;

beforeEach(function (): void {
    Sanctum::actingAs($this->user = User::factory()->create());
});

it('stores the token', function (): void {
    postJson(route('expo-push-token.store', ['expo_push_token' => $token = 'ExponentPushToken['.Str::random(10).']']))->assertNoContent();

    expect($this->user->fresh()->expo_push_token->asString())->toBe($token);
});
