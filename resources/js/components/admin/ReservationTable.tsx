import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import CalendarSearch from './CalendarSearch';
import ConfirmationModal from './ConfirmationModal';
import QuickReservation from './QuickReservation';
import { useNotification } from '../../contexts/NotificationContext';

interface Reservation {
  id: number;
  guest_first_name: string;
  guest_last_name: string;
  reservation_date: string;
  time_slot: string | null;
  guest_count: number;
  status: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  formatted_time: string;
  start_time_formatted: string;
}

interface SystemSettings {
  max_advance_booking_days: number;
}

interface Props {
  status: string;
  onReservationUpdate?: () => void;
  endpointPrefix?: string;
  timeSlots?: TimeSlot[];
  systemSettings?: SystemSettings;
}

function formatDate(dateString: string) {
  if (!dateString) return '';
  return dateString.slice(0, 10);
}

function normalizeDate(dateString: string) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

function compareTimeSlots(timeA: string, timeB: string): number {
  // Convert time strings to comparable values
  const parseTime = (timeStr: string): number => {
    const time = timeStr.toLowerCase();
    const [timePart, period] = time.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
    
    let hour24 = hours;
    if (period === 'pm' && hours !== 12) {
      hour24 = hours + 12;
    } else if (period === 'am' && hours === 12) {
      hour24 = 0;
    }
    
    return hour24 * 60 + minutes; // Convert to minutes for easy comparison
  };
  
  return parseTime(timeA) - parseTime(timeB);
}

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-200 text-green-900 border-green-400',
  completed: 'bg-blue-200 text-blue-900 border-blue-400',
  cancelled: 'bg-red-200 text-red-900 border-red-400',
  all: 'bg-yellow-100 text-yellow-900 border-yellow-400',
};

const actionButtonColors: Record<string, string> = {
  confirmed: 'bg-green-500 hover:bg-green-600',
  completed: 'bg-blue-500 hover:bg-blue-600',
  cancelled: 'bg-red-500 hover:bg-red-600',
  all: 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900',
};

const sortOptions = [
  { value: 'firstName-asc', label: 'First Name (A-Z)' },
  { value: 'firstName-desc', label: 'First Name (Z-A)' },
  { value: 'lastName-asc', label: 'Last Name (A-Z)' },
  { value: 'lastName-desc', label: 'Last Name (Z-A)' },
  { value: 'timeSlot-am-pm', label: 'Time Slot (Morning-Evening)' },
  { value: 'timeSlot-pm-am', label: 'Time Slot (Evening-Morning)' },
  { value: 'guest-asc', label: 'Guests (Lowest-Highest)' },
  { value: 'guest-desc', label: 'Guests (Highest-Lowest)' },
  { value: 'date-asc', label: 'Reservation Date (Earliest-Latest)' },
  { value: 'date-desc', label: 'Reservation Date (Latest-Earliest)' },
];

