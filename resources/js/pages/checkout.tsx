// resources/js/Pages/Checkout.tsx

import React, { useState } from 'react';
import Layout from '@/components/layout';
import { usePage, router } from '@inertiajs/react'; // Keep router import for now, even if not used for this specific redirect
import axios from 'axios';

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
  [key: string]: any; // Allows for additional props
}
// --- End of your existing interfaces ---


export default function Checkout() {
  const { reservation, reservationFee } = usePage<Props>().props;
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
        <div className="max-w-2xl w-full">
          {/* Summary Section */}
          <div className="space-y-8">
            <h1 className="text-4xl font-serif mb-8 text-center">Checkout Summary</h1>

            {/* Personal Information Section */}
            <div className="border-2 border-white p-6">
              <h2 className="text-2xl font-serif mb-4 border-b-2 border-white pb-2">Personal Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#f6f5c6] font-medium">Name:</span>
                  <span className="text-white">{reservation.guest_first_name} {reservation.guest_last_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#f6f5c6] font-medium">Email:</span>
                  <span className="text-white">{reservation.guest_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#f6f5c6] font-medium">Phone:</span>
                  <span className="text-white">{reservation.guest_phone}</span>
                </div>
              </div>
            </div>

            {/* Booking Information Section */}
            <div className="border-2 border-white p-6">
              <h2 className="text-2xl font-serif mb-4 border-b-2 border-white pb-2">Booking Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#f6f5c6] font-medium">Date:</span>
                  <span className="text-white">{formatDate(reservation.reservation_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#f6f5c6] font-medium">Time:</span>
                  <span className="text-white">
                    {reservation.time_slot?.start_time_formatted || 'Time not available'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#f6f5c6] font-medium">Guests:</span>
                  <span className="text-white">{reservation.guest_count} {reservation.guest_count === 1 ? 'Guest' : 'Guests'}</span>
                </div>
              </div>
            </div>

            {/* Payment Summary Section */}
            <div className="border-2 border-white p-6">
              <h2 className="text-2xl font-serif mb-4 border-b-2 border-white pb-2">Payment Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#f6f5c6] font-medium">Reservation Fee:</span>
                  <span className="text-white">₱{reservationFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t-2 border-white pt-3">
                  <span className="text-[#f6f5c6] font-bold text-lg">Total Amount:</span>
                  <span className="text-white font-bold text-lg">₱{reservationFee.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* --- New: Error Message Display --- */}
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline ml-2">{error}</span>
              </div>
            )}
            {/* --- End New: Error Message Display --- */}

            {/* --- Modified: Confirm & Pay Button --- */}
            <button
              onClick={handlePayment} // Add the onClick handler
              disabled={loading} // Disable button when loading
              className={`w-full py-4 font-medium text-lg bg-white text-[#3f411a] hover:bg-[#f6f5c6] transition-all duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : '' // Add Tailwind classes for disabled state
              }`}
            >
              {loading ? 'Processing Payment...' : `Confirm & Pay ₱${reservationFee.toFixed(2)}`}
            </button>
            {/* --- End Modified: Confirm & Pay Button --- */}
          </div>
        </div>
      </div>
    </Layout>
  );
}