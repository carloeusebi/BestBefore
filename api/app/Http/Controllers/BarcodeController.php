<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\BarcodeRequest;
use App\Http\Resources\BarcodeResource;
use App\Models\Barcode;

final class BarcodeController extends Controller
{
    public function index()
    {
        return BarcodeResource::collection(Barcode::all());
    }

    public function store(BarcodeRequest $request)
    {
        return new BarcodeResource(Barcode::create($request->validated()));
    }

    public function show(Barcode $barcode)
    {
        return new BarcodeResource($barcode);
    }

    public function update(BarcodeRequest $request, Barcode $barcode)
    {
        $barcode->update($request->validated());

        return new BarcodeResource($barcode);
    }

    public function destroy(Barcode $barcode)
    {
        $barcode->delete();

        return response()->json();
    }
}
