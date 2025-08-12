<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Expiration;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Expiration */ final class ExpirationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'expires_at' => $this->expires_at,
            'quantity' => $this->quantity,
            'notes' => $this->notes,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            'user_id' => $this->user_id,
            'product_id' => $this->product_id,

            'user' => new UserResource($this->whenLoaded('user')),
            'product' => new ProductResource($this->whenLoaded('product')), //
        ];
    }
}
