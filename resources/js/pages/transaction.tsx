import React from 'react';
import Layout from '@/components/layout';
import ReservationSummary from '@/components/ui/ReservationSummary';

interface Reservation {
  id: number;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  special_requests?: string;
  reservation_date: string;
  guest_count: number;
  status: string;
  time_slot?: {
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
  specialHoursData?: {
    special_start: string;
    special_end: string;
  };
}

const formatTo12Hour = (timeString?: string | null): string => {
  if (!timeString) return '';
  const upper = timeString.toUpperCase();
  if (upper.includes('AM') || upper.includes('PM')) return timeString;
  const parts = timeString.split(':');
  if (parts.length < 2) return timeString;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes.padStart(2, '0')} ${period}`;
};

const formatLongDate = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const Transaction: React.FC<TransactionProps> = ({ reservation, paymentStatus, statusMessage, specialHoursData }) => {

  if (!reservation) {
    return (
      <Layout>
        <div className="min-h-screen bg-olive relative overflow-hidden">
          <div className="relative z-10 min-h-screen flex flex-col">
            <div className="flex-grow flex items-center justify-center px-4 py-6">
              <div className="w-full max-w-4xl space-y-6 text-center">
                <h1 
                  className="text-2xl lg:text-3xl font-extralight tracking-[0.15em]"
                  style={{ color: 'hsl(var(--primary))' }}
                >
                  Reservation Not Found
                </h1>
                <p 
                  className="text-sm lg:text-base font-light tracking-wide mx-auto max-w-2xl"
                  style={{ color: 'hsl(var(--muted-foreground))' }}
                >
                  We couldn't find your reservation details. This might be due to a failed or cancelled reservation, or an error retrieving the reservation.
                </p>
                <div className="flex flex-col lg:flex-row gap-2 max-w-1xl mx-auto pt-2">
                  <a
                    href="/"
                    className="flex-1 py-4 px-6 font-light text-base transition-all duration-300 transform hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg text-center"
                    style={{ 
                      backgroundColor: 'var(--color-beige)',
                      color: 'var(--color-olive)',
                      fontFamily: 'Lexend Giga, sans-serif',
                      letterSpacing: '0.05em',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)'
                    }}
                  >
                    Return to Home
                  </a>
                  <a
                    href="/reservation"
                    className="flex-1 py-4 px-6 font-light text-base transition-all duration-300 transform hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg text-center"
                    style={{ 
                      backgroundColor: 'hsl(var(--primary))',
                      color: 'var(--color-beige)',
                      fontFamily: 'Lexend Giga, sans-serif',
                      letterSpacing: '0.05em',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)'
                    }}
                  >
                    Make Another Reservation
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-olive relative overflow-hidden">
        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="flex-grow flex items-center justify-center px-4 py-6">
            <div className="w-full max-w-4xl space-y-4">

              {/* Status Heading */}
              <div className="text-center space-y-2 mt-10">
                <h2 
                  className="text-2xl lg:text-5xl font-extralight font-lexend tracking-[0.15em]"
                  style={{ color: 'var(--color-beige)' }}
                >
                  {paymentStatus === 'success' && 'RESERVATION CONFIRMED'}
                  {paymentStatus === 'failed' && 'RESERVATION FAILED'}
                  {paymentStatus === 'cancelled' && 'RESERVATION CANCELLED'}
                </h2>
                <p
                  className="text-sm lg:text-base font-light tracking-wide mx-auto max-w-3xl"
                  style={{ color: 'hsl(var(--muted-foreground))' }}
                >
                  {statusMessage}
                </p>
                <div 
                  className="w-42 h-px mx-auto"
                  style={{ backgroundColor: 'hsl(var(--primary) / 0.3)' }}
                />
              </div>

              {/* Reservation Summary Card */}
              <div className="transform transition-all duration-300 hover:scale-[1.01] mt-4">
                <ReservationSummary
                  guestName={`${reservation.guest_first_name} ${reservation.guest_last_name}`}
                  email={reservation.guest_email}
                  phone={reservation.guest_phone}
                  specialRequests={reservation.special_requests ?? null}
                  dateLabel={formatLongDate(reservation.reservation_date)}
                  yearLabel={new Date(reservation.reservation_date).getFullYear().toString()}
                  timeLabel={specialHoursData
                    ? `${formatTo12Hour(specialHoursData.special_start)} - ${formatTo12Hour(specialHoursData.special_end)} (Special Hours)`
                    : reservation.time_slot
                      ? `${formatTo12Hour(reservation.time_slot.start_time)} - ${formatTo12Hour(reservation.time_slot.end_time)}`
                      : 'Time not specified'}
                  guestCount={reservation.guest_count}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col lg:flex-row gap-2 max-w-1xl mx-auto">
                <a
                  href="/"
                  className="flex-1 py-4 px-6 font-light text-base transition-all duration-300 transform hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg text-center"
                  style={{ 
                    backgroundColor: 'var(--color-beige)',
                    color: 'var(--color-olive)',
                    fontFamily: 'Lexend Giga, sans-serif',
                    letterSpacing: '0.05em',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)'
                  }}
                >
                  Return to Home
                </a>

                <a
                  href="/reservation"
                  className="flex-1 py-4 px-6 font-light text-base transition-all duration-300 transform hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg text-center"
                  style={{ 
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'var(--color-beige)',
                    fontFamily: 'Lexend Giga, sans-serif',
                    letterSpacing: '0.05em',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)'
                  }}
                >
                  Make Another Reservation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Transaction;
