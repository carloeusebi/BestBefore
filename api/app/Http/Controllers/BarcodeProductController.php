<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Barcode;
use Illuminate\Http\Resources\Json\ResourceCollection;

final class BarcodeProductController extends Controller
{
    public function __invoke(Barcode $barcode): ResourceCollection
    {
        return $barcode
            ->products()
            ->get()
            ->toResourceCollection();
    }
}
