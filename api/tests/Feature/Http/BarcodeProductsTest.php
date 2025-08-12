<?php

declare(strict_types=1);
use App\Models\Barcode;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

beforeEach(function (): void {
    actingAs(User::factory()->create());
});

it('returns the barcode products', function (): void {
    $barcode = Barcode::factory()->hasProducts(3)->create();

    $response = getJson(route('barcodes.products.index', ['barcode' => $barcode->barcode]))->assertOk();

    $response->assertJsonCount(3);
});
