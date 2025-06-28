import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/layout';
import ReservationTable from '@/components/admin/ReservationTable';

// Define allowed statuses
const cardStatuses = ['confirmed', 'completed', 'cancelled', 'all'] as const;
type CardStatus = typeof cardStatuses[number];

const cardData: { label: string; color: string; activeColor: string; status: CardStatus }[] = [
  { 
    label: 'Confirmed Reservation', 
    color: 'bg-green-200 hover:bg-green-300 text-green-900 border-green-400', 
    activeColor: 'bg-green-300 text-green-900 border-green-500 ring-4 ring-green-300',
    status: 'confirmed' 
  },
  { 
    label: 'Completed Reservation', 
    color: 'bg-blue-200 hover:bg-blue-300 text-blue-900 border-blue-400', 
    activeColor: 'bg-blue-300 text-blue-900 border-blue-500 ring-4 ring-blue-300',
    status: 'completed' 
  },
  { 
    label: 'Cancelled Reservation', 
    color: 'bg-red-200 hover:bg-red-300 text-red-900 border-red-400', 
    activeColor: 'bg-red-300 text-red-900 border-red-500 ring-4 ring-red-300',
    status: 'cancelled' 
  },
  { 
    label: 'All Reservation', 
    color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border-yellow-400', 
    activeColor: 'bg-yellow-200 text-yellow-900 border-yellow-500 ring-4 ring-yellow-300',
    status: 'all' 
  },
];

const Booking: React.FC = () => {
  const [counts, setCounts] = useState<Record<CardStatus, number>>({
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    all: 0,
  });
  const [activeStatus, setActiveStatus] = useState<CardStatus>('all');

  const fetchCounts = () => {
    fetch('/admin/api/reservation-counts')
      .then(res => res.json())
      .then(data => {
        setCounts({
          confirmed: data.confirmed || 0,
          completed: data.completed || 0,
          cancelled: data.cancelled || 0,
          all: data.all || 0,
        });
      })
      .catch(error => {
        console.error('Error fetching counts:', error);
      });
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleReservationUpdate = () => {
    // Refresh the counts when a reservation is updated
    fetchCounts();
  };

  return (
    <AdminLayout>
      <p className="text-olive text-4xl font-bold px-12 py-10 font-lexend">BOOKING</p>
      {/* Horizontal clickable cards */}
      <div className="px-12 flex gap-6 mb-8">
        {cardData.map((card) => (
          <button
            key={card.label}
            className={`flex-1 rounded-2xl shadow border-2 p-8 font-lexend font-light text-xl transition-all duration-200 cursor-pointer ${
              activeStatus === card.status ? card.activeColor : card.color
            }`}
            onClick={() => setActiveStatus(card.status)}
          >
            <div className="flex flex-col items-center justify-center">
              <span>{card.label}</span>
              <span className="mt-4 text-4xl font-bold tracking-wide">{counts[card.status]}</span>
            </div>
          </button>
        ))}
      </div>
      {/* Bottom row - Full width container */}
      <div className="px-12">
        <ReservationTable status={activeStatus} onReservationUpdate={handleReservationUpdate} />
      </div>
    </AdminLayout>
  );
};

export default Booking; 