<?php

declare(strict_types=1);

use App\Models\Barcode;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Testing\Fluent\AssertableJson;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

beforeEach(function (): void {
    actingAs(User::factory()->create());
});

it('can retrieve products', function (): void {
    Product::factory()->create(['name' => 'Test Product']);

    $response = getJson(route('products.index', ['q' => 'test']))->assertOk();

    $response->assertJsonCount(1);
});

it('returns an empty array if no products found', function (): void {
    Product::factory()->create(['name' => 'Test Product']);

    $response = getJson(route('products.index'))->assertOk();

    $response->assertJsonCount(0);
});

it('requires at least three characters', function (): void {
    $response = getJson(route('products.index', ['q' => 'te']));

    $response->assertInvalid('q');
});

it('can store a product', function (): void {
    postJson(route('products.store'), [
        'name' => $name = 'Test Product',
        'description' => $description = 'Test Product Description',
        'brand' => $brand = 'Test Brand',
    ])->assertCreated();

    assertDatabaseHas('products', [
        'name' => $name,
        'description' => $description,
        'brand' => $brand,
    ]);
});

it('associates an existing barcode', function (): void {
    $barcode = Barcode::factory()->create();

    postJson(route('products.store'), [
        'name' => $name = 'Test Product',
        'barcode' => $barcode->barcode,
    ])->assertCreated();

    assertDatabaseHas('products', [
        'name' => $name,
        'barcode_id' => $barcode->id,
    ]);
});

it('creates a barcode if not existing', function (): void {
    postJson(route('products.store'), [
        'name' => $name = 'Test Product',
        'barcode' => $barcode = Str::random(),
    ]);

    assertDatabaseHas('barcodes', [
        'barcode' => $barcode,
    ]);
    assertDatabaseHas('products', [
        'name' => $name,
        'barcode_id' => Barcode::where('barcode', $barcode)->first()->id,
    ]);
});

it('returns a product', function (): void {
    $product = Product::factory()->create();

    $response = getJson(route('products.show', ['product' => $product]))->assertOk();

    $response->assertJson(fn (AssertableJson $json) => $json
        ->where('id', $product->id)
        ->where('name', $product->name)
        ->where('barcode', $product->barcode->barcode)
        ->where('description', $product->description)
        ->where('brand', $product->brand)

    );
});

it('returns 404 if not found', function (): void {
    getJson(route('products.show', ['product' => 'invalid-id']))->assertNotFound();
});
