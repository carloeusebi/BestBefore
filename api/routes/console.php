<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Schedule;

Schedule::command('expirations:notify')->dailyAt('08:00');
