<?php

declare(strict_types=1);
use App\Models\Expiration;
use Carbon\Carbon;

test('expires in format', function (): void {
    Carbon::setTestNow(now()->setTime(12, 00));

    $tomorrow = Expiration::factory()->create(['expires_at' => now()->addDay()])->toResource()->toJson();
    expect($tomorrow)->toContain('"expires_in":"domani"');

    $today = Expiration::factory()->create(['expires_at' => now()])->toResource()->toJson();
    expect($today)->toContain('"expires_in":"oggi"');

    $yesterday = Expiration::factory()->create(['expires_at' => now()->subDay()])->toResource()->toJson();
    expect($yesterday)->toContain('"expires_in":"ieri"');

    $in2Days = Expiration::factory()->create(['expires_at' => now()->addDays(2)])->toResource()->toJson();
    expect($in2Days)->toContain('"expires_in":"tra 2 giorni"');

    $twoDaysAgo = Expiration::factory()->create(['expires_at' => now()->subDays(2)])->toResource()->toJson();
    expect($twoDaysAgo)->toContain('"expires_in":"2 giorni fa"');
});
