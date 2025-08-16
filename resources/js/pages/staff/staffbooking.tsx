import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import StaffLayout from '@/components/staff/StaffLayout';
import ReservationTable from '@/components/staff/StaffReservationTable';
import QuickReservation from '@/components/staff/StaffQuickReservation';

interface Props {
  timeSlots: any[];
  systemSettings: any;
  [key: string]: any;
}

const cardStatuses = ['confirmed', 'completed', 'cancelled', 'all'] as const;
type CardStatus = typeof cardStatuses[number];

const cardData: { label: string; color: string; activeColor: string; status: CardStatus }[] = [
  { 
    label: 'CONFIRMED\nRESERVATION', 
    color: 'border-primary-light bg-primary-light text-primary',
    activeColor: 'border-olive bg-olive text-white ring-2 ring-primary ring-offset-2',
    status: 'confirmed' 
  },
  { 
    label: 'COMPLETED\nRESERVATION', 
    color: 'border-primary-light bg-primary-light text-primary',
    activeColor: 'border-olive bg-olive text-white ring-2 ring-primary ring-offset-2',
    status: 'completed' 
  },
  { 
    label: 'CANCELLED\nRESERVATION', 
    color: 'border-primary-light bg-primary-light text-primary',
    activeColor: 'border-olive bg-olive text-white ring-2 ring-primary ring-offset-2',
    status: 'cancelled' 
  },
  { 
    label: 'ALL\nRESERVATION', 
    color: 'border-primary-light bg-primary-light text-primary',
    activeColor: 'border-olive bg-olive text-white ring-2 ring-primary ring-offset-2',
    status: 'all' 
  },
];

const StaffBooking: React.FC = () => {
  const { timeSlots, systemSettings } = usePage<Props>().props;
  const [counts, setCounts] = useState<Record<CardStatus, number>>({
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    all: 0,
  });
  const [activeStatus, setActiveStatus] = useState<CardStatus>('all');
  const [showQuickReservation, setShowQuickReservation] = useState(false);

  const fetchCounts = () => {
    fetch('/staff/api/reservation-counts')
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
    fetchCounts();
  };

  return (
    <StaffLayout>
      <div className="flex flex-col items-center px-12 py-10">
        <p className="text-olive text-7xl font-thin font-lexend text-center">BOOKING</p>
        <div className="w-50 h-[1px] bg-olive mt-6" style={{ opacity: 0.5 }} />
      </div>
      {/* Horizontal clickable cards */}
      <div className="px-12 flex gap-6 mb-8">
        {cardData.map((card, idx) => (
          <button
            key={card.label}
            className={`flex-1 border-2 p-8 font-lexend font-light text-xl transition-all duration-300 cursor-pointer shadow-card hover:scale-[1.03] ${
              activeStatus === card.status
                ? card.activeColor
                : card.color
            }`}
            onClick={() => setActiveStatus(card.status)}
          >
            <div className="flex flex-col items-center justify-center">
              <span>{card.label.split('\n').map((line, i) => (<React.Fragment key={i}>{line}<br /></React.Fragment>))}</span>
              <span className="mt-4 text-4xl font-bold tracking-wide">{counts[card.status]}</span>
            </div>
          </button>
        ))}
      </div>
      {/* Bottom row - Full width container */}
      <div className="px-12">
        <div className="mb-6"></div>
        <ReservationTable 
          status={activeStatus} 
          onReservationUpdate={handleReservationUpdate}
          endpointPrefix="/staff"
          timeSlots={timeSlots}
          systemSettings={systemSettings}
        />
      </div>
    </StaffLayout>
  );
};

export default StaffBooking; 