<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Product extends Model
{
    use HasFactory;
    use HasUlids;

    /**
     * @return HasMany<Expiration, $this>
     */
    public function expirations(): HasMany
    {
        return $this->hasMany(Expiration::class);
    }
}
