<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL; // <-- Add this line
use Illuminate\Support\Facades\Config; // <-- Add this line

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Add this block:
        if (Config::get('app.env') === 'local' && Config::get('app.url')) {
            URL::forceRootUrl(Config::get('app.url'));
            // If you are using HTTPS with Ngrok (which you are), it's good to force the scheme too
            URL::forceScheme('https');
        }
    }
}