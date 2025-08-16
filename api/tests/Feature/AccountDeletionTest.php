<?php

declare(strict_types=1);

use App\Models\Expiration;
use App\Models\Product;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

it('allows an authenticated user to delete their account and cascades related data', function (): void {
    /** @var User $user */
    $user = User::factory()->create();

    // Create related expirations to verify cascade
    $product = Product::factory()->create();
    Expiration::factory()->for($user)->for($product)->count(2)->create();

    Sanctum::actingAs($user);

    $response = $this->deleteJson('/api/auth/user');

    $response->assertNoContent();

    // User removed
    expect(User::query()->find($user->id))->toBeNull();

    // Related expirations removed via FK cascade
    expect(Expiration::query()->where('user_id', $user->id)->count())->toBe(0);
});

it('prevents unauthenticated account deletion', function (): void {
    $response = $this->deleteJson('/api/auth/user');

    $response->assertUnauthorized();
});
