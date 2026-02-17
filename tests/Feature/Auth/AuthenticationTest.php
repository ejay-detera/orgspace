<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_login_is_rate_limited_after_five_failed_attempts(): void
    {
        $user = User::factory()->create();
        $ip = '127.0.0.1';

        // perform 5 failed attempts
        for ($i = 0; $i < 5; $i++) {
            $this->post('/login', [
                'email' => $user->email,
                'password' => 'wrong-password',
            ], ['REMOTE_ADDR' => $ip])->assertSessionHasErrors('email');
        }

        // 6th attempt should be rate limited (HTML request)
        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ], ['REMOTE_ADDR' => $ip]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();

        $throttleKey = \Illuminate\Support\Str::transliterate(\Illuminate\Support\Str::lower($user->email).'|'.$ip);
        $this->assertTrue(\Illuminate\Support\Facades\RateLimiter::tooManyAttempts($throttleKey, 5));

        // Also assert JSON response includes the numeric `throttle_seconds` when requested via AJAX
        $json = $this->postJson('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ], ['REMOTE_ADDR' => $ip]);

        $json->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'throttle_seconds']);

        $this->assertEquals(\Illuminate\Support\Facades\RateLimiter::availableIn($throttleKey), (int) $json->json('errors.throttle_seconds.0'));

    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }
}
