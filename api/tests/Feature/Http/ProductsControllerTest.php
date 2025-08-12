<?php

declare(strict_types=1);

use App\Models\Barcode;
use App\Models\User;
use Illuminate\Support\Str;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\postJson;

beforeEach(function (): void {
    actingAs(User::factory()->create());
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
