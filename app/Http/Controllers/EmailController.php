<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Resend\Laravel\Facades\Resend;

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
}
