<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Barcode;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
final class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'name' => fake()->words(asText: true),
            'description' => fake()->text(),
            'brand' => fake()->company(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'barcode_id' => Barcode::factory(),
        ];
    }
}
