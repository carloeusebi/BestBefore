<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Barcode;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

final class ProductController extends Controller
{
    public function store(ProductRequest $request): JsonResponse
    {
        $product = new Product($request->only(['name', 'description', 'brand']));

        if ($request->has('barcode')) {
            $barcode = Barcode::firstOrCreate(['barcode' => $request->input('barcode')]);

            $product->barcode()->associate($barcode);
        }

        $product->save();

        return response()->json($product->toResource(), 201);
    }
}
