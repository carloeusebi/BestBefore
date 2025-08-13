<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Barcode;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'q' => ['sometimes', 'string', 'min:3'],
        ]);

        if (! $request->has('q')) {
            return response()->json();
        }

        $products = Product::search($request->input('q'))
            ->get()
            ->toResourceCollection();

        return response()->json($products);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json($product->toResource());
    }

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
