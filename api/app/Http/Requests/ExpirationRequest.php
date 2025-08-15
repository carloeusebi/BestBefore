<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\NotificationMethod;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class ExpirationRequest extends FormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product_id' => ['required', 'exists:products'],
            'expires_at' => ['required', 'date', 'after:today'],
            'quantity' => ['nullable', 'integer'],
            'notes' => ['nullable'],
            'notification_days_before' => ['sometimes', 'integer', 'min:1'],
            'notification_method' => ['sometimes', Rule::enum(NotificationMethod::class)],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'product_id' => 'prodotto',
            'expires_at' => 'data di scadenza',
            'quantity' => 'quantità',
            'notes' => 'note',
            'notification_days_before' => 'giorni prima',
            'notification_method' => 'metodo di notifica',
        ];
    }
}
