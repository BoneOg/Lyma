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
import { Check, X } from 'lucide-react';

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
  // Extract just the date part (YYYY-MM-DD) without timezone conversion
  return dateString.split('T')[0];
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

// Update statusColors to use CSS variables
const statusColors: Record<string, string> = {
  confirmed: 'bg-[hsl(var(--primary))] text-white border-none ',
  completed: 'bg-[hsl(var(--secondary))] text-black border-none',
  cancelled: 'bg-[hsl(var(--destructive))] text-white border-none',
  all: 'bg-yellow-100 text-yellow-900 border-yellow-400',
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
    <div className="bg-white border border-primary-light h-[450px] shadow-lg p-6 flex flex-col">
      <div className="flex gap-4 mb-2">
        {/* Search with icon, short height */}
        <div className="flex items-center flex-1 gap-3 basis-[55%] h-10 border-primary-light border bg-primary-light text-olive font-lexend px-2 py-1 transition-all duration-300 hover:scale-[1.02] focus-within:ring-1 focus-within:ring-olive focus-within:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-olive mr-1 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
          <input
            type="text"
            className="flex-1 bg-transparent outline-none border-none px-0 py-0"
            placeholder="Search by guest name, email, number or details..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {/* Date with icon, short height */}
        <button
          onClick={() => setShowCalendar(true)}
          className="flex items-center basis-[15%] gap-3 h-10 border-primary-light border bg-primary-light text-olive font-lexend font-light px-2 py-1 transition-all duration-300 hover:scale-[1.09] focus:ring-1 focus:ring-olive focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-olive mr-1 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {getButtonText()}
        </button>
        {/* Sort dropdown with icon, short height */}
        <div className="flex items-center basis-[30%] gap-3 h-10 border-primary-light border bg-primary-light text-olive font-lexend font-light px-2 py-1 rounded-none transition-all duration-300 hover:scale-[1.02] focus-within:ring-1 focus-within:ring-olive outline-none focus-within:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-olive mr-1 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A2 2 0 0013 14.586V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-3.414a2 2 0 00-.586-1.414L2 6.707A1 1 0 012 6V4z" />
          </svg>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="shadcn-select-trigger flex-1 bg-transparent border-none outline-none shadow-none px-0 py-0 focus:outline-none focus:ring-0 focus:ring-transparent focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#f6f5c6] py-2 text-[#3f411a] border-[#f6f5c6]">
              {sortOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value} className="text-[#3f411a] hover:bg-[#e8e6b3] outline-none  font-lexend font-light">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-8 font-lexend font-light text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 font-lexend text-gray-500">No reservations found.</div>
      ) : (
        <div className="w-full flex-1 min-h-0 overflow-y-auto">
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
              <tr className="border-b border-gray-200 bg-white sticky top-0 z-10">
                <th className="py-3 px-5 font-medium truncate">First Name</th>
                <th className="py-3 px-2 font-medium truncate">Last Name</th>
                <th className="py-3 px-2 font-medium truncate text-center">Reservation Date</th>
                <th className="py-3 px-1 font-medium truncate text-center">Time Slot</th>
                <th className="py-3 px-1 font-medium truncate text-center">Guests</th>
                <th className="py-3 px-1 font-medium text-center truncate">Status</th>
                <th className="py-3 px-1 font-medium text-center truncate">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <React.Fragment key={r.id}>
                  <tr
                    className={`cursor-pointer hover:bg-gray-100 transition ${expanded === r.id ? 'bg-gray-100' : ''}${expanded === r.id ? '' : ' border-b border-gray-200'}`}
                    onClick={() => handleExpand(r.id)}
                  >
                    <td className="py-5 px-5 font-regular truncate align-top" style={{ wordBreak: 'break-word' }}>{r.guest_first_name}</td>
                    <td className="py-5 px-2 font-regular truncate align-top" style={{ wordBreak: 'break-word' }}>{r.guest_last_name}</td>
                    <td className="py-5 px-2 font-regular truncate align-top text-center" style={{ wordBreak: 'break-word' }}>{formatDate(r.reservation_date)}</td>
                    <td className="py-5 px-1 font-regular truncate align-top text-center" style={{ wordBreak: 'break-word' }}>{r.time_slot || '-'}</td>
                    <td className="py-5 px-1 font-regular truncate align-top text-center" style={{ wordBreak: 'break-word' }}>{r.guest_count}</td>
                    <td className="py-4 px-1 text-center align-top">
                      <span
                        className={`inline-flex items-center justify-center border text-xs font-extralight capitalize ${statusColors[r.status] || 'bg-gray-200 text-gray-700 border-gray-300'}`}
                        style={{ width: '100px', height: '32px', borderRadius: '16px', fontWeight: 300 }}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-4 px-1 text-center align-top" style={{ minWidth: '70px' }}>
                      <div style={{ minHeight: '34px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {r.status !== 'completed' && r.status !== 'cancelled' && (
                          <div className="flex gap-2 justify-center">
                            <button
                              className="group h-10 w-10 flex items-center justify-center rounded-md bg-transparent border-none hover:bg-green-100 focus-visible:bg-green-100 transition-colors"
                              title="Complete"
                              style={{ lineHeight: 0 }}
                              onClick={e => { e.stopPropagation(); handleComplete(r.id, r.guest_first_name, r.guest_last_name); }}
                            >
                              <Check className="w-8 h-8 text-green-600 group-hover:text-green-800 group-focus-visible:text-green-800 transition-colors" />
                            </button>
                            <button
                              className="group h-10 w-10 flex items-center justify-center rounded-md bg-transparent border-none hover:bg-red-100 focus-visible:bg-red-100 transition-colors"
                              title="Cancel"
                              style={{ lineHeight: 0 }}
                              onClick={e => { e.stopPropagation(); handleCancel(r.id, r.guest_first_name, r.guest_last_name); }}
                            >
                              <X className="w-8 h-8 text-red-600 group-hover:text-red-800 group-focus-visible:text-red-800 transition-colors" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expanded === r.id ? (
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <td colSpan={7} className="py-3 px-3">
                        <div className="flex flex-col gap-2 text-sm text-[#3f411a] font-light">
                          <div><b>Email:</b> {r.email}</div>
                          <div><b>Phone:</b> {r.phone}</div>
                          <div><b>Created At:</b> {formatDate(r.created_at)}</div>
                          <div><b>Updated At:</b> {formatDate(r.updated_at)}</div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              ))}
            </tbody>
          </table>
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