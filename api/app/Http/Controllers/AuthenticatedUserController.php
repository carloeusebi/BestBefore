<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AuthenticatedUserController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        return Response::apiResponse($request->user()?->toResource());
    }
}
