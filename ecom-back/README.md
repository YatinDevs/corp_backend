# ecommerce-backend

> bash

-   composer create-project laravel/laravel ecommerce-backend

-   cd ecommerce-backend

> bash

SETTING UP Sanctum

# Install all required packages with correct versions

composer require laravel/sanctum guzzlehttp/guzzle
composer require spatie/laravel-medialibrary:^10.0 --ignore-platform-req=ext-exif

1.  Install Compatible Versions

    bash

            composer require spatie/laravel-medialibrary:^13.0 laravel/sanctum:^4.0 guzzlehttp/guzzle:^7.0

2.  Why These Versions?

        Package Version Reason
        spatie/laravel-medialibrary       ^13.0      Specifically supports Laravel 12
        laravel/sanctum                   ^4.0       Current stable for Laravel 12
        guzzlehttp/guzzle                 ^7.0       Standard HTTP client

composer require spatie/laravel-queueable-action

##

1. First, ensure all dependencies are installed:
   bash
   composer install
2. Configure Sanctum (for API auth):
   bash
   php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
3. Set up your environment (.env):
   ini
   SESSION_DRIVER=cookie
   SESSION_SECURE_COOKIE=false # true in production
   SESSION_HTTP_ONLY=true
   SESSION_SAME_SITE=lax

SANCTUM_STATEFUL_DOMAINS=localhost,localhost:8000,127.0.0.1
APP_URL=http://localhost:8000

## Updated User Model (app/Models/User.php)

php

<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

/** @use HasFactory<\Database\Factories\UserFactory> */
class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'verification_token'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'verification_token' // Hide this from API responses
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Send the email verification notification.
     */
    public function sendEmailVerificationNotification(): void
    {
        $this->verification_token = Str::random(60);
        $this->save();

        $verificationUrl = url("/verify-email/{$this->verification_token}");

        $this->notify(new \App\Notifications\VerifyEmail($verificationUrl));
    }

    /**
     * Mark the email as verified.
     */
    public function markEmailAsVerified(): bool
    {
        return $this->forceFill([
            'email_verified_at' => $this->freshTimestamp(),
            'verification_token' => null,
        ])->save();
    }
}
# Verfication

<!--  -->

Create the verification notification:

bash
php artisan make:notification VerifyEmail
Update the notification (app/Notifications/VerifyEmail.php):

php

<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerifyEmail extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public string $verificationUrl)
    {
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Verify Your Email Address')
            ->line('Please click the button below to verify your email address.')
            ->action('Verify Email', $this->verificationUrl)
            ->line('If you did not create an account, no further action is required.');
    }
}
Add to your composer.json (if not already present):

json
"require": {
    "laravel/sanctum": "^4.1",
    "spatie/laravel-queueable-action": "^2.16"
}
This implementation:

Maintains all your existing model functionality

Adds proper email verification

Uses queues for email sending (via ShouldQueue)

Works with Sanctum for API authentication

Follows Laravel 12 best practices

Remember to run your queue worker for email processing:

bash
php artisan queue:work
