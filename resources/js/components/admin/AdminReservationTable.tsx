import React, { useEffect, useState, useMemo, useCallback } from 'react';
import CalendarSearch from './AdminCalendarSearch';
import ConfirmationModal from './AdminConfirmationModal';
import QuickReservation from './AdminQuickReservation';
import { useNotification } from '../../contexts/NotificationContext';
import {normalizeDate, compareTimeSlots } from '../../lib/utils';
import SearchInput from '../ui/SearchInput';
import DateButton from '../ui/DateButton';
import SortDropdown from '../ui/SortDropdown';
import ReservationTableRow from '../ui/ReservationTableRow';
import { TooltipProvider } from '../ui/tooltip';
import type { Reservation, TimeSlot, SystemSettings } from '../../types/reservation';
import { sortOptions } from '../../constants/reservationTable';

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
    fetch(`${endpointPrefix || '/admin'}/api/reservations?status=${status}`)
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
        ? `${endpointPrefix || '/admin'}/api/reservations/${confirmAction.reservationId}/complete`
        : `${endpointPrefix || '/admin'}/api/reservations/${confirmAction.reservationId}/cancel`;
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
    <div className="bg-white border border-primary-light h-[450px] shadow p-6 flex flex-col">
      <div className="flex gap-4 mb-2">
        {/* Search with icon, short height */}
        <SearchInput
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by guest name, email, number or details..."
          className="flex-1 basis-[55%]"
        />
        {/* Date with icon, short height */}
        <DateButton
          onClick={() => setShowCalendar(true)}
          label={getButtonText()}
          className="basis-[15%]"
        />
        {/* Sort dropdown with icon, short height */}
        <SortDropdown
          value={sort}
          onChange={setSort}
          options={sortOptions}
          className="basis-[30%]"
        />
      </div>
      {loading ? (
        <div className="text-center py-8 font-lexend font-light text-gray-500">Loading...</div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-8 font-lexend text-gray-500">No reservations found.</div>
      ) : (
        <div className="w-full flex-1 min-h-0 overflow-y-auto">
          <TooltipProvider>
            <table className="w-full text-left font-lexend table-fixed">
              <colgroup>
                <col style={{ width: '170px' }} />
                <col style={{ width: '90px' }} />
                <col style={{ width: '105px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '70px' }} />
                <col style={{ width: '95px' }} />
                <col style={{ width: '95px' }} />
              </colgroup>
              <thead>
                <tr className="border-b border-gray-200 bg-white sticky top-0 z-0">
                  <th className="py-3 px-5 font-semibold tracking-tighter truncate">First Name</th>
                  <th className="py-3 px-2 font-semibold tracking-tighter truncate">Last Name</th>
                  <th className="py-3 px-2 font-semibold tracking-tighter truncate text-center">Reservation Date</th>
                  <th className="py-3 px-1 font-semibold tracking-tighter truncate text-center">Time Slot</th>
                  <th className="py-3 px-1 font-semibold tracking-tighter truncate text-center">Guests</th>
                  <th className="py-3 px-1 font-semibold tracking-tighter text-center truncate">Status</th>
                  <th className="py-3 px-1 font-semibold tracking-tighter text-center truncate">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r) => (
                  <ReservationTableRow
                    key={r.id}
                    reservation={r}
                    expanded={expanded === r.id}
                    onExpand={() => handleExpand(r.id)}
                    onComplete={() => handleComplete(r.id, r.guest_first_name, r.guest_last_name)}
                    onCancel={() => handleCancel(r.id, r.guest_first_name, r.guest_last_name)}
                  />
                ))}
              </tbody>
            </table>
          </TooltipProvider>
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
        title={confirmAction?.type === 'complete' ? 'Complete Reservation' : 'Cancel Reservation'}
        message={`Are you sure you want to ${confirmAction?.type} the reservation for ${confirmAction?.reservationName}?`}
        type={confirmAction?.type || 'complete'}
      />
      {timeSlots && systemSettings && (
        <QuickReservation
          isOpen={showQuickReservation}
          onClose={() => setShowQuickReservation(false)}
          onReservationCreated={() => {
            setLoading(true);
            fetch(`${endpointPrefix || '/admin'}/api/reservations?status=${status}`)
              .then(res => res.json())
              .then(data => {
                let filtered = data.reservations || [];
                if (status === 'all') {
                  filtered = filtered.filter((r: Reservation) => r.status !== 'pending');
                }
                setReservations(filtered);
                setLoading(false);
              });
            if (onReservationUpdate) {
              onReservationUpdate();
            }
          }}
          timeSlots={timeSlots}
          systemSettings={systemSettings}
        />
      )}
    </div>
  );
};

export default ReservationTable; 