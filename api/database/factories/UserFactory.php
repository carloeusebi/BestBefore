<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
final class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'google_id' => fake()->unique()->uuid(),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'remember_token' => Str::random(10),
        ];
    }
}
