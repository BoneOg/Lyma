import React from 'react';
import Layout from '@/components/layout';

interface Reservation {
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
}

interface TransactionProps {
  reservation: Reservation | null;
  paymentStatus: 'success' | 'failed' | 'cancelled';
  statusMessage: string;
}

const Transaction: React.FC<TransactionProps> = ({ reservation, paymentStatus, statusMessage }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!reservation) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#3f411a] text-white flex items-center justify-center py-12 px-4">
          <div className="max-w-2xl w-full text-center">
            <div className="w-20 h-20 bg-red-500 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h1 className="text-4xl font-serif mb-4">Reservation Not Found</h1>
            <p className="text-[#f6f5c6] text-lg">
              We couldn't find your reservation details. This might be due to a failed or cancelled reservation, or an error retrieving the reservation.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#3f411a] text-white flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full">
          <div className="space-y-8">
            {/* Success/Failure/Cancel Status */}
            {paymentStatus === 'success' && (
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-500 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h1 className="text-4xl font-serif mb-4">Reservation Confirmed!</h1>
                <p className="text-[#f6f5c6] text-lg">{statusMessage}</p>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-red-500 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h1 className="text-4xl font-serif mb-4">Reservation Failed!</h1>
                <p className="text-[#f6f5c6] text-lg">{statusMessage}</p>
              </div>
            )}

            {paymentStatus === 'cancelled' && (
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-yellow-500 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h1 className="text-4xl font-serif mb-4">Reservation Cancelled!</h1>
                <p className="text-[#f6f5c6] text-lg">{statusMessage}</p>
              </div>
            )}

            {/* Reservation Details */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h2 className="text-2xl font-serif mb-6 border-b-2 border-white pb-2">Reservation Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-[#f6f5c6] font-bold">Guest Name:</span>
                    <span className="text-white ml-2">{reservation.guest_first_name} {reservation.guest_last_name}</span>
                  </div>
                  
                  <div>
                    <span className="text-[#f6f5c6] font-bold">Email:</span>
                    <span className="text-white ml-2">{reservation.guest_email}</span>
                  </div>
                  
                  <div>
                    <span className="text-[#f6f5c6] font-bold">Phone:</span>
                    <span className="text-white ml-2">{reservation.guest_phone}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-[#f6f5c6] font-bold">Date:</span>
                    <span className="text-white ml-2">{formatDate(reservation.reservation_date)}</span>
                  </div>
                  <div>
                    <span className="text-[#f6f5c6] font-bold">Year:</span>
                    <span className="text-white ml-2">{new Date(reservation.reservation_date).getFullYear()}</span>
                  </div>
                  
                  <div>
                    <span className="text-[#f6f5c6] font-bold">Time:</span>
                    <span className="text-white ml-2">{reservation.time_slot.start_time} - {reservation.time_slot.end_time}</span>
                  </div>
                  
                  <div>
                    <span className="text-[#f6f5c6] font-bold">Number of Guests:</span>
                    <span className="text-white ml-2">{reservation.guest_count}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="bg-[#f6f5c6] text-[#3f411a] px-8 py-3 rounded-lg font-lexend font-medium hover:bg-[#e8e7b8] transition-colors text-center"
              >
                Return to Home
              </a>
              
              <a
                href="/reservation"
                className="bg-transparent border-2 border-[#f6f5c6] text-[#f6f5c6] px-8 py-3 rounded-lg font-lexend font-medium hover:bg-[#f6f5c6] hover:text-[#3f411a] transition-colors text-center"
              >
                Make Another Reservation
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Transaction;
