<?php

namespace App\Console\Commands;

use App\Models\Reservation;
use Illuminate\Console\Command;

class CleanupExpiredReservations extends Command
{
    protected $signature = 'reservations:cleanup-expired';
    protected $description = 'Delete expired pending reservations';

    public function handle()
    {
        // Only delete reservations that are still pending and expired
        $expiredCount = Reservation::where('status', 'pending')->where('expires_at', '<', now())->count();

        if ($expiredCount > 0) {
            Reservation::where('status', 'pending')->where('expires_at', '<', now())->delete();
            $this->info("Deleted {$expiredCount} expired reservations.");
        } else {
            $this->info('No expired reservations found.');
        }

        return 0;
    }
} 