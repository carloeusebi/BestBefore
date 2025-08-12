<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class BarcodeRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'barcode' => ['required'], //
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
