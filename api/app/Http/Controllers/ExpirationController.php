<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ExpirationRequest;
use App\Http\Resources\ExpirationResource;
use App\Models\Expiration;

final class ExpirationController extends Controller
{
    public function index()
    {
        return ExpirationResource::collection(Expiration::all());
    }

    public function store(ExpirationRequest $request)
    {
        return new ExpirationResource(Expiration::create($request->validated()));
    }

    public function show(Expiration $expiration)
    {
        return new ExpirationResource($expiration);
    }

    public function update(ExpirationRequest $request, Expiration $expiration)
    {
        $expiration->update($request->validated());

        return new ExpirationResource($expiration);
    }

    public function destroy(Expiration $expiration)
    {
        $expiration->delete();

        return response()->json();
    }
}
