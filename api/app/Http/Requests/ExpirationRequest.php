<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class ExpirationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users'],
            'product_id' => ['required', 'exists:products'],
            'expires_at' => ['required', 'date'],
            'quantity' => ['required', 'integer'],
            'notes' => ['nullable'], //
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
