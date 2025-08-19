<?php

declare(strict_types=1);

use App\Enums\NotificationMethod;
use App\Models\Expiration;
use App\Models\Product;
use App\Models\User;
use App\Notifications\AggregatedExpirationsNotification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Notification;

use function Pest\Laravel\artisan;

beforeEach(function (): void {
    Carbon::setTestNow(Carbon::create(2025, 8, 17, 8, 41));
});

it('aggregates expirations per user for the day window and sends a single notification', function (): void {
    $user = User::factory()->create([
        'notify_by_email' => true,
        'notify_by_push' => true,
    ]);

    $product1 = Product::factory()->create(['name' => 'Latte']);
    $product2 = Product::factory()->create(['name' => 'Yogurt']);

    // Matching two expirations for same day window
    $match1 = Expiration::factory()->for($user)->for($product1)->create([
        'expires_at' => Carbon::now()->copy()->startOfDay()->addDays(3),
        'notification_days_before' => 3,
        'notification_method' => NotificationMethod::Both,
    ]);
    $match2 = Expiration::factory()->for($user)->for($product2)->create([
        'expires_at' => Carbon::now()->copy()->startOfDay()->addDays(3),
        'notification_days_before' => 3,
        'notification_method' => NotificationMethod::Email,
    ]);

    // Not matching (different day window)
    Expiration::factory()->for($user)->for($product1)->create([
        'expires_at' => Carbon::now()->copy()->startOfDay()->addDays(4),
        'notification_days_before' => 3,
        'notification_method' => NotificationMethod::Both,
    ]);

    // Not matching (None)
    Expiration::factory()->for($user)->for($product1)->create([
        'expires_at' => Carbon::now()->copy()->startOfDay()->addDays(3),
        'notification_days_before' => 3,
        'notification_method' => NotificationMethod::None,
    ]);

    Notification::fake();

    artisan('expirations:notify')->assertSuccessful();

    Notification::assertSentTo($user, AggregatedExpirationsNotification::class, function (AggregatedExpirationsNotification $notification) use ($user): bool {
        expect($notification->expirations)->toHaveCount(2);

        $channels = $notification->via($user);
        sort($channels);
        expect($channels)->toBe(['expo', 'mail']);

        return true;
    });
});

it('respects user preferences for channels regardless of expiration method', function (): void {
    $user = User::factory()->create([
        'notify_by_email' => true,
        'notify_by_push' => false,
    ]);

    $product = Product::factory()->create(['name' => 'Yogurt']);

    // Anche se l'expiration chiede Email, i canali dipendono solo dalle preferenze utente
    Expiration::factory()->for($user)->for($product)->create([
        'expires_at' => Carbon::now()->copy()->startOfDay()->addDay(),
        'notification_days_before' => 1,
        'notification_method' => NotificationMethod::Email,
    ]);

    Notification::fake();

    artisan('expirations:notify')->assertSuccessful();

    Notification::assertSentTo($user, AggregatedExpirationsNotification::class, function (AggregatedExpirationsNotification $n) use ($user): bool {
        expect($n->via($user))->toBe(['mail']);

        return true;
    });
});

it('sends push only when user prefers push', function (): void {
    $user = User::factory()->create([
        'notify_by_email' => false,
        'notify_by_push' => true,
    ]);

    $product = Product::factory()->create(['name' => 'Formaggio']);

    Expiration::factory()->for($user)->for($product)->create([
        'expires_at' => Carbon::now()->copy()->startOfDay(),
        'notification_days_before' => 0,
        'notification_method' => NotificationMethod::Push,
    ]);

    Notification::fake();

    artisan('expirations:notify')->assertSuccessful();

    Notification::assertSentTo($user, AggregatedExpirationsNotification::class, function (AggregatedExpirationsNotification $n) use ($user): bool {
        expect($n->via($user))->toBe(['expo']);

        return true;
    });
});

it('does not notifies today\'s expirations "days" times', function (): void {
    Notification::fake();
    $user = User::factory()->create();

    Expiration::factory()->for($user)->create(['created_at' => now()->subDays(3), 'notification_days_before' => 3, 'expires_at' => now()->addDays(3)]);
    Expiration::factory()->for($user)->create(['created_at' => now()->subDays(2), 'notification_days_before' => 2, 'expires_at' => today()]);

    artisan('expirations:notify')->assertSuccessful();

    Notification::assertCount(1);
});
