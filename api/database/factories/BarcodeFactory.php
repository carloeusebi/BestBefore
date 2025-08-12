<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Barcode;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Barcode>
 */
final class BarcodeFactory extends Factory
{
    protected $model = Barcode::class;

    public function definition(): array
    {
        return [
            'barcode' => fake()->unique()->numerify('################'),
            'created_at' => CarbonImmutable::now(),
            'updated_at' => CarbonImmutable::now(),
        ];
    }
}
