<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Expiration;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Expiration */
final class ExpirationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'expires_at' => $this->expires_at,
            'expires_in' => $this->getExpiresIn($this->expires_at),
            'is_expired' => $this->expires_at->isPast(),
            'quantity' => $this->quantity,
            'notes' => $this->notes,
            'notification_days_before' => $this->notification_days_before,
            'notification_method' => $this->notification_method,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            'product' => new ProductResource($this->whenLoaded('product')),
        ];
    }

    private function getExpiresIn(CarbonInterface $expiresAt): string
    {
        if ($expiresAt->isTomorrow() && $expiresAt->diffInHours(now()) < 24) {
            return 'domani';
        }

        if ($expiresAt->isToday()) {
            return 'oggi';
        }

        if ($expiresAt->isYesterday()) {
            return 'ieri';
        }

        return $expiresAt->isPast()
            ? $expiresAt->diffForHumans()
            : $expiresAt->endOfDay()->addHour()->diffForHumans();
    }
}
