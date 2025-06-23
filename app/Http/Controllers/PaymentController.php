<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log; 
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\Reservation;
use App\Models\SystemSetting;

class PaymentController extends Controller
{
    private $mayaPublicKey;
    private $mayaSecretKey;
    private $mayaCheckoutUrl;
    private $mayaPaymentsUrl; // To be used if we need to retrieve payment status later

    public function __construct()
    {
        $this->mayaPublicKey = env('MAYA_CHECKOUT_PUBLIC_KEY');
        $this->mayaSecretKey = env('MAYA_CHECKOUT_SECRET_KEY');
        $this->mayaCheckoutUrl = config('maya.checkout_url');
        $this->mayaPaymentsUrl = 'https://pg-sandbox.paymaya.com/payments/v1/payments';
    }

    public function createMayaCheckout(Request $request)
    {
        $request->validate([
            'reservation_id' => 'required|integer',
            'amount' => 'required|numeric|min:1',
        ]);

        $reservationId = $request->input('reservation_id');
        $amount = $request->input('amount');

        $mayaAmount = (int) ($amount);

        $requestReferenceNumber = "RES_" . $reservationId . "_" . Str::random(8);

        $successUrl = route('checkout.success', ['ref' => $requestReferenceNumber]);
        $failureUrl = route('checkout.failure', ['ref' => $requestReferenceNumber]);
        $cancelUrl = route('checkout.cancel', ['ref' => $requestReferenceNumber]);

        try {
            $response = Http::withBasicAuth($this->mayaPublicKey, '')
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])
                ->post($this->mayaCheckoutUrl, [ // Using the configured checkout URL
                    'totalAmount' => [
                        'value' => $mayaAmount,
                        'currency' => 'PHP',
                    ],
                    'items' => [
                        [
                            'name' => 'Reservation Fee',
                            'quantity' => 1,
                            'amount' => [
                                'value' => $mayaAmount,
                                'currency' => 'PHP',
                            ],
                            'totalAmount' => [
                                'value' => $mayaAmount,
                                'currency' => 'PHP',
                            ],
                        ]
                    ],
                    'buyer' => [
                        'firstName' => '',
                        'lastName' => '',
                        'contact' => [
                            'phone' => '',
                            'email' => '',
                        ],
                    ],
                    'redirectUrl' => [
                        'success' => $successUrl,
                        'failure' => $failureUrl,
                        'cancel' => $cancelUrl,
                    ],
                    'requestReferenceNumber' => $requestReferenceNumber,
                ]);

            $mayaResponse = $response->json();

            Log::info('Maya Checkout API Response:', ['status' => $response->status(), 'body' => $mayaResponse]);

