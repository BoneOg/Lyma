import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import CalendarSearch from '../admin/CalendarSearch';
import ConfirmationModal from '../admin/ConfirmationModal';
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

interface Props {
  status: string;
  onReservationUpdate?: () => void;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function normalizeDate(dateString: string) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

const ReservationTable: React.FC<Props> = ({ status, onReservationUpdate }) => {
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

  // Get unique years from reservations
  const years = React.useMemo(() => {
    const y = Array.from(new Set(reservations.map(r => r.reservation_date.slice(0, 4))));
    return ['All', ...y.sort()];
  }, [reservations]);

  useEffect(() => {
    setLoading(true);
    fetch(`/staff/api/reservations?status=${status}`)
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
  }, [status]);

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
        return (a.time_slot || '').localeCompare(b.time_slot || '');
      case 'timeSlot-pm-am':
        return (b.time_slot || '').localeCompare(a.time_slot || '');
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
        ? `/staff/api/reservations/${confirmAction.reservationId}/complete`
        : `/staff/api/reservations/${confirmAction.reservationId}/cancel`;

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
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getButtonText = () => {
    if (actionLoading) {
      return confirmAction?.type === 'complete' ? 'Completing...' : 'Cancelling...';
    }
    return confirmAction?.type === 'complete' ? 'Complete' : 'Cancel';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-lexend">Reservations</h2>
            <p className="text-gray-600 mt-1 font-lexend">Manage and view all reservations</p>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search reservations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent w-full sm:w-64 font-lexend"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Sort */}
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full sm:w-48 font-lexend">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
                <SelectItem value="date-desc">Date (Newest First)</SelectItem>
                <SelectItem value="firstName-asc">First Name (A-Z)</SelectItem>
                <SelectItem value="firstName-desc">First Name (Z-A)</SelectItem>
                <SelectItem value="lastName-asc">Last Name (A-Z)</SelectItem>
                <SelectItem value="lastName-desc">Last Name (Z-A)</SelectItem>
                <SelectItem value="timeSlot-am-pm">Time (AM-PM)</SelectItem>
                <SelectItem value="timeSlot-pm-am">Time (PM-AM)</SelectItem>
                <SelectItem value="guest-asc">Guests (Low-High)</SelectItem>
                <SelectItem value="guest-desc">Guests (High-Low)</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <button
              onClick={() => setShowCalendar(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-lexend"
            >
              {selectedDate ? formatSelectedDate(selectedDate) : 
               selectedMonth && selectedYear ? `${selectedMonth} ${selectedYear}` : 
               'Filter by Date'}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-lexend">Guest</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-lexend">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-lexend">Guests</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-lexend">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-lexend">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((reservation) => (
              <React.Fragment key={reservation.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 font-lexend">
                          {reservation.guest_first_name} {reservation.guest_last_name}
                        </div>
                        <div className="text-sm text-gray-500 font-lexend">{reservation.email}</div>
                        <div className="text-sm text-gray-500 font-lexend">{reservation.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-lexend">{formatDate(reservation.reservation_date)}</div>
                    <div className="text-sm text-gray-500 font-lexend">{reservation.time_slot}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-lexend">
                    {reservation.guest_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border font-lexend ${getStatusColor(reservation.status)}`}>
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleExpand(reservation.id)}
                        className="text-olive hover:text-olive-dark font-lexend"
                      >
                        {expanded === reservation.id ? 'Hide' : 'View'}
                      </button>
                      {reservation.status === 'confirmed' && (
                        <>
                          <button
                            onClick={() => handleComplete(reservation.id, reservation.guest_first_name, reservation.guest_last_name)}
                            className="text-green-600 hover:text-green-900 font-lexend"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleCancel(reservation.id, reservation.guest_first_name, reservation.guest_last_name)}
                            className="text-red-600 hover:text-red-900 font-lexend"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                {expanded === reservation.id && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-lexend">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Reservation Details</h4>
                          <p><span className="font-medium">Created:</span> {formatDate(reservation.created_at)}</p>
                          <p><span className="font-medium">Updated:</span> {formatDate(reservation.updated_at)}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                          <p><span className="font-medium">Email:</span> {reservation.email}</p>
                          <p><span className="font-medium">Phone:</span> {reservation.phone}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && !loading && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 font-lexend">No reservations found</h3>
          <p className="mt-1 text-sm text-gray-500 font-lexend">
            {search || selectedDate || (selectedMonth && selectedYear) 
              ? 'Try adjusting your search or filter criteria.' 
              : 'No reservations match the current status filter.'}
          </p>
        </div>
      )}

      {/* Calendar Search Modal */}
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
    </div>
  );
};

export default ReservationTable; 