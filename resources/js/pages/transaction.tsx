import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/components/layout';

// Define the shape of the Reservation object
interface TimeSlot {
    id: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
    start_time_formatted?: string;
    end_time_formatted?: string;
}

interface Reservation {
    id: number;
    guest_first_name: string;
    guest_last_name: string;
    guest_email: string;
    guest_phone: string;
    reservation_date: string;
    time_slot_id: number;
    guest_count: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    created_at: string;
    updated_at: string;
    time_slot: TimeSlot; // Relationship loaded
}

// Define the props for the Transaction component
interface TransactionProps {
    reservation: Reservation | null; // Can be null on failure/cancel
    paymentStatus: 'success' | 'failed' | 'cancelled';
    statusMessage: string;
    reservationFee: number; // Assuming this is the fixed fee for now
}

const Transaction: React.FC<TransactionProps> = ({ reservation, paymentStatus, statusMessage, reservationFee }) => {
    // Helper to format time (e.g., "18:00:00" to "06:00 PM")
    const formatTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

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
                                <h1 className="text-4xl font-serif mb-4">Payment Successful!</h1>
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
                                <h1 className="text-4xl font-serif mb-4">Payment Failed!</h1>
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
                                <h1 className="text-4xl font-serif mb-4">Payment Cancelled!</h1>
                                <p className="text-[#f6f5c6] text-lg">{statusMessage}</p>
                            </div>
                        )}

                        {reservation ? (
                            <>
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
                                            <span className="text-[#f6f5c6] font-medium">Reservation ID:</span>
                                            <span className="text-white">#{reservation.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#f6f5c6] font-medium">Date:</span>
                                            <span className="text-white">{formatDate(reservation.reservation_date)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#f6f5c6] font-medium">Time:</span>
                                            <span className="text-white">
                                                {reservation.time_slot?.start_time_formatted || 
                                                 (reservation.time_slot?.start_time ? formatTime(reservation.time_slot.start_time) : 'Time not available')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#f6f5c6] font-medium">Guests:</span>
                                            <span className="text-white">{reservation.guest_count} {reservation.guest_count === 1 ? 'Guest' : 'Guests'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#f6f5c6] font-medium">Status:</span>
                                            <span className={`font-semibold ${
                                                reservation.status === 'confirmed' ? 'text-green-400' :
                                                reservation.status === 'pending' ? 'text-yellow-400' :
                                                'text-red-400'
                                            }`}>{reservation.status.toUpperCase()}</span>
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
                            </>
                        ) : (
                            <div className="border-2 border-white p-6 text-center">
                                <p className="text-lg text-[#f6f5c6]">No reservation details available, possibly due to a failed or cancelled payment, or an error retrieving the reservation.</p>
                                <p className="text-md mt-2 text-white">Please check your email for any confirmation or contact support if you believe this is an error.</p>
                            </div>
                        )}

                        {/* Go to Home Button */}
                        <Link
                            href="/"
                            className="block w-full py-4 font-medium text-lg bg-white text-[#3f411a] hover:bg-[#f6f5c6] transition-all duration-200 text-center"
                        >
                            Go to Home
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Transaction;
