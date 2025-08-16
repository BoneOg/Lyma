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
        {/* Balanced minimalist background - visible yet subtle */}
        <div className="pointer-events-none select-none absolute inset-0 z-0" aria-hidden="true">
          {/* Primary focal element - Carabao (left side, main anchor) */}
          <img
            src="/assets/images/carabao_beige.webp"
            alt=""
            className="absolute top-1/2 -translate-y-1/2 left-6 lg:left-12 w-32 lg:w-52 rotate-[-10deg]"
            style={{ opacity: 0.08 }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />

          {/* Secondary accent - Fish (upper right) */}
          <img
            src="/assets/images/fish_beige.webp"
            alt=""
            className="absolute top-[35%] right-4 lg:right-8 w-26 lg:w-64 rotate-[5deg] translate-x-32"
            style={{ opacity: 0.07 }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />

          {/* Ground element - Grapes (bottom left) */}
          <img
            src="/assets/images/grapes_beige.webp"
            alt=""
            className="absolute -bottom-10 left-2 lg:left-6 w-22 lg:w-36 rotate-[-1deg] -translate-x-4"
            style={{ opacity: 0.06 }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />

          {/* Delicate accents - strategically placed */}
          <img
            src="/assets/images/shell_beige.webp"
            alt=""
            className="hidden lg:block absolute top-12 left-[28%] w-14 rotate-[6deg]"
            style={{ opacity: 0.05 }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />

          <img
            src="/assets/images/lime_beige.webp"
            alt=""
            className="hidden md:block absolute bottom-[15%] right- lg:right-75 w-12 lg:w-24 rotate-[10deg]"
            style={{ opacity: 0.07 }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />

          {/* Complementary elements - spaced for balance */}
          <img
            src="/assets/images/jar_beige.webp"
            alt=""
            className="hidden lg:block absolute top-[8%] right-[20%] w-14 xl:w-18 rotate-[-5deg]"
            style={{ opacity: 0.045 }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />

          <img
            src="/assets/images/bamboo_beige.webp"
            alt=""
            className="hidden xl:block absolute right-[25%] top-99 translate-x-12 w-22 rotate-[2deg]"
            style={{ opacity: 0.045 }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />

          <img
            src="/assets/images/coconut_beige.webp"
            alt=""
            className="hidden lg:block absolute bottom-[2%] right-[40%] w-14 lg:w-18 rotate-[3deg]"
            style={{ opacity: 0.04 }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />

          {/* Whisper elements - filling gaps without crowding */}
          <img
            src="/assets/images/scallop_beige.webp"
            alt=""
            className="hidden md:block absolute bottom-[25%] left-[15%] w-11 lg:w-20 rotate-[-7deg]"
            style={{ opacity: 0.035 }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />

          <img
            src="/assets/images/leaf_beige.webp"
            alt=""
            className="hidden xl:block absolute top-20 right-[40%] w-18 -rotate-2"
            style={{ opacity: 0.035 }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />

          <img
            src="/assets/images/sugarcane_beige.webp"
            alt=""
            className="hidden md:block absolute top-40 left-0 w-14 lg:w-26 -rotate-5 translate-x-50"
            style={{ opacity: 0.04 }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />

          {/* Brand watermark - subtle but visible */}
          <img
            src="/assets/logo/lymaonly_beige.webp"
            alt=""
            className="absolute bottom-0 right-0 w-36 lg:w-52 rotate-[-6deg] translate-x-3 translate-y-3"
            style={{ opacity: 0.035 }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="flex-grow flex items-center justify-center px-4 py-6">
            <div className="w-full max-w-4xl space-y-4">

              {/* Status Heading */}
              <div className="text-center space-y-3 flex flex-col items-center justify-center">
                <h2 
                  className="text-2xl lg:text-6xl font-thin font-lexend tracking-[0.15em] whitespace-nowrap"
                  style={{ color: 'var(--color-beige)' }}
                >
                  {paymentStatus === 'success' && 'RESERVATION CONFIRMED'}
                  {paymentStatus === 'failed' && 'RESERVATION FAILED'}
                  {paymentStatus === 'cancelled' && 'RESERVATION CANCELLED'}
                </h2>
                {/* Removed status message below heading as requested */}
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
                  headerSubtitle="Your table reservation is confirmed. A confirmation email with your reservation details has been sent to you."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col lg:flex-row gap-2 max-w-1xl mx-auto">
                <a
                  href="/"
                  className="flex-1 py-4 px-6 font-light text-base transition-all duration-300 transform hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg text-center"
                  style={{ 
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'var(--color-beige)',
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
                    backgroundColor: 'var(--color-beige-dark)',
                    color: 'var(--color-olive)',
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
