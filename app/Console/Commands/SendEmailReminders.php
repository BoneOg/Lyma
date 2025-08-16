<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\EmailController;

class SendEmailReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send email reminders for upcoming reservations based on system settings';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting email reminder process...');
        
        try {
            $emailController = new EmailController();
            $result = $emailController->sendRemindersForUpcomingReservations();
            
            if ($result['success']) {
                $this->info("Email reminders processed successfully!");
                $this->info("Sent: {$result['sent']}, Failed: {$result['failed']}, Already Sent: {$result['already_sent']}");
                
                if ($result['sent'] > 0) {
                    $this->info("✅ Successfully sent {$result['sent']} reminder(s)");
                }
                
                if ($result['failed'] > 0) {
                    $this->warn("❌ Failed to send {$result['failed']} reminder(s)");
                }
                
                if ($result['already_sent'] > 0) {
                    $this->info("ℹ️  {$result['already_sent']} reservation(s) already had reminders sent");
                }
                
                if ($result['sent'] === 0 && $result['failed'] === 0) {
                    $this->info("ℹ️  No new reminders needed at this time");
                }
            } else {
                $this->error("❌ Failed to process email reminders: " . ($result['message'] ?? 'Unknown error'));
                return 1;
            }
            
        } catch (\Exception $e) {
            $this->error("❌ Error sending email reminders: " . $e->getMessage());
            return 1;
        }
        
        $this->info('Email reminder process completed.');
        return 0;
    }
}

