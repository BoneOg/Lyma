// resources/js/Pages/Checkout.tsx

import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import Layout from '@/components/layout';
import Timer from '@/components/Timer';
import { useNotification } from '@/contexts/NotificationContext';

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
  reservation: {
    id: number;
    guest_first_name: string;
    guest_last_name: string;
    guest_email: string;
    guest_phone: string;
    reservation_date: string;
    guest_count: number;
    status: string;
    time_slot: {
      id: number;
      start_time: string;
      end_time: string;
      is_active: boolean;
    };
  };
  expiresAt: string;
  [key: string]: any;
}
// --- End of your existing interfaces ---


export default function Checkout() {
  const { reservation, expiresAt } = usePage<Props>().props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();
  const [disableConfirm, setDisableConfirm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
    console.log('Timer expired, redirecting to reservation page...');
    try {
      console.log('Attempting router.visit to /reservation?expired=1');
      router.visit('/reservation?expired=1');
    } catch (error) {
      console.error('Router visit failed, using window.location:', error);
      window.location.href = '/reservation?expired=1';
    }
  };

  const handleAlmostExpired = () => {
    setDisableConfirm(true);
  };

  const handleConfirmReservation = async () => {
    setShowConfirmModal(true);
  };

  const confirmReservation = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    setError(null);

    try {
      // Use Inertia's router.post for better integration
      router.post(`/checkout/${reservation.id}/confirm`, {}, {
        onSuccess: () => {
          // Success is handled by the server response
        },
        onError: (errors) => {
          setError(errors.message || 'Failed to confirm reservation. Please try again.');
          setLoading(false);
        },
        onFinish: () => {
          setLoading(false);
        }
      });
    } catch (err) {
      console.error('Error confirming reservation:', err);
      setError('An unexpected error occurred. Please check your internet connection.');
      setLoading(false);
    }
  };

  const cancelConfirmation = () => {
    setShowConfirmModal(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#f6f5c6] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-lexend font-medium text-[#3f411a] mb-6 text-center">
              Confirm Your Reservation
            </h1>

            {/* Timer */}
            {/* <div className="mb-6">
              <Timer 
                expiresAt={expiresAt} 
                onExpired={handleExpired}
                onAlmostExpired={handleAlmostExpired}
              />
            </div> */}

            {/* Reservation Details */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-3 border-b border-[#3f411a]/20">
                <span className="text-[#3f411a]/80 font-lexend font-extralight">Guest Name</span>
                <span className="text-[#3f411a] font-lexend font-medium">
                  {reservation.guest_first_name} {reservation.guest_last_name}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#3f411a]/20">
                <span className="text-[#3f411a]/80 font-lexend font-extralight">Email</span>
                <span className="text-[#3f411a] font-lexend font-medium">{reservation.guest_email}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#3f411a]/20">
                <span className="text-[#3f411a]/80 font-lexend font-extralight">Phone</span>
                <span className="text-[#3f411a] font-lexend font-medium">{reservation.guest_phone}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#3f411a]/20">
                <span className="text-[#3f411a]/80 font-lexend font-extralight">Date</span>
                <span className="text-[#3f411a] font-lexend font-medium">{formatDate(reservation.reservation_date)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#3f411a]/20">
                <span className="text-[#3f411a]/80 font-lexend font-extralight">Year</span>
                <span className="text-[#3f411a] font-lexend font-medium">{new Date(reservation.reservation_date).getFullYear()}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#3f411a]/20">
                <span className="text-[#3f411a]/80 font-lexend font-extralight">Time</span>
                <span className="text-[#3f411a] font-lexend font-medium">
                  {reservation.time_slot.start_time} - {reservation.time_slot.end_time}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[#3f411a]/80 font-lexend font-extralight">Number of Guests</span>
                <span className="text-[#3f411a] font-lexend font-medium">{reservation.guest_count}</span>
              </div>
            </div>

            {/* Confirm Reservation Button */}
            <button
              onClick={handleConfirmReservation}
              disabled={loading || disableConfirm}
              className={`w-full py-4 font-lexend font-medium text-lg transition-all duration-200 ${
                loading || disableConfirm
                  ? 'bg-[#3f411a]/30 text-[#3f411a]/50 cursor-not-allowed'
                  : 'bg-[#3f411a] text-white hover:bg-[#2a2d12] active:scale-[0.98]'
              }`}
            >
              {disableConfirm ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#3f411a]/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Reservation is about to expire. Try booking again soon.
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Confirming Reservation...
                </div>
              ) : (
                'Confirm Reservation'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-lexend font-medium text-[#3f411a] mb-2">
                Confirm Reservation
              </h3>
              <p className="text-[#3f411a]/80 font-lexend font-light mb-6">
                Is this information correct?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={cancelConfirmation}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-lexend font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReservation}
                  className="flex-1 py-2 px-4 bg-[#3f411a] text-white rounded-lg font-lexend font-medium hover:bg-[#2a2d12] transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}