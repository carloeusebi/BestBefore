<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\User;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\Expo\ExpoMessage;

// @codeCoverageIgnoreStart
final class TestNotification extends Notification
{
    public function __construct() {}

    /**
     * @return array<string>
     */
    public function via(User $notifiable): array
    {
        return array_filter([
            $notifiable->notify_by_push ? 'expo' : null,
            $notifiable->notify_by_email ? 'mail' : null,
        ]);
    }

    public function toMail(): MailMessage
    {
        return new MailMessage()
            ->subject('Test notification')
            ->line('This is a test notification');
    }

    public function toExpo(): ExpoMessage
    {
        return ExpoMessage::create('Test notification')
            ->body('This is a test notification')
            ->playSound();
    }
}

// @codeCoverageIgnoreEnd
