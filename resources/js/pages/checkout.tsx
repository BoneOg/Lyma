// resources/js/Pages/Checkout.tsx

import React, { useState } from 'react';
import Layout from '@/components/layout';
import { usePage, router } from '@inertiajs/react'; // Keep router import for now, even if not used for this specific redirect
import axios from 'axios';
import Timer from '@/components/Timer';

// --- Your existing interfaces ---
interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  start_time_formatted: string;
}

interface Reservation {
  id: number;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  reservation_date: string;
  guest_count: number;
  status: string;
  time_slot: TimeSlot;
}

interface Props {
  reservation: Reservation;
  reservationFee: number;
  expiresAt?: string;
  [key: string]: any; // Allows for additional props
}
// --- End of your existing interfaces ---


export default function Checkout() {
  const { reservation, reservationFee, expiresAt } = usePage<Props>().props;
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for error messages

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleExpired = () => {
    // Redirect to home page when timer expires
    router.visit('/');
  };

  // --- Modified Function: handlePayment ---
  const handlePayment = async () => {
    // 1. Add confirmation prompt
    const confirmed = window.confirm('Are you sure you want to proceed with this reservation and payment?');
    if (!confirmed) {
      return; // If user cancels, stop the function
    }

    setLoading(true); // Start loading
    setError(null); // Clear any previous errors

    try {
      // Make a POST request to your Laravel backend endpoint.
      // This endpoint will talk to Maya and get the redirect URL.
      const response = await axios.post('/create-maya-checkout', {
        reservation_id: reservation.id, // Pass the reservation ID to your backend
        amount: reservationFee, // Pass the reservation fee to be charged
        // You can add more data here if your backend needs it to construct the Maya payload
      });

      if (response.data && response.data.redirectUrl) {
        // If your Laravel backend successfully received a redirectUrl from Maya,
        // redirect the user's browser to Maya's hosted payment page.
        // ✅ Using window.location.href to avoid external error from Inertia's TypeScript definitions
        window.location.href = response.data.redirectUrl;
      } else {
        // This means your backend didn't return the expected redirectUrl
        setError('Payment initiation failed: No redirect URL received from server.');
      }
    } catch (err) {
      console.error('Error initiating Maya Checkout:', err);
      if (axios.isAxiosError(err) && err.response) {
        // If it's an Axios error and there's a response from your server
        setError(err.response.data.error || 'Failed to initiate payment. Please try again.');
      } else {
        // Generic error for network issues or other unexpected errors
        setError('An unexpected error occurred. Please check your internet connection.');
      }
    } finally {
      setLoading(false); // Always stop loading regardless of success or failure
    }
  };
  // --- End of Modified Function ---

  return (
    <Layout>
      <div className="min-h-screen bg-[#3f411a] text-white flex items-center justify-center py-12 px-4">
        <div className="max-w-4xl w-full">
          {/* Main Container */}
          <div className="bg-white shadow-lg p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl text-[#3f411a] font-lexend font-extralight">Checkout Summary</h1>
              {expiresAt && (
                <Timer expiresAt={expiresAt} onExpired={handleExpired} />
              )}
            </div>

            <div className="space-y-8">
              {/* Personal Information Section */}
              <div className="border border-[#3f411a]/20 p-6">
                <h2 className="text-xl text-[#3f411a] font-lexend font-extralight mb-6 border-b border-[#3f411a]/20 pb-3">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-extralight text-[#3f411a]/60 font-lexend">Name</label>
                    <div className="text-[#3f411a] font-lexend font-medium">
                      {reservation.guest_first_name} {reservation.guest_last_name}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-extralight text-[#3f411a]/60 font-lexend">Email</label>
                    <div className="text-[#3f411a] font-lexend font-medium">
                      {reservation.guest_email}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-extralight text-[#3f411a]/60 font-lexend">Phone</label>
                    <div className="text-[#3f411a] font-lexend font-medium">
                      {reservation.guest_phone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Information Section */}
              <div className="border border-[#3f411a]/20 p-6">
                <h2 className="text-xl text-[#3f411a] font-lexend font-extralight mb-6 border-b border-[#3f411a]/20 pb-3">
                  Booking Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-extralight text-[#3f411a]/60 font-lexend">Date</label>
                    <div className="text-[#3f411a] font-lexend font-medium">
                      {formatDate(reservation.reservation_date)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-extralight text-[#3f411a]/60 font-lexend">Time</label>
                    <div className="text-[#3f411a] font-lexend font-medium">
                      {reservation.time_slot?.start_time_formatted || 'Time not available'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-extralight text-[#3f411a]/60 font-lexend">Guests</label>
                    <div className="text-[#3f411a] font-lexend font-medium">
                      {reservation.guest_count} {reservation.guest_count === 1 ? 'Guest' : 'Guests'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Summary Section */}
              <div className="border border-[#3f411a]/20 p-6">
                <h2 className="text-xl text-[#3f411a] font-lexend font-extralight mb-6 border-b border-[#3f411a]/20 pb-3">
                  Payment Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#3f411a]/80 font-lexend font-extralight">Reservation Fee</span>
                    <span className="text-[#3f411a] font-lexend font-medium">₱{reservationFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-[#3f411a]/20 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#3f411a] font-lexend font-medium text-lg">Total Amount</span>
                      <span className="text-[#3f411a] font-lexend font-medium text-lg">₱{reservationFee.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 p-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" className="text-red-500 mr-3">
                      <g fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <path stroke-linecap="round" d="m15 9l-6 6m0-6l6 6" />
                      </g>
                    </svg>
                    <div>
                      <strong className="font-medium text-red-800 font-lexend">Error!</strong>
                      <span className="block text-red-700 font-lexend font-extralight ml-2">{error}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm & Pay Button */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className={`w-full py-4 font-lexend font-medium text-lg transition-all duration-200 ${
                  loading 
                    ? 'bg-[#3f411a]/30 text-[#3f411a]/50 cursor-not-allowed' 
                    : 'bg-[#3f411a] text-white hover:bg-[#2a2d12] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Payment...
                  </div>
                ) : (
                  `Confirm & Pay ₱${reservationFee.toFixed(2)}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}