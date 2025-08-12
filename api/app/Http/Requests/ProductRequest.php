<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class ProductRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required'],
            'description' => ['nullable'],
            'barcode' => ['nullable'],
            'brand' => ['nullable'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