            if ($response->successful() && isset($mayaResponse['redirectUrl'])) {
                // In a real application, save the $requestReferenceNumber
                // and the current status (e.g., 'pending_payment') in your database
                return response()->json(['redirectUrl' => $mayaResponse['redirectUrl']]);
            } else {
                Log::error('Failed to create Maya checkout session.', ['response' => $mayaResponse, 'status' => $response->status()]);
                return response()->json(['error' => 'Failed to create Maya checkout session.', 'details' => $mayaResponse], $response->status());
            }

        } catch (\Exception $e) {
            Log::error('Unexpected error creating Maya Checkout:', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'An unexpected server error occurred.'], 500);
        }
    }

    public function checkoutSuccess(Request $request)
    {
        $requestReferenceNumber = $request->query('ref');
        Log::info('Maya Checkout Success Redirect:', ['ref' => $requestReferenceNumber, 'query' => $request->query()]);

        // Extract reservation ID from the reference number (e.g., "RES_15_uDoEzVbG" -> "15")
        // This regex extracts the numeric part between "RES_" and the next underscore.
        preg_match('/RES_(\d+)_/', $requestReferenceNumber, $matches);
        $reservationId = $matches[1] ?? null; // Get the ID, or null if not found

        $reservation = null;
        $statusMessage = 'Payment successful. We are confirming your reservation.';
        $paymentStatus = 'success';
        $reservationFee = SystemSetting::getReservationFee(); // Get the reservation fee

        if ($reservationId) {
            try {
                $reservation = Reservation::find($reservationId);

                if ($reservation) {
                    $reservation->status = 'confirmed'; // Update status from 'pending' to 'confirmed'
                    $reservation->save();
                    Log::info("Reservation #{$reservationId} status updated to 'confirmed'.");
                } else {
                    Log::warning("Reservation #{$reservationId} not found for successful payment.");
                    $statusMessage = 'Payment successful, but reservation details could not be found.';
                }
            } catch (\Exception $e) {
                Log::error("Error updating reservation status for #{$reservationId}: " . $e->getMessage());
                $statusMessage = 'Payment successful, but there was an error updating your reservation status.';
            }
        } else {
            Log::warning("Could not extract Reservation ID from reference number: " . $requestReferenceNumber);
            $statusMessage = 'Payment successful, but reservation ID could not be identified from the reference number.';
        }

        // Load timeSlot relationship for the Transaction page IF the reservation was found
        if ($reservation) {
            $reservation->load(['timeSlot' => function ($query) {
                $query->select('id', 'start_time', 'end_time', 'is_active');
            }]);
            // If you store the actual paid amount in reservation or a payment table, you'd retrieve it here.
            // For now, we're passing the system's fixed reservation fee to display.
        }

        // Redirect to the Inertia Transaction page and pass the data
        return Inertia::render('transaction', [
            'reservation' => $reservation,      // The reservation object (or null if not found)
            'paymentStatus' => $paymentStatus,  // 'success'
            'statusMessage' => $statusMessage,  // Message to display on the page
            'reservationFee' => $reservationFee, // The amount paid (or expected)
        ]);
    }

    public function checkoutFailure(Request $request)
    {
        $requestReferenceNumber = $request->query('ref');
        Log::warning('Maya Checkout Failure Redirect:', ['ref' => $requestReferenceNumber, 'query' => $request->query()]);
        return redirect()->route('home')->with('error', 'Payment failed or was incomplete. Please try again.');
    }

    public function checkoutCancel(Request $request)
    {
        $requestReferenceNumber = $request->query('ref');
        Log::info('Maya Checkout Cancel Redirect:', ['ref' => $requestReferenceNumber, 'query' => $request->query()]);
        return redirect()->route('home')->with('info', 'Payment was cancelled. Your reservation was not confirmed.');
    }

    public function handleWebhook(Request $request)
    {
        Log::info('Maya Webhook Received:', ['payload' => $request->all(), 'headers' => $request->headers->all()]);

        $payload = $request->json()->all();
        $eventType = $payload['type'] ?? null;
        $data = $payload['data'] ?? null;

        if (!$eventType || !$data) {
            Log::warning('Received invalid Maya webhook payload.', ['payload' => $payload]);
            return response()->json(['message' => 'Invalid webhook payload.'], 400);
        }

        $paymentId = $data['id'] ?? null;
        $requestReferenceNumber = $data['requestReferenceNumber'] ?? null;

        if (!$paymentId || !$requestReferenceNumber) {
            Log::warning('Missing payment ID or reference number in Maya webhook data.', ['data' => $data]);
            return response()->json(['message' => 'Missing payment ID or reference number.'], 400);
        }

        Log::info("Maya Webhook Received: {$eventType} for ref #{$requestReferenceNumber}");

        switch ($eventType) {
            case 'PAYMENT_SUCCESS':
                Log::info("Payment SUCCESS for Order Ref: {$requestReferenceNumber}, Payment ID: {$paymentId}");
                break;
            case 'PAYMENT_FAILED':
                Log::warning("Payment FAILED for Order Ref: {$requestReferenceNumber}, Payment ID: {$paymentId}");
                break;
            case 'PAYMENT_EXPIRED':
                Log::info("Payment EXPIRED for Order Ref: {$requestReferenceNumber}, Payment ID: {$paymentId}");
                break;
            case 'CHECKOUT_SUCCESS':
                Log::info("CHECKOUT_SUCCESS received for Order Ref: {$requestReferenceNumber}");
                break;
            default:
                Log::info("Unhandled Maya Webhook Event: {$eventType}");
                break;
        }

        return response()->json(['message' => 'Webhook received and processed.'], 200);
    }
}