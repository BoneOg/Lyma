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
        $logoPath = public_path('assets/logo/lymalogo_email.png');
        $signaturePath = public_path('assets/images/signature.png');
        $logoCid = 'lyma-logo';
        $signatureCid = 'lyma-signature';

        $body = "
        <div style='font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif; max-width: 520px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);'>
            <!-- Header with Logo -->
            <div style='padding: 48px 40px 32px 40px; text-align: center; border-bottom: 1px solid #f0f0f0;'>
                <div style='display: inline-block; margin-bottom: 24px;'>
                    <img src='cid:" . $logoCid . "' alt='Lyma Siargao' style='height: 60px; width: auto;' />
                </div>
                <p style='color: #666666; margin: 0; font-size: 15px; font-weight: 400; letter-spacing: 0.5px;'>
                    Reservation Confirmed
                </p>
            </div>
            
            <!-- Main Content -->
            <div style='padding: 40px 40px 32px 40px;'>
                <p style='color: #2c3e20; margin: 0 0 32px 0; font-size: 16px; font-weight: 400; line-height: 1.6;'>
                    Dear {$data['guest_name']},
                </p>

                <p style='color: #444444; line-height: 1.7; margin: 0 0 40px 0; font-size: 15px; font-weight: 400;'>
                    We are delighted to confirm your reservation at Lyma Siargao. Our team looks forward to creating an exceptional culinary experience for you.
                </p>

                <!-- Reservation Details -->
                <div style='background-color: #fbfbfb; padding: 32px; border-radius: 8px; border: 1px solid #f0f0f0; margin-bottom: 40px;'>
                    <h3 style='color: #2c3e20; margin: 0 0 20px 0; font-size: 16px; font-weight: 500;'>Reservation Details:</h3>
                    <div style='display: grid; gap: 16px;'>
                        <div style='display: grid; grid-template-columns: 120px 1fr; column-gap: 12px; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0;'>
                            <span style='color: #888888; font-size: 14px; font-weight: 500; letter-spacing: 0.3px;'>Name: </span>
                            <span style='color: #2c3e20; font-size: 15px; font-weight: 400;'>{$data['guest_name']}</span>
                        </div>
                        <div style='display: grid; grid-template-columns: 120px 1fr; column-gap: 12px; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0;'>
                            <span style='color: #888888; font-size: 14px; font-weight: 500; letter-spacing: 0.3px;'>Email: </span>
                            <span style='color: #2c3e20; font-size: 15px; font-weight: 400;'>{$data['to']}</span>
                        </div>
                        <div style='display: grid; grid-template-columns: 120px 1fr; column-gap: 12px; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0;'>
                            <span style='color: #888888; font-size: 14px; font-weight: 500; letter-spacing: 0.3px;'>Phone: </span>
                            <span style='color: #2c3e20; font-size: 15px; font-weight: 400;'>" . ($data['phone'] ?? 'N/A') . "</span>
                        </div>
                        <div style='display: grid; grid-template-columns: 120px 1fr; column-gap: 12px; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0;'>
                            <span style='color: #888888; font-size: 14px; font-weight: 500; letter-spacing: 0.3px;'>Date: </span>
                            <span style='color: #2c3e20; font-size: 15px; font-weight: 400;'>{$data['date_formatted']}</span>
                        </div>
                        <div style='display: grid; grid-template-columns: 120px 1fr; column-gap: 12px; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0;'>
                            <span style='color: #888888; font-size: 14px; font-weight: 500; letter-spacing: 0.3px;'>Time: </span>
                            <span style='color: #2c3e20; font-size: 15px; font-weight: 400;'>{$data['time_range']}</span>
                        </div>
                        <div style='display: grid; grid-template-columns: 120px 1fr; column-gap: 12px; align-items: center; padding: 8px 0;'>
                            <span style='color: #888888; font-size: 14px; font-weight: 500; letter-spacing: 0.3px;'>Guests: </span>
                            <span style='color: #2c3e20; font-size: 15px; font-weight: 400;'>{$data['guest_count']}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Group Reservations & Celebrations -->
                <div style='background-color: #fbfbfb; padding: 24px; border-radius: 8px; border: 1px solid #f0f0f0; margin-bottom: 32px;'>
                    <h3 style='color: #2c3e20; margin: 0 0 16px 0; font-size: 16px; font-weight: 500;'>Group Reservations & Celebrations 🎉</h3>
                    <p style='color: #444444; line-height: 1.7; font-size: 14px; font-weight: 400; margin: 0 0 16px 0;'>
                        Planning a special gathering, milestone celebration, or large group dinner at Lyma? 🌿<br />
                        We'd love to make it memorable for you.
                    </p>
                    <p style='color: #444444; line-height: 1.7; font-size: 14px; font-weight: 400; margin: 0;'>
                        For groups of 13 guests or more, or for private events, please contact us directly so we can tailor the experience to your needs:
                    </p>
                </div>

                <p style='color: #444444; line-height: 1.7; font-size: 15px; font-weight: 400; margin: 0 0 16px 0;'>
                    Should you need to modify your reservation, please visit 
                    <a href='https://lymasiargao.com' style='color: #2c3e20; text-decoration: underline; text-decoration-color: #2c3e20; text-underline-offset: 2px;'>
                        lymasiargao.com
                    </a> or contact our team directly.
                </p>
                <p style='color: #444444; line-height: 1.7; font-size: 15px; font-weight: 400; margin: 0 0 4px 0;'>
                    📞 Call or WhatsApp: <a href='tel:+639297561379' style='color: #2c3e20; text-decoration: none;'>+639297561379</a>
                </p>
                <p style='color: #444444; line-height: 1.7; font-size: 15px; font-weight: 400; margin: 0 0 32px 0;'>
                    📸 Instagram DM: <a href='https://instagram.com/lymasiargao' style='color: #2c3e20; text-decoration: none;'>@lymasiargao</a>
                </p>

                <p style='color: #444444; font-size: 15px; font-weight: 400; margin: 0; line-height: 1.7;'>
                    With warm regards,
                </p>
                <p style='color: #2c3e20; font-size: 15px; font-weight: 500; margin: 8px 0 0 0;'>
                    The Lyma Siargao Team
                </p>
            </div>
            
            <!-- Footer as Full Image -->
            <div style='padding: 0; margin: 0; border-top: 1px solid #f0f0f0;'>
                <img src='cid:" . $signatureCid . "' alt='Marc Silvestre - Executive Chef' style='width: 100%; height: auto; display: block; margin: 0;' />
            </div>
        </div>";

        try {
            $attachments = [];
            if (is_readable($logoPath)) {
                $attachments[] = [
                    'content' => base64_encode(file_get_contents($logoPath)),
                    'filename' => 'lymalogo_email.png',
                    'content_type' => 'image/png',
                    'content_id' => $logoCid,
                ];
            }
            if (is_readable($signaturePath)) {
                $attachments[] = [
                    'content' => base64_encode(file_get_contents($signaturePath)),
                    'filename' => 'signature.png',
                    'content_type' => 'image/png',
                    'content_id' => $signatureCid,
                ];
            }

            $response = Resend::emails()->send([
                'from' => 'Lyma Siargao <reservations@lymasiargao.com>',
                'to' => [$data['to']],
                'reply-to' => 'pearl@lymaculinary.com',
                'subject' => $subject,
                'text' => strip_tags(str_replace(['<br/>', '<br>'], "\n", $body)),
                'html' => $body,
                'attachments' => $attachments,
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

            $body = "
            <div style='font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;'>
                <!-- Header -->
                <div style='background-color: #f8f9fa; padding: 30px 20px; text-align: center; border-bottom: 1px solid #e9ecef;'>
                    <h1 style='color: #3D401E; font-size: 48px; font-weight: 300; margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;'>LYMA</h1>
                    <p style='color: #6c757d; margin: 8px 0 0 0; font-size: 16px; font-weight: 400;'>Reservation Reminder</p>
                </div>
                
                <!-- Main Content -->
                <div style='padding: 40px 30px; background-color: #ffffff;'>
                    <h2 style='color: #212529; margin-bottom: 24px; font-size: 20px; font-weight: 500;'>Hello {$reservation->guest_first_name},</h2>
                    
                    <p style='color: #495057; line-height: 1.7; margin-bottom: 24px; font-size: 16px; font-weight: 400;'>
                        This is a friendly reminder about your upcoming reservation at Lyma Siargao today!
                    </p>
                    
                    <!-- Reservation Details Box -->
                    <div style='background-color: #f8f9fa; padding: 24px; margin-bottom: 32px; border-left: 4px solid #3D401E;'>
                        <h3 style='color: #212529; margin-top: 0; margin-bottom: 20px; font-size: 18px; font-weight: 500;'>Reservation Details:</h3>
                        <div style='display: grid; gap: 12px;'>
                            <div style='display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e9ecef;'>
                                <span style='color: #6c757d; font-weight: 500; min-width: 80px;'>Name:</span>
                                <span style='color: #212529; font-weight: 400;'>{$reservation->guest_first_name} {$reservation->guest_last_name}</span>
                            </div>
                            <div style='display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e9ecef;'>
                                <span style='color: #6c757d; font-weight: 500; min-width: 80px;'>Date:</span>
                                <span style='color: #212529; font-weight: 400;'>{$reservation->reservation_date->format('M d, Y')}</span>
                            </div>
                            <div style='display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e9ecef;'>
                                <span style='color: #6c757d; font-weight: 500; min-width: 80px;'>Time:</span>
                                <span style='color: #212529; font-weight: 400;'>{$timeSlot}</span>
                            </div>
                            <div style='display: flex; justify-content: space-between; align-items: center; padding: 8px 0;'>
                                <span style='color: #6c757d; font-weight: 500; min-width: 80px;'>Guests:</span>
                                <span style='color: #212529; font-weight: 400;'>{$reservation->guest_count}</span>
                            </div>
                        </div>
                    </div>
                    
                    <p style='color: #495057; line-height: 1.7; margin-bottom: 24px; font-size: 16px; font-weight: 400;'>
                        We're looking forward to seeing you today! Please arrive 5-10 minutes before your scheduled time.
                    </p>
                    
                    <p style='color: #495057; line-height: 1.7; margin-bottom: 24px; font-size: 16px; font-weight: 400;'>
                        If you need to modify or cancel your reservation, please contact us immediately.
                    </p>
                    
                    <p style='color: #495057; line-height: 1.7; margin-bottom: 0; font-size: 16px; font-weight: 400;'>
                        See you soon!<br>
                        <strong>The Lyma Siargao Team</strong>
                    </p>
                </div>
                
                <!-- Footer -->
                <div style='background-color: #f8f9fa; padding: 24px 20px; text-align: center; border-top: 1px solid #e9ecef;'>
                    <p style='color: #6c757d; margin: 0; font-size: 14px; font-weight: 400;'>
                        For any questions, please contact us at <a href='mailto:pearl@lymaculinary.com' style='color: #3D401E; text-decoration: none; font-weight: 500;'>pearl@lymaculinary.com</a>
                    </p>
                </div>
            </div>";

            $response = Resend::emails()->send([
                'from' => 'Lyma Siargao <reservations@lymasiargao.com>',
                'to' => [$reservation->guest_email],
                'reply-to' => 'pearl@lymaculinary.com',
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

    /**
     * Send cancellation email to customer
     */
    public function sendCancellationEmail(Reservation $reservation): bool
    {
        try {
            $subject = 'Reservation Cancelled - Lyma Siargao';
            
            $body = "
            <div style='font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;'>
                <!-- Header -->
                <div style='background-color: #f8f9fa; padding: 30px 20px; text-align: center; border-bottom: 1px solid #e9ecef;'>
                    <h1 style='color: #3D401E; font-size: 48px; font-weight: 300; margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;'>LYMA</h1>
                    <p style='color: #6c757d; margin: 8px 0 0 0; font-size: 16px; font-weight: 400;'>Reservation Cancelled</p>
                </div>
                
                <!-- Main Content -->
                <div style='padding: 40px 30px; background-color: #ffffff;'>
                    <h2 style='color: #212529; margin-bottom: 24px; font-size: 20px; font-weight: 500;'>Hello {$reservation->guest_first_name},</h2>
                    
                    <p style='color: #495057; line-height: 1.7; margin-bottom: 24px; font-size: 16px; font-weight: 400;'>
                        Your reservation has been cancelled. We understand that circumstances change, and we're here to help you reschedule when you're ready.
                    </p>
                    
                    <!-- Reservation Details Box -->
                    <div style='background-color: #f8f9fa; padding: 24px; margin-bottom: 32px; border-left: 4px solid #3D401E;'>
                        <h3 style='color: #212529; margin-top: 0; margin-bottom: 20px; font-size: 18px; font-weight: 500;'>Cancelled Reservation Details:</h3>
                        <div style='display: grid; gap: 12px;'>
                            <div style='display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e9ecef;'>
                                <span style='color: #6c757d; font-weight: 500; min-width: 80px;'>Date:</span>
                                <span style='color: #212529; font-weight: 400;'>" . $reservation->reservation_date->format('F d, Y') . "</span>
                            </div>
                            <div style='display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e9ecef;'>
                                <span style='color: #6c757d; font-weight: 500; min-width: 80px;'>Time:</span>
                                <span style='color: #212529; font-weight: 400;'>" . ($reservation->timeSlot ? $reservation->timeSlot->start_time_formatted . ' - ' . $reservation->timeSlot->end_time_formatted : 'TBD') . "</span>
                            </div>
                            <div style='display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e9ecef;'>
                                <span style='color: #6c757d; font-weight: 500; min-width: 80px;'>Guests:</span>
                                <span style='color: #212529; font-weight: 400;'>{$reservation->guest_count}</span>
                            </div>
                            <div style='display: flex; justify-content: space-between; align-items: center; padding: 8px 0;'>
                                <span style='color: #6c757d; font-weight: 500; min-width: 80px;'>Name:</span>
                                <span style='color: #212529; font-weight: 400;'>{$reservation->guest_first_name} {$reservation->guest_last_name}</span>
                            </div>
                        </div>
                    </div>
                    
                    <p style='color: #495057; line-height: 1.7; margin-bottom: 24px; font-size: 16px; font-weight: 400;'>
                        If you'd like to make a new reservation, please visit our website at <a href='https://lymasiargao.com' style='color: #3D401E; text-decoration: none; font-weight: 500;'>lymasiargao.com</a> or contact us directly.
                    </p>
                    
                    <p style='color: #495057; line-height: 1.7; margin-bottom: 24px; font-size: 16px; font-weight: 400;'>
                        We look forward to welcoming you to Lyma Siargao in the future!
                    </p>
                    
                    <p style='color: #495057; line-height: 1.7; margin-bottom: 0; font-size: 16px; font-weight: 400;'>
                        Best regards,<br>
                        <strong>The Lyma Siargao Team</strong>
                    </p>
                </div>
                
                <!-- Footer -->
                <div style='background-color: #f8f9fa; padding: 24px 20px; text-align: center; border-top: 1px solid #e9ecef;'>
                    <p style='color: #6c757d; margin: 0; font-size: 14px; font-weight: 400;'>
                        For any questions, please contact us at <a href='mailto:pearl@lymaculinary.com' style='color: #3D401E; text-decoration: none; font-weight: 500;'>pearl@lymaculinary.com</a>
                    </p>
                </div>
            </div>";

            $response = Resend::emails()->send([
                'from' => 'Lyma Siargao <reservations@lymasiargao.com>',
                'to' => [$reservation->guest_email],
                'reply-to' => 'reservations@lymasiargao.com>',
                'subject' => $subject,
                'text' => strip_tags(str_replace(['<br/>', '<br>'], "\n", $body)),
                'html' => $body,
            ]);

            \Log::info('Reservation cancellation email sent successfully', [
                'reservation_id' => $reservation->id,
                'email' => $reservation->guest_email,
                'resend_id' => $response->id ?? null,
            ]);

            return true;
        } catch (\Throwable $e) {
            \Log::error('Failed to send reservation cancellation email', [
                'reservation_id' => $reservation->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }


}
