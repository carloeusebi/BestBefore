<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\NotificationMethod;
use App\Models\Expiration;
use App\Notifications\AggregatedExpirationsNotification;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Notification;

final class SendExpirationNotificationsCommand extends Command
{
    protected $signature = 'expirations:notify';

    protected $description = 'Send notifications for expirations that meet the notification criteria.';

    public function handle(): int
    {
        /** @var Collection<int,int> $days */
        $days = Expiration::query()
            ->whereNotNull('notification_days_before')
            ->whereIn('notification_method', [
                NotificationMethod::Email,
                NotificationMethod::Push,
                NotificationMethod::Both,
            ])
            ->whereTodayOrAfter('expires_at')
            ->distinct()
            ->pluck('notification_days_before');

        if ($days->isEmpty()) {
            $this->components->info('No expirations with notification settings found.');

            return self::SUCCESS;
        }

        $totalNotified = 0;

        foreach ($days as $day) {
            $targetDate = now()->startOfDay()->addDays((int) $day);

            $expirations = Expiration::query()
                ->with(['user', 'product'])
                ->where(function (Builder $query) use ($day, $targetDate): void {
                    $query->where(function (Builder $query) use ($day, $targetDate): void {
                        $query->whereDate('expires_at', $targetDate)
                            ->where('notification_days_before', (int) $day);
                    })
                        ->orWhereToday('expires_at');
                })
                ->whereIn('notification_method', [
                    NotificationMethod::Email,
                    NotificationMethod::Push,
                    NotificationMethod::Both,
                ])
                ->get();

            $byUser = $expirations->groupBy('user_id');

            foreach ($byUser as $group) {
                $user = $group->first()?->user;
                if ($user === null) {
                    continue;
                }

                Notification::send($user, new AggregatedExpirationsNotification($group));
                $totalNotified++;
            }
        }

        $this->components->info("Notifications dispatched: {$totalNotified}");

        return self::SUCCESS;
    }
}
