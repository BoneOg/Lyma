import React, { useState } from 'react';
import { Calendar, Clock, Users, MessageSquare, Info, CheckCircle, XCircle } from 'lucide-react';
import type { Reservation } from '../../types/reservation';

interface ReservationCardProps {
  reservation: Reservation;
  onComplete: () => void;
  onCancel: () => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onComplete,
  onCancel
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showSpecialRequestsModal, setShowSpecialRequestsModal] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatTimeSlot = (timeSlot: string) => {
    // Format time slot for mobile display
    return timeSlot;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-[hsl(var(--primary))] text-white border-none';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-[hsl(var(--destructive))] text-white border-none';
      case 'completed':
        return 'bg-[hsl(var(--secondary))] text-black border-none';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-5 md:p-5 hover:shadow-md transition-shadow duration-200 h-fit">
      {/* Guest Name */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base md:text-base truncate">
          {reservation.guest_first_name} {reservation.guest_last_name}
        </h3>
        <div className="relative">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <Info size={16} className="text-gray-500" />
          </button>
          
                     {/* Info Modal */}
           {showInfo && (
             <>
               {/* Background Overlay */}
               <div 
                 className="fixed inset-0 bg-black/30 z-40"
                 onClick={() => setShowInfo(false)}
               />
               
               {/* Modal Content */}
               <div className="fixed left-1/2 top-1/2 w-80 sm:w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-6 transform -translate-x-1/2 -translate-y-1/2">
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <h3 className="text-lg font-semibold text-gray-900">Reservation Details</h3>
                     <button
                       onClick={() => setShowInfo(false)}
                       className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                     >
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                         <line x1="18" y1="6" x2="6" y2="18"></line>
                         <line x1="6" y1="6" x2="18" y2="18"></line>
                       </svg>
                     </button>
                   </div>
                   
                   <div className="space-y-3 text-sm">
                     <div className="flex items-start gap-3">
                       <span className="font-medium text-gray-700 min-w-[80px]">Email:</span>
                       <span className="text-gray-900 break-words">{reservation.email}</span>
                     </div>
                     <div className="flex items-start gap-3">
                       <span className="font-medium text-gray-700 min-w-[80px]">Phone:</span>
                       <span className="text-gray-900">{reservation.phone}</span>
                     </div>
                     <div className="flex items-start gap-3">
                       <span className="font-medium text-gray-700 min-w-[80px]">Created:</span>
                       <span className="text-gray-900">{formatDateTime(reservation.created_at)}</span>
                     </div>
                     <div className="flex items-start gap-3">
                       <span className="font-medium text-gray-700 min-w-[80px]">Updated:</span>
                       <span className="text-gray-900">{formatDateTime(reservation.updated_at)}</span>
                     </div>
                   </div>
                 </div>
               </div>
             </>
           )}
        </div>
      </div>

      {/* Special Requests Modal */}
      {showSpecialRequestsModal && (
        <>
          {/* Background Overlay */}
          <div 
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowSpecialRequestsModal(false)}
          />
          
          {/* Modal Content */}
          <div className="fixed left-1/2 top-1/2 w-80 sm:w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-6 transform -translate-x-1/2 -translate-y-1/2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Special Requests</h3>
                <button
                  onClick={() => setShowSpecialRequestsModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div className="text-sm text-gray-700 leading-relaxed">
                {reservation.special_requests}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Divider */}
      <div className="w-full h-px bg-gray-200 mb-3"></div>

      {/* Reservation Details */}
      <div className="space-y-2 sm:space-y-3 md:space-y-3">
        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={14} className="text-gray-500 flex-shrink-0" />
          <span>{formatDate(reservation.reservation_date)}</span>
        </div>

        {/* Time Slot */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={14} className="text-gray-500 flex-shrink-0" />
          <span>{formatTimeSlot(reservation.reserved_label || reservation.time_slot || '')}</span>
        </div>

        {/* Guest Count */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={14} className="text-gray-500 flex-shrink-0" />
          <span>{reservation.guest_count} {reservation.guest_count === 1 ? 'Guest' : 'Guests'}</span>
        </div>

        {/* Special Requests */}
        {reservation.special_requests && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MessageSquare size={14} className="text-gray-500 flex-shrink-0 mt-0.5" />
            <button
              onClick={() => setShowSpecialRequestsModal(true)}
              className="text-left flex-1 group relative"
              title="Click to view full message"
            >
              <span className="line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer">
                {reservation.special_requests}
              </span>
              {/* Tooltip */}
              <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Click to view full message
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Status Badge and Actions */}
      <div className="mt-4 flex items-center justify-between">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(reservation.status)}`}>
          {getStatusText(reservation.status)}
        </span>
        
        {/* Actions Menu - only show for non-completed and non-cancelled reservations */}
        {reservation.status !== 'completed' && reservation.status !== 'cancelled' && (
          <div className="flex gap-2">
            <button
              onClick={onComplete}
              className="p-2 hover:bg-green-100 rounded-full transition-colors duration-200 group"
              title="Complete Reservation"
            >
              <CheckCircle size={18} className="text-green-600 group-hover:text-green-700" />
            </button>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-red-100 rounded-full transition-colors duration-200 group"
              title="Cancel Reservation"
            >
              <XCircle size={18} className="text-red-600 group-hover:text-red-700" />
            </button>
          </div>
        )}
      </div>


    </div>
  );
};

export default ReservationCard;
