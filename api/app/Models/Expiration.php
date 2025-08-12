<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\NotificationMethod;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class Expiration extends Model
{
    use HasFactory, HasUlids, SoftDeletes;

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * @return array{
     *     expires_at: 'date',
     *     notification_days_before: 'int',
     *     notification_method: 'App\Enums\NotificationMethod'
     * }
     */
    protected function casts(): array
    {
        return [
            'expires_at' => 'date',
            'notification_days_before' => 'int',
            'notification_method' => NotificationMethod::class,
        ];
    }
}
