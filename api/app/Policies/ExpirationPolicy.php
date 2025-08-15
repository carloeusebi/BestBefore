<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Expiration;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

final class ExpirationPolicy
{
    use HandlesAuthorization;

    public function update(User $user, Expiration $expiration): bool
    {
        return $user->id === $expiration->user_id;
    }

    public function delete(User $user, Expiration $expiration): bool
    {
        return $user->id === $expiration->user_id;
    }
}
