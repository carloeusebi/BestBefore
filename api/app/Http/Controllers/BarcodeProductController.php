<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Barcode;
use Illuminate\Http\Request;

final class BarcodeProductController extends Controller
{
    public function index(Barcode $barcode)
    {
        return $barcode
            ->products()
            ->get()
            ->toResourceCollection();
    }

    public function store(Request $request) {}
}
