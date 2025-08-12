<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Barcode;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

final class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(asText: true),
            'description' => $this->faker->text(),
            'brand' => $this->faker->company(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'barcode_id' => Barcode::factory(),
        ];
    }
}
