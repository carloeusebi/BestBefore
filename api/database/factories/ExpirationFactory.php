<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\NotificationMethod;
use App\Models\Expiration;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<Expiration>
 */
final class ExpirationFactory extends Factory
{
    protected $model = Expiration::class;

    public function definition(): array
    {
        return [
            'expires_at' => now()->addMonth()->startOfDay(), //
            'quantity' => fake()->randomNumber(),
            'notification_method' => fake()->randomElement(NotificationMethod::cases()),
            'notes' => fake()->word(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'user_id' => User::factory(),
            'product_id' => Product::factory(),
        ];
    }
}
