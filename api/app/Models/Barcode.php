<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\BarcodeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Barcode extends Model
{
    /** @use HasFactory<BarcodeFactory> */
    use HasFactory;

    public function getRouteKeyName(): string
    {
        return 'barcode';
    }

    /**
     * @return HasMany<Product, $this>
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class)->chaperone();
    }
}
