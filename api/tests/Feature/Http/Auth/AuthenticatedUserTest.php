<?php

declare(strict_types=1);
use App\Models\User;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;

use function Pest\Laravel\getJson;
use function Pest\Laravel\patchJson;

it('returns user data', function (): void {
    Sanctum::actingAs($user = User::factory()->create()->fresh());

    $response = getJson(route('user.show'))->assertOk();

    $response->assertJson(fn (AssertableJson $json): AssertableJson => $json
        ->where('id', $user->id)
        ->where('name', $user->name)
        ->where('email', $user->email)
        ->where('avatar', $user->avatar)
        ->where('notifyByEmail', $user->notify_by_email)
        ->where('notifyByPush', $user->notify_by_push)
    );
});

it('returns 401 if not authenticated', function (): void {
    getJson(route('user.show'))->assertUnauthorized();
});

it('can update the notification settings', function (): void {
    Sanctum::actingAs($user = User::factory()->create());

    patchJson(route('user.update'), [
        'notify_by_email' => true,
        'notify_by_push' => true,
    ])->assertSuccessful();

    expect($user->refresh()->notify_by_push)->toBeTrue()
        ->and($user->notify_by_email)->toBeTrue();
});
