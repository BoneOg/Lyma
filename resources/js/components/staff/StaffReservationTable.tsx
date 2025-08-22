import React, { useEffect, useState, useMemo, useCallback } from 'react';
import CalendarSearch from './StaffCalendarSearch';
import ConfirmationModal from './StaffConfirmationModal';
import QuickReservation from './StaffQuickReservation';
import { useNotification } from '../../contexts/NotificationContext';
import {normalizeDate, compareTimeSlots } from '../../lib/utils';
import SearchInput from '../ui/SearchInput';
import DateButton from '../ui/DateButton';
import SortDropdown from '../ui/SortDropdown';
import ReservationCard from '../ui/ReservationCard';
import { TooltipProvider } from '../ui/tooltip';
import type { Reservation, TimeSlot, SystemSettings } from '../../types/reservation';
import { sortOptions } from '../../constants/reservationTable';
import { Plus } from 'lucide-react';

interface Props {
  status: string;
  onReservationUpdate?: () => void;
  endpointPrefix?: string;
  timeSlots?: TimeSlot[];
  systemSettings?: SystemSettings;
}

const ReservationTable: React.FC<Props> = ({ status, onReservationUpdate, endpointPrefix, timeSlots, systemSettings }) => {
  const { showNotification } = useNotification();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date-asc');
  const [selectedDate, setSelectedDate] = useState<string | null>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'complete' | 'cancel';
    reservationId: number;
    reservationName: string;
  } | null>(null);
  const [showQuickReservation, setShowQuickReservation] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${endpointPrefix || '/staff'}/api/reservations?status=${status}`)
      .then(res => res.json())
      .then(data => {
        let filtered = data.reservations || [];
        if (status === 'all') {
          filtered = filtered.filter((r: Reservation) => r.status !== 'pending');
        }
        setReservations(filtered);
        setLoading(false);
      });
  }, [status, endpointPrefix]);

  const handleExpand = useCallback((id: number) => {
    setExpanded(expanded === id ? null : id);
  }, [expanded]);

  const filtered = useMemo(() => {
    return reservations.filter(r => {
      const matchesSearch =
        r.guest_first_name.toLowerCase().includes(search.toLowerCase()) ||
        r.guest_last_name.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        r.phone.toLowerCase().includes(search.toLowerCase());
      let matchesDate = true;
      if (selectedDate) {
        matchesDate = normalizeDate(r.reservation_date) === selectedDate;
      } else if (selectedMonth && selectedYear) {
        const reservationDate = new Date(r.reservation_date);
        const reservationMonth = reservationDate.toLocaleString('default', { month: 'long' });
        const reservationYear = reservationDate.getFullYear();
        matchesDate = reservationMonth === selectedMonth && reservationYear === selectedYear;
      }
      return matchesSearch && matchesDate;
    });
  }, [reservations, search, selectedDate, selectedMonth, selectedYear]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'firstName-asc':
          return a.guest_first_name.localeCompare(b.guest_first_name);
        case 'firstName-desc':
          return b.guest_first_name.localeCompare(a.guest_first_name);
        case 'lastName-asc':
          return a.guest_last_name.localeCompare(b.guest_last_name);
        case 'lastName-desc':
          return b.guest_last_name.localeCompare(a.guest_last_name);
        case 'timeSlot-am-pm':
          return compareTimeSlots(a.time_slot || '', b.time_slot || '');
        case 'timeSlot-pm-am':
          return compareTimeSlots(b.time_slot || '', a.time_slot || '');
        case 'guest-asc':
          return a.guest_count - b.guest_count;
        case 'guest-desc':
          return b.guest_count - a.guest_count;
        case 'date-asc':
          return a.reservation_date.localeCompare(b.reservation_date);
        case 'date-desc':
          return b.reservation_date.localeCompare(a.reservation_date);
        default:
          return 0;
      }
    });
  }, [filtered, sort]);

  const handleComplete = useCallback((id: number, firstName: string, lastName: string) => {
    setConfirmAction({
      type: 'complete',
      reservationId: id,
      reservationName: `${firstName} ${lastName}`
    });
    setShowConfirmModal(true);
  }, []);

  const handleCancel = useCallback((id: number, firstName: string, lastName: string) => {
    setConfirmAction({
      type: 'cancel',
      reservationId: id,
      reservationName: `${firstName} ${lastName}`
    });
    setShowConfirmModal(true);
  }, []);

  const executeAction = useCallback(async () => {
    if (!confirmAction) return;
    try {
      const endpoint = confirmAction.type === 'complete'
        ? `${endpointPrefix || '/staff'}/api/reservations/${confirmAction.reservationId}/complete`
        : `${endpointPrefix || '/staff'}/api/reservations/${confirmAction.reservationId}/cancel`;
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      const data = await response.json();
      if (data.success) {
        setReservations(prev => prev.map(r =>
          r.id === confirmAction.reservationId
            ? { ...r, status: confirmAction.type === 'complete' ? 'completed' : 'cancelled' }
            : r
        ));
        showNotification(
          `Reservation ${confirmAction.type === 'complete' ? 'completed' : 'cancelled'} successfully!`,
          'success'
        );
        if (onReservationUpdate) {
          onReservationUpdate();
        }
      } else {
        showNotification(`Failed to ${confirmAction.type} reservation: ${data.message}`, 'error');
      }
    } catch {
      showNotification(`Failed to ${confirmAction.type} reservation. Please try again.`, 'error');
    } finally {
      setShowConfirmModal(false);
      setConfirmAction(null);
    }
  }, [confirmAction, endpointPrefix, onReservationUpdate, showNotification]);

  const closeConfirmModal = useCallback(() => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  }, []);

  const handleDateSelect = useCallback((date: string | null) => {
    setSelectedDate(date);
    setSelectedMonth(null);
    setSelectedYear(null);
  }, []);

  const handleMonthSelect = useCallback((month: string, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setSelectedDate(null);
  }, []);

  const formatSelectedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getButtonText = () => {
    if (selectedDate) {
      return formatSelectedDate(selectedDate);
    } else if (selectedMonth && selectedYear) {
      return `${selectedMonth} ${selectedYear}`;
    }
    return 'Date';
  };

	return (
		<div className="bg-white border border-primary-light h-auto min-h-[520px] shadow p-3 sm:p-4 md:p-5 lg:p-6 xl:p-6 2xl:p-6 flex flex-col">
      <div className="space-y-3 mb-4">
        {/* Row 1: Search - Full width */}
        <div className="w-full">
          <SearchInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by guest name, email, or number..."
            className="w-full"
          />
        </div>
        
        {/* Row 2: Date, Sort, and New Reservation - Custom width layout */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3">
          {/* Date with icon - Least space (2 columns) */}
          <div className="sm:col-span-3">
            <DateButton
              onClick={() => setShowCalendar(true)}
              label={getButtonText()}
              className="w-full"
            />
          </div>
          {/* Sort dropdown - Most space (6 columns) */}
          <div className="sm:col-span-6">
            <SortDropdown
              value={sort}
              onChange={setSort}
              options={sortOptions}
              className="w-full"
            />
          </div>
          {/* New Reservation button - Second most space (4 columns) */}
          <div className="sm:col-span-3">
            <button
              onClick={() => setShowQuickReservation(true)}
              className="w-full flex items-center justify-center gap-2 h-10 border-primary-light border bg-primary-light text-olive font-lexend font-light px-3 py-2 transition-all duration-300 hover:scale-[1.02] focus:ring-1 focus:ring-olive focus:outline-none text-xs sm:text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-sm"
            >
              <Plus size={16} className="w-4 h-4" /> 
              <span className="hidden sm:hidden md:inline lg:inline xl:inline 2xl:inline">New Reservation</span>
              <span className="md:hidden lg:hidden xl:hidden 2xl:hidden">New</span>
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-8 font-lexend font-light text-gray-500">Loading...</div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-8 font-lexend text-gray-500">No reservations found.</div>
      ) : (
        <div className="w-full flex-1 min-h-0 overflow-visible">
          {/* Card Layout for all screen sizes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-4 lg:gap-4 xl:gap-4 2xl:gap-4 pb-4">
            {sorted.map((r) => (
              <ReservationCard
                key={r.id}
                reservation={r}
                onComplete={() => handleComplete(r.id, r.guest_first_name, r.guest_last_name)}
                onCancel={() => handleCancel(r.id, r.guest_first_name, r.guest_last_name)}
              />
            ))}
          </div>
        </div>
      )}
      <CalendarSearch
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        onDateSelect={handleDateSelect}
        onMonthSelect={handleMonthSelect}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={closeConfirmModal}
        onConfirm={executeAction}
        action={confirmAction?.type || 'complete'}
        reservationName={confirmAction?.reservationName || ''}
      />
      {timeSlots && systemSettings && (
        <QuickReservation
          isOpen={showQuickReservation}
          onClose={() => setShowQuickReservation(false)}
          onReservationCreated={() => {
            setLoading(true);
            fetch(`${endpointPrefix || '/staff'}/api/reservations?status=${status}`)
              .then(res => res.json())
              .then(data => {
                let filtered = data.reservations || [];
                if (status === 'all') {
                  filtered = filtered.filter((r: Reservation) => r.status !== 'pending');
                }
                setReservations(filtered);
                setLoading(false);
              });
          }}
          timeSlots={timeSlots}
          systemSettings={systemSettings}
        />
      )}
    </div>
  );
};

export default ReservationTable; 