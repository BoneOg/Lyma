<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Resend\Laravel\Facades\Resend;
use App\Models\Reservation;
use Carbon\Carbon;

class EmailController extends Controller
{
    public function sendReservationConfirmation(Request $request): JsonResponse
    {
        $data = $request->validate([
            'to' => ['required', 'email'],
            'guest_name' => ['required', 'string'],
            'phone' => ['nullable', 'string'],
            'date_formatted' => ['required', 'string'],
            'time_range' => ['required', 'string'],
            'guest_count' => ['required', 'integer'],
        ]);

        $subject = "Your Reservation at Lyma Siargao is Confirmed — {$data['date_formatted']}";

        $body = <<<HTML
<p>Dear {$data['guest_name']},</p>
<p>Thank you for choosing Lyma Siargao. We are pleased to confirm your reservation as follows:</p>
<p><strong>Reservation Details:</strong></p>
<ul>
  <li><strong>Guest Name:</strong> {$data['guest_name']}</li>
  <li><strong>Email:</strong> {$data['to']}</li>
  <li><strong>Phone:</strong> {$data['phone']}</li>
  <li><strong>Date:</strong> {$data['date_formatted']}</li>
  <li><strong>Time:</strong> {$data['time_range']}</li>
  <li><strong>Number of Guests:</strong> {$data['guest_count']}</li>
</ul>
<p>We look forward to welcoming you and providing an exceptional dining experience. If you need to modify or cancel your reservation, please visit our website at <a href="https://lymasiargao.com">lymasiargao.com</a> or contact us directly.</p>
<p>Thank you again for choosing Lyma Siargao.</p>
<p>Warm regards,<br/>The Lyma Team<br/><a href="https://lymasiargao.com">lymasiargao.com</a></p>
HTML;

        try {
            $response = Resend::emails()->send([
                'from' => 'Lyma Siargao <reservations@lymasiargao.com>',
                'to' => [$data['to']],
                'subject' => $subject,
                'text' => strip_tags(str_replace(['<br/>', '<br>'], "\n", $body)),
                'html' => $body,
            ]);

            return response()->json([
                'success' => true,
                'id' => $response->id ?? null,
            ]);
        } catch (\Throwable $e) {
            \Log::error('Resend sendReservationConfirmation failed', [
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to send email: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function sendReservationReminder(Reservation $reservation): bool
    {
        try {
            // Check if reminder has already been sent for this reservation
            if ($reservation->reminder_sent_at !== null) {
                \Log::info('Reminder already sent for reservation', [
                    'reservation_id' => $reservation->id,
                    'reminder_sent_at' => $reservation->reminder_sent_at,
                ]);
                return true; // Return true since reminder was already sent
            }

            $subject = "Reminder: Your Reservation at Lyma Siargao — {$reservation->reservation_date->format('M d, Y')}";

            $timeSlot = $reservation->timeSlot ? $reservation->timeSlot->start_time_formatted : 'TBD';

            $body = <<<HTML
<p>Dear {$reservation->guest_first_name},</p>
<p>This is a friendly reminder about your upcoming reservation at Lyma Siargao today!</p>
<p><strong>Reservation Details:</strong></p>
<ul>
  <li><strong>Guest Name:</strong> {$reservation->guest_first_name} {$reservation->guest_last_name}</li>
  <li><strong>Date:</strong> {$reservation->reservation_date->format('M d, Y')}</li>
  <li><strong>Time:</strong> {$timeSlot}</li>
  <li><strong>Number of Guests:</strong> {$reservation->guest_count}</li>
</ul>
<p>We're looking forward to seeing you today! Please arrive 5-10 minutes before your scheduled time.</p>
<p>If you need to modify or cancel your reservation, please contact us immediately.</p>
<p>See you soon!</p>
<p>Warm regards,<br/>The Lyma Team<br/><a href="https://lymasiargao.com">lymasiargao.com</a></p>
HTML;

            $response = Resend::emails()->send([
                'from' => 'Lyma Siargao <reservations@lymasiargao.com>',
                'to' => [$reservation->guest_email],
                'subject' => $subject,
                'text' => strip_tags(str_replace(['<br/>', '<br>'], "\n", $body)),
                'html' => $body,
            ]);

            // Update the reservation to mark reminder as sent
            $reservation->update([
                'reminder_sent_at' => now(),
                'reminder_sent_count' => $reservation->reminder_sent_count + 1,
            ]);

            \Log::info('Reservation reminder sent successfully', [
                'reservation_id' => $reservation->id,
                'email' => $reservation->guest_email,
                'resend_id' => $response->id ?? null,
                'reminder_sent_at' => now(),
            ]);

            return true;
        } catch (\Throwable $e) {
            \Log::error('Failed to send reservation reminder', [
                'reservation_id' => $reservation->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    public function sendRemindersForUpcomingReservations(): array
    {
        try {
            // Get the reminder hours setting from system settings
            $reminderHours = (int) \App\Models\SystemSetting::get('reminder_hours', 2);
            
            // Calculate the time threshold for sending reminders
            $reminderThreshold = now()->addHours($reminderHours);
            
            // Get confirmed reservations that are within the reminder window
            // AND haven't had a reminder sent yet
            $reservationsNeedingReminders = Reservation::confirmed()
                ->where('reservation_date', '>=', now()->format('Y-m-d'))
                ->where('reservation_date', '<=', $reminderThreshold->format('Y-m-d'))
                ->where('reservation_date', '>', now()->format('Y-m-d')) // Only future dates
                ->whereNull('reminder_sent_at') // Only reservations that haven't had reminders sent
                ->get();

            $sentCount = 0;
            $failedCount = 0;
            $alreadySentCount = 0;

            foreach ($reservationsNeedingReminders as $reservation) {
                // Check if this reservation is exactly at the reminder threshold
                $reservationDateTime = Carbon::parse($reservation->reservation_date);
                $hoursUntilReservation = now()->diffInHours($reservationDateTime, false);
                
                if ($hoursUntilReservation <= $reminderHours && $hoursUntilReservation > 0) {
                    $success = $this->sendReservationReminder($reservation);
                    if ($success) {
                        $sentCount++;
                    } else {
                        $failedCount++;
                    }
                }
            }

            // Count reservations that already had reminders sent
            $alreadySentCount = Reservation::confirmed()
                ->where('reservation_date', '>=', now()->format('Y-m-d'))
                ->where('reservation_date', '<=', $reminderThreshold->format('Y-m-d'))
                ->where('reservation_date', '>', now()->format('Y-m-d'))
                ->whereNotNull('reminder_sent_at')
                ->count();

            return [
                'success' => true,
                'sent' => $sentCount,
                'failed' => $failedCount,
                'already_sent' => $alreadySentCount,
                'total_processed' => $reservationsNeedingReminders->count()
            ];

        } catch (\Exception $e) {
            \Log::error('Error processing reservation reminders', [
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Failed to process reminders: ' . $e->getMessage()
            ];
        }
    }
}
