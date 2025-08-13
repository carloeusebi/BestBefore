<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

final class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    use HasUlids;
    use Searchable;

    protected $with = ['barcode'];

    /**
     * @return HasMany<Expiration, $this>
     */
    public function expirations(): HasMany
    {
        return $this->hasMany(Expiration::class);
    }

    /**
     * @return BelongsTo<Barcode, $this>
     */
    public function barcode(): BelongsTo
    {
        return $this->belongsTo(Barcode::class);
    }

    /**
     * @return array<string, string>
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'brand' => (string) $this->brand,
            'description' => (string) $this->description,
        ];
    }
}
