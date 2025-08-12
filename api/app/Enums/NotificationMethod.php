<?php

declare(strict_types=1);

namespace App\Enums;

enum NotificationMethod: string
{
    case None = 'none';
    case Email = 'email';
    case Push = 'push';
    case Both = 'both';
}
