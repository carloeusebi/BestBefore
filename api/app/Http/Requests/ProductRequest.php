<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\Category;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class ProductRequest extends FormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required'],
            'description' => ['nullable'],
            'barcode' => ['nullable'],
            'brand' => ['nullable'],
            'category' => ['required', Rule::enum(Category::class)],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'nome',
            'description' => 'descrizione',
            'barcode' => 'codice a barre',
            'brand' => 'marca',
            'category' => 'categoria',
        ];
    }
}
