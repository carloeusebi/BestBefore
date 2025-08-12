<?php

declare(strict_types=1);
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Socialite\Contracts\Provider;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Mockery\MockInterface;

use function Pest\Laravel\assertAuthenticatedAs;
use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\postJson;

it('creates a new user', function () {
    $token = Str::random(100);

    $provider = mock(Provider::class, function (MockInterface $mock) use ($token, &$name, &$email, &$avatar) {
        $socialiteUser = new SocialiteUser;

        $socialiteUser->id = Str::random(10);
        $socialiteUser->name = $name = fake()->name();
        $socialiteUser->email = $email = fake()->unique()->safeEmail();
        $socialiteUser->avatar = $avatar = fake()->imageUrl();

        $mock->shouldReceive('userFromToken')->with($token)->andReturn($socialiteUser);
    });

    Socialite::shouldReceive('driver')->andReturn($provider);

    $response = postJson(route('login'), ['idToken' => $token])->assertOk();

    $response->assertJson(fn (AssertableJson $json) => $json
        ->has('token')
        ->where('user.name', $name)
        ->where('user.email', $email)
        ->where('user.avatar', $avatar)
    );

    expect($user = User::where('email', $email)->first())
        ->not()->toBeNull()
        ->name->toBe($name);

    assertAuthenticatedAs($user);
});

it('authenticates a user if already existing', function () {
    $user = User::factory()->create();
    $token = Str::random(100);

    $provider = mock(Provider::class, function (MockInterface $mock) use ($user, $token) {
        $socialiteUser = new SocialiteUser;

        $socialiteUser->id = $user->google_id;
        $socialiteUser->name = $user->name;
        $socialiteUser->email = $user->email;

        $mock->shouldReceive('userFromToken')->with($token)->andReturn($socialiteUser);
    });

    Socialite::shouldReceive('driver')->andReturn($provider);

    postJson(route('login'), ['idToken' => $token])->assertOk();

    assertDatabaseCount('users', 1);
    assertAuthenticatedAs($user);
});

it('handles errors', function () {
    $token = Str::random(100);
    $provider = mock(Provider::class, function (MockInterface $mock) use ($token) {
        $mock->shouldReceive('userFromToken')->with($token)->andThrow(new Exception('Something went wrong'));
    });

    Socialite::shouldReceive('driver')->andReturn($provider);
    $response = postJson(route('login'), ['idToken' => $token]);

    $response->assertStatus(500)
        ->assertJson(fn (AssertableJson $json) => $json
            ->where('error', 'Something went wrong')
        );
});

it('can logout the user', function () {
    $user = User::factory()->create();
    $token = $user->createToken('auth-token')->plainTextToken;

    postJson(route('logout'), headers: [
        'Authorization' => 'Bearer '.$token,
    ])->assertNoContent();

    assertDatabaseMissing('personal_access_tokens', [
        'tokenable_id' => $user->id,
    ]);
});
