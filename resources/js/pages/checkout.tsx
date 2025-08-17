// resources/js/Pages/Checkout.tsx

import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import Layout from '@/components/layout';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ReservationSummary from '@/components/ui/ReservationSummary';

// --- Interfaces ---
interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  start_time_formatted: string;
}

interface Props {
  reservation: {
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
  };
  specialHoursData?: {
    special_start: string;
    special_end: string;
  };
  [key: string]: unknown;
}

// Helpers
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

export default function Checkout() {
  const { reservation, specialHoursData } = usePage<Props>().props;
  const [loading, setLoading] = useState(false);
  const [disableConfirm, setDisableConfirm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const dateLabel = formatLongDate(reservation.reservation_date);
  const yearLabel = new Date(reservation.reservation_date).getFullYear().toString();
  const timeLabel = specialHoursData
    ? `${formatTo12Hour(specialHoursData.special_start)} - ${formatTo12Hour(specialHoursData.special_end)} (Special Hours)`
    : reservation.time_slot
      ? `${formatTo12Hour(reservation.time_slot.start_time)} - ${formatTo12Hour(reservation.time_slot.end_time)}`
      : 'Time not specified';

  const sendConfirmationEmail = async () => {
    const name = `${reservation.guest_first_name} ${reservation.guest_last_name}`.trim();
    const payload = {
      to: reservation.guest_email,
      guest_name: name,
      phone: reservation.guest_phone || '',
      date_formatted: dateLabel,
      time_range: timeLabel,
      guest_count: reservation.guest_count,
    };

    await fetch('/api/send-reservation-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
      },
      body: JSON.stringify(payload),
    });
  };

  const confirmReservation = async () => {
    setShowConfirmModal(false);
    setLoading(true);

    try {
      router.post(`/checkout/${reservation.id}/confirm`, {}, {
        onSuccess: async () => {
          try { await sendConfirmationEmail(); } catch {}
        },
        onFinish: () => setLoading(false)
      });
    } catch {
      setLoading(false);
    }
  };

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
        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Main Content Area */}
			<div className="flex-grow flex items-center justify-center px-4 py-6">
					<div className="w-full max-w-4xl space-y-6">
						{/* Status Heading */}
						<div className="text-center space-y-3 flex flex-col items-center justify-center mt-12">
							<h2 
								className="text-xl lg:text-6xl font-thin font-lexend tracking-[0.15em] whitespace-nowrap"
								style={{ color: 'var(--color-beige)' }}
							>
								REVIEW & CONFIRM
							</h2>
							<div 
								className="w-42 h-px mx-auto"
								style={{ backgroundColor: 'hsl(var(--primary) / 0.3)' }}
							/>
						</div>

              {/* Reservation Summary Card */}
				<div className="transform transition-all duration-300 hover:scale-[1.01] ">
                <ReservationSummary
                  guestName={`${reservation.guest_first_name} ${reservation.guest_last_name}`}
                  email={reservation.guest_email}
                  phone={reservation.guest_phone}
                  specialRequests={reservation.special_requests ?? null}
                  dateLabel={dateLabel}
                  yearLabel={yearLabel}
                  timeLabel={timeLabel}
                  guestCount={reservation.guest_count}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col lg:flex-row gap-2 max-w-1xl mx-auto">
              <button
                onClick={() => window.history.back()}
                  className="flex-1 py-4 px-6 font-light text-base font-lexend transition-all duration-300 transform hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
                style={{ 
                backgroundColor: 'hsl(var(--primary)',
                color: 'var(--color-beige)',
                letterSpacing: '0.05em',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)'
                }}
              >
                BACK
                </button>

                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={loading || disableConfirm}
					className={`flex-1 py-4 px-6 font-light text-base font-lexend transition-all duration-300 transform ${
                    loading || disableConfirm
                      ? 'cursor-not-allowed opacity-50 scale-95'
                      : 'hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg'
                  }`}
					  style={{
                    backgroundColor: loading || disableConfirm ? 'var(--color-beige) / 0.3)' : 'var(--color-beige-dark)',
                    color: 'var(--color-olive)',
                    letterSpacing: '0.05em',
						boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)',
                  }}
                >
					  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
						  <div 
							className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: 'var(--color-beige)' }}
                      />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'CONFIRM'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showConfirmModal}
        title="Confirm Reservation"
        message="Is this information correct?"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={confirmReservation}
        confirmText="CONFIRM"
        cancelText="CANCEL"
      />
    </Layout>
  );
}