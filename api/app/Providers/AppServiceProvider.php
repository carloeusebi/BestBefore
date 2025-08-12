<?php

declare(strict_types=1);

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Model::unguard();

        Model::shouldBeStrict();

        DB::prohibitDestructiveCommands($this->app->isProduction());

        URL::forceHttps(App::isProduction());

        JsonResource::withoutWrapping();

        Date::use(CarbonImmutable::class);
    }
}
