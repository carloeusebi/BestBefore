<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Enums\NotificationMethod;
use App\Models\Expiration;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Collection;
use NotificationChannels\Expo\ExpoMessage;

final class AggregatedExpirationsNotification extends Notification
{
    use Queueable;

    /**
     * @param  Collection<int,Expiration>  $expirations
     */
    public function __construct(public Collection $expirations) {}

    /**
     * @return array<string>
     */
    public function via(User $notifiable): array
    {
        $expirationPreference = $this->expirations->count() === 1
            ? $this->expirations->first()?->notification_method
            : null;

        $channels = [];

        if ($notifiable->notify_by_email && (! $expirationPreference || $expirationPreference === NotificationMethod::Email || $expirationPreference === NotificationMethod::Both)) {
            $channels[] = 'mail';
        }

        if ($notifiable->notify_by_push && (! $expirationPreference || $expirationPreference === NotificationMethod::Push || $expirationPreference === NotificationMethod::Both)) {
            $channels[] = 'expo';
        }

        return $channels;
    }

    public function toMail(): MailMessage
    {
        $count = $this->expirations->count();

        $mail = (new MailMessage)
            ->subject("Promemoria scadenze: {$count} prodotto".($count === 1 ? '' : 'i'))
            ->line("Ecco l'elenco dei prodotti in scadenza.");

        $this->expirations
            ->sortBy(fn (Expiration $e) => $e->expires_at)
            ->each(function (Expiration $e) use (&$mail): void {
                $name = $e->product->name ?? 'Prodotto';
                $brand = $e->product->brand ?? '';
                $qty = $e->quantity !== null ? " (q.tà: {$e->quantity})" : '';
                $date = $e->expires_at->format('d/m/Y');
                $mail->line("• {$name} {$brand} {$qty} — Scade il {$date}");
            });

        $mail->line('Apri l’app per maggiori dettagli o per aggiornare le scadenze.');

        return $mail;
    }

    public function toExpo(): ExpoMessage
    {
        $count = $this->expirations->count();

        if ($count === 1) {
            /** @var Expiration $e */
            $e = $this->expirations->first();
            $name = $e->product->name ?? 'Prodotto';
            $days = (int) ($e->notification_days_before ?? 0);
            $date = $e->expires_at->format('d/m/Y');

            $title = $days > 0
                ? "{$name} scade tra {$days} giorn".($days === 1 ? 'o' : 'i')
                : "{$name} scade oggi";

            return ExpoMessage::create($title)
                ->body("Scadenza: {$date}");
        }

        $title = "Hai {$count} prodotti in scadenza";

        return ExpoMessage::create($title)
            ->body('Apri l’app per vedere i dettagli.');
    }
}
