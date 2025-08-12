<?php

declare(strict_types=1);
use App\Models\User;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;

use function Pest\Laravel\getJson;

it('returns user data', function (): void {
    Sanctum::actingAs($user = User::factory()->create());

    $response = getJson(route('user'))->assertOk();

    $response->assertJson(fn (AssertableJson $json): AssertableJson => $json
        ->where('id', $user->id)
        ->where('name', $user->name)
        ->where('email', $user->email)
        ->where('avatar', $user->avatar)
    );
});

it('returns 401 if not authenticated', function (): void {
    getJson(route('user'))
        ->assertUnauthorized();
});
