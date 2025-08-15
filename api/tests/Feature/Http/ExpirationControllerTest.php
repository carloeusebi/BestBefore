<?php

declare(strict_types=1);
use App\Models\Expiration;
use App\Models\Product;
use App\Models\User;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

beforeEach(function (): void {
    Sanctum::actingAs($this->user = User::factory()->create());
});

it("lists user's expirations sorted by expiration date", function (): void {
    $middle = Expiration::factory()->for($this->user)->create(['expires_at' => now()->addDays(15)]);
    $closer = Expiration::factory()->for($this->user)->create(['expires_at' => now()->addDay()]);
    $further = Expiration::factory()->for($this->user)->create(['expires_at' => now()->addDays(30)]);

    $response = getJson(route('expirations.index'))->assertOk();

    $response
        ->assertJson(fn (AssertableJson $json): AssertableJson => $json
            ->has('data', 3)
            ->where('data.0.id', $closer->id)
            ->where('data.1.id', $middle->id)
            ->where('data.2.id', $further->id)
            ->etc()
        );
});

it('does not return expirations from other users', function (): void {
    Expiration::factory()->create();
    Expiration::factory()->for($this->user)->create();

    $response = getJson(route('expirations.index'))->assertOk();

    $response->assertJson(fn (AssertableJson $json): AssertableJson => $json
        ->has('data', 1)
        ->etc()
    );
});

it('can create a new expiration', function (): void {
    $data = Expiration::factory()->raw();

    $response = postJson(route('expirations.store'), $data)
        ->assertValid()
        ->assertCreated();

    $response->assertJson(fn (AssertableJson $json): AssertableJson => $json->hasAll([
        'id',
        'expires_at',
        'expires_in',
        'quantity',
        'notes',
        'product',
        'created_at',
        'updated_at',
        'expires_in',
        'is_expired',
    ]));

    assertDatabaseHas('expirations', [
        'expires_at' => $data['expires_at'],
        'user_id' => $this->user->id,
        'product_id' => $data['product_id'],
    ]);
});

it('filters expirations by product', function (): void {
    $product = Product::factory()->create();
    $expirations = Expiration::factory(3)->for($this->user)->for($product)->create();
    Expiration::factory(3)->for($this->user)->create();

    $response = getJson(route('expirations.index', ['product' => $product->id]))->assertOk();

    $response->assertJson(fn (AssertableJson $json): AssertableJson => $json
        ->has('data', $expirations->count())
        ->etc()
    );
});

it('can update an expiration', function (): void {
    $expiration = Expiration::factory()->for($this->user)->create();

    putJson(route('expirations.update', $expiration), [
        'product_id' => $expiration->product_id,
        'expires_at' => $expiration->expires_at,
        'quantity' => $expiration->quantity - 1,
        'notes' => $expiration->notes,
    ])->assertOk();

    expect($expiration->fresh()->quantity)->toBe($expiration->quantity - 1);
});

it('cannot update an expiration if not owned by the user', function (): void {
    $expiration = Expiration::factory()->create();

    putJson(route('expirations.update', $expiration), [
        'product_id' => $expiration->product_id,
        'expires_at' => $expiration->expires_at,
        'quantity' => $expiration->quantity - 1,
        'notes' => $expiration->notes,
    ])->assertForbidden();
});

it('can delete an expiration', function (): void {
    $expiration = Expiration::factory()->for($this->user)->create();

    deleteJson(route('expirations.destroy', $expiration))->assertNoContent();

    expect($expiration->fresh())->toBeNull();
});

it('cannot delete an expiration if not owned by the user', function (): void {
    $expiration = Expiration::factory()->create();

    deleteJson(route('expirations.destroy', $expiration))->assertForbidden();
});
