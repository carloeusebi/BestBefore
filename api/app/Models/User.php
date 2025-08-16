<?php

declare(strict_types=1);

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use NotificationChannels\Expo\ExpoPushToken;

final class User extends Authenticatable
{
    use HasApiTokens;

    /** @use HasFactory<UserFactory> */
    use HasFactory;

    use HasUlids;
    use Notifiable;

    protected $hidden = [
        'remember_token',
    ];

    /**
     * @return HasMany<Expiration, $this>
     */
    public function expirations(): HasMany
    {
        return $this->hasMany(Expiration::class);
    }

    public function routeNotificationForExpo(): ?ExpoPushToken
    {
        return $this->expo_push_token;
    }

    /**
     * @return array{
     *     expo_push_token: 'NotificationChannels\Expo\ExpoPushToken'
     * }
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'notify_by_email' => 'boolean',
            'notify_by_push' => 'boolean',
            'expo_push_token' => ExpoPushToken::class,
        ];
    }
}
