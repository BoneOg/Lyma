<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Resend\Laravel\Facades\Resend;

class EmailController extends Controller
{
    public function sendTestEmail(Request $request): JsonResponse
    {
        try {
            $response = Resend::emails()->send([
                'from' => 'reservations@lymasiargao.com',
                'to' => ['vaughnpereyra098@gmail.com'],
                'subject' => 'Lyma Siargao Reservations',
                'text' => 'Testing this email',
                'html' => '<p>Testing this email</p>',
            ]);

            return response()->json([
                'success' => true,
                'id' => $response->id ?? null,
            ]);
        } catch (\Throwable $e) {
            \Log::error('Resend sendTestEmail failed', [
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to send email: ' . $e->getMessage(),
            ], 500);
        }
    }
}
