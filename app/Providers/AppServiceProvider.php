<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL; // <-- Add this line
use Illuminate\Support\Facades\Config; // <-- Add this line
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Support\Facades\Schedule as ScheduleFacade;

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
        // Force HTTPS in production only
        if (Config::get('app.env') === 'production') {
            URL::forceScheme('https');
        }

        // Schedule tasks
        $this->scheduleTasks();
    }

    /**
     * Schedule the application's tasks.
     */
    protected function scheduleTasks(): void
    {
        if (app()->runningInConsole()) {
            return;
        }

        ScheduleFacade::command('email:send-reminders')
            ->hourly()
            ->withoutOverlapping()
            ->runInBackground()
            ->onSuccess(function () {
                \Log::info('Email reminders scheduled task completed successfully');
            })
            ->onFailure(function () {
                \Log::error('Email reminders scheduled task failed');
            });
    }
}