const months = [
  'All', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

const ReservationTable: React.FC<Props> = ({ status, onReservationUpdate, endpointPrefix, timeSlots, systemSettings }) => {
  const { showNotification } = useNotification();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date-asc');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'complete' | 'cancel';
    reservationId: number;
    reservationName: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showQuickReservation, setShowQuickReservation] = useState(false);

  // Get unique years from reservations
  const years = React.useMemo(() => {
    const y = Array.from(new Set(reservations.map(r => r.reservation_date.slice(0, 4))));
    return ['All', ...y.sort()];
  }, [reservations]);

  useEffect(() => {
    setLoading(true);
    fetch(`${endpointPrefix || '/admin'}/api/reservations?status=${status}`)
      .then(res => res.json())
      .then(data => {
        let filtered = data.reservations || [];
        if (status === 'all') {
          filtered = filtered.filter((r: Reservation) => r.status !== 'pending');
        }
        console.log('Loaded reservations:', filtered);
        setReservations(filtered);
        setLoading(false);
      });
  }, [status, endpointPrefix]);

  const handleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  // Filtering
  let filtered = reservations.filter(r => {
    const matchesSearch =
      r.guest_first_name.toLowerCase().includes(search.toLowerCase()) ||
      r.guest_last_name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.toLowerCase().includes(search.toLowerCase());
    
    let matchesDate = true;
    
    if (selectedDate) {
      // Specific date filtering
      matchesDate = normalizeDate(r.reservation_date) === selectedDate;
    } else if (selectedMonth && selectedYear) {
      // Month filtering
      const reservationDate = new Date(r.reservation_date);
      const reservationMonth = reservationDate.toLocaleString('default', { month: 'long' });
      const reservationYear = reservationDate.getFullYear();
      matchesDate = reservationMonth === selectedMonth && reservationYear === selectedYear;
    }
    
    // Debug logging
    if (selectedDate || (selectedMonth && selectedYear)) {
      console.log('Comparing dates:', {
        selectedDate,
        selectedMonth,
        selectedYear,
        reservationDate: r.reservation_date,
        normalizedReservationDate: normalizeDate(r.reservation_date),
        reservationMonth: new Date(r.reservation_date).toLocaleString('default', { month: 'long' }),
        reservationYear: new Date(r.reservation_date).getFullYear(),
        matches: matchesDate
      });
    }
    
    return matchesSearch && matchesDate;
  });

  // Sorting
  filtered = filtered.sort((a, b) => {
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

  const handleComplete = (id: number, firstName: string, lastName: string) => {
    setConfirmAction({
      type: 'complete',
      reservationId: id,
      reservationName: `${firstName} ${lastName}`
    });
    setShowConfirmModal(true);
  };

  const handleCancel = (id: number, firstName: string, lastName: string) => {
    setConfirmAction({
      type: 'cancel',
      reservationId: id,
      reservationName: `${firstName} ${lastName}`
    });
    setShowConfirmModal(true);
  };

  const executeAction = async () => {
    if (!confirmAction) return;

    setActionLoading(true);
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
        // Update the local state to reflect the change
        setReservations(prev => prev.map(r => 
          r.id === confirmAction.reservationId 
            ? { ...r, status: confirmAction.type === 'complete' ? 'completed' : 'cancelled' }
            : r
        ));
        
        // Show success notification
        showNotification(
          `Reservation ${confirmAction.type === 'complete' ? 'completed' : 'cancelled'} successfully!`,
          'success'
        );
        
        // Call the callback to update dashboard counts
        if (onReservationUpdate) {
          onReservationUpdate();
        }
      } else {
        showNotification(`Failed to ${confirmAction.type} reservation: ${data.message}`, 'error');
      }
    } catch (error) {
      console.error('Error executing action:', error);
      showNotification(`Failed to ${confirmAction.type} reservation. Please try again.`, 'error');
    } finally {
      setActionLoading(false);
      setShowConfirmModal(false);
      setConfirmAction(null);
    }
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const handleDateSelect = (date: string | null) => {
    setSelectedDate(date);
    // Clear month selection when a specific date is selected
    setSelectedMonth(null);
    setSelectedYear(null);
  };

  const handleMonthSelect = (month: string, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    // Clear specific date selection when a month is selected
    setSelectedDate(null);
  };

  const formatSelectedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
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
    <div className="bg-white rounded-4xl shadow-lg p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl text-[#3f411a] font-lexend font-bold">Reservations</h2>
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto justify-end">
        <button
            onClick={() => setShowQuickReservation(true)}
            className="rounded-xl bg-[#f6f5c6] text-[#3f411a] font-lexend border-none px-4 py-2 focus:ring-2 focus:ring-yellow-300 hover:bg-[#e8e6b3] transition-colors"
            title="Quick Reservation"
          >
            +
          </button>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-100 rounded-xl bg-[#f6f5c6] text-[#3f411a] font-lexend border-none px-4 py-2 focus:ring-2 focus:ring-yellow-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="w-100 bg-[#f6f5c6] py-2 text-[#3f411a] border-[#f6f5c6]">
              {sortOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value} className="text-[#3f411a] hover:bg-[#e8e6b3] focus:bg-[#e8e6b3] font-lexend">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <button
            onClick={() => setShowCalendar(true)}
            className="rounded-xl bg-[#f6f5c6] text-[#3f411a] font-lexend border-none px-4 py-2 focus:ring-2 focus:ring-yellow-300 hover:bg-[#e8e6b3] transition-colors"
          >
            {getButtonText()}
          </button>
          
          <input
            type="text"
            className="w-68 rounded-xl bg-[#f6f5c6] text-[#3f411a] font-lexend border-none px-4 py-2 focus:ring-2 focus:ring-yellow-300"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 font-lexend text-gray-500">No reservations found.</div>
      ) : (
        <table className="w-full text-left font-lexend">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-3 font-regular">First Name</th>
              <th className="py-3 px-6 font-regular">Last Name</th>
              <th className="py-3 px-3 font-regular">Reservation Date</th>
              <th className="py-3 px-1 text-center font-regular">Time Slot</th>
              <th className="py-3 px-3 text-center font-regular">Guests</th>
              <th className="py-3 px-3 text-center font-regular">Status</th>
              <th className="py-3 px-3 text-center font-regular">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <React.Fragment key={r.id}>
                <tr
                  className={`cursor-pointer hover:bg-yellow-50 transition ${expanded === r.id ? 'bg-yellow-50' : ''}`}
                  onClick={() => handleExpand(r.id)}
                >
                  <td className="py-6 px-3 font-light">{r.guest_first_name}</td>
                  <td className="py-6 px-6 font-light">{r.guest_last_name}</td>
                  <td className="py-6 px-3 font-light">{formatDate(r.reservation_date)}</td>
                  <td className="py-6 px-1 text-center font-light">{r.time_slot || '-'}</td>
                  <td className="py-6 px-3 text-center font-light">{r.guest_count}</td>
                  <td className="py-6 px-3 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full border text-xs font-extralight capitalize ${statusColors[r.status] || 'bg-gray-200 text-gray-700 border-gray-300'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-6 px-3 text-center">
                    {r.status !== 'completed' && r.status !== 'cancelled' && (
                      <div className="flex gap-2 justify-center">
                        <button
                          className="bg-blue-200 hover:bg-blue-300 text-blue-900 border-blue-400 border px-3 py-1 rounded text-xs font-extralight"
                          onClick={e => { e.stopPropagation(); handleComplete(r.id, r.guest_first_name, r.guest_last_name); }}
                        >
                          Complete
                        </button>
                        <button
                          className="bg-red-200 hover:bg-red-300 text-red-900 border-red-400 border px-3 py-1 rounded text-xs font-extralight"
                          onClick={e => { e.stopPropagation(); handleCancel(r.id, r.guest_first_name, r.guest_last_name); }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
                {expanded === r.id && (
                  <tr className="bg-yellow-50">
                    <td colSpan={7} className="py-3 px-3">
                      <div className="flex flex-col gap-2 text-sm text-[#3f411a] font-light">
                        <div><b>Email:</b> {r.email}</div>
                        <div><b>Phone:</b> {r.phone}</div>
                        <div><b>Created At:</b> {formatDate(r.created_at)}</div>
                        <div><b>Updated At:</b> {formatDate(r.updated_at)}</div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
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
            // Refresh the reservations list
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
            
            // Call the callback to update dashboard counts
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