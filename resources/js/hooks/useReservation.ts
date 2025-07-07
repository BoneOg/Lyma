import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

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

interface UseReservationProps {
  timeSlots: TimeSlot[];
  systemSettings: SystemSettings;
  errors?: any;
}

export const useReservation = ({ timeSlots, systemSettings, errors }: UseReservationProps) => {
  // Form state
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(
    timeSlots.length > 0 ? timeSlots[0].id : null
  );
  const [guestCount, setGuestCount] = useState(1);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('63');
  const [occupiedTimeSlots, setOccupiedTimeSlots] = useState<number[]>([]);
  const [fullyBookedDates, setFullyBookedDates] = useState<number[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  
  // State to track admin-disabled dates and time slots
  const [adminDisabledDates, setAdminDisabledDates] = useState<Set<string>>(new Set());
  const [adminDisabledTimeSlots, setAdminDisabledTimeSlots] = useState<Map<string, Set<string>>>(new Map());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [
    new Date().getFullYear(),
    new Date().getFullYear() + 1,
    new Date().getFullYear() + 2,
  ];

  // Load admin disabled dates from localStorage
  useEffect(() => {
    const savedDisabledDates = localStorage.getItem('disabledDates');
    const savedDisabledTimeSlots = localStorage.getItem('disabledTimeSlots');
    
    if (savedDisabledDates) {
      setAdminDisabledDates(new Set(JSON.parse(savedDisabledDates)));
    }
    
    if (savedDisabledTimeSlots) {
      const parsed = JSON.parse(savedDisabledTimeSlots);
      const newMap = new Map();
      Object.keys(parsed).forEach(key => {
        newMap.set(key, new Set(parsed[key]));
      });
      setAdminDisabledTimeSlots(newMap);
    }
  }, []);

  // Fetch fully booked dates when month changes
  useEffect(() => {
    fetchFullyBookedDates();
  }, [selectedMonth, selectedYear]);

  // Date calculations
  const today = new Date();
  const maxDate = new Date(today.getTime() + (systemSettings.max_advance_booking_days * 24 * 60 * 60 * 1000));

  const fetchFullyBookedDates = async () => {
    try {
      const response = await fetch(`/reservations/fully-booked-dates?month=${selectedMonth + 1}&year=${selectedYear}`);
      const data = await response.json();
      setFullyBookedDates(data.fully_booked_dates || []);
    } catch (error) {
      console.error('Error fetching fully booked dates:', error);
      setFullyBookedDates([]);
    }
  };

  const isDateDisabled = (day: number) => {
    const dateToCheck = new Date(selectedYear, selectedMonth, day);

    // Reset time to midnight for accurate date-only comparison
    dateToCheck.setHours(0, 0, 0, 0);

    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    // Check if date is in the past or beyond max booking days
    if (dateToCheck <= todayMidnight || dateToCheck > maxDate) {
      return true;
    }

    // Check if date is admin-disabled
    const monthName = months[selectedMonth];
    const dateKey = `${monthName}-${day}`;
    if (adminDisabledDates.has(dateKey)) {
      return true;
    }

    return false;
  };

  // New function to check if a date is fully booked (for red color and strikethrough)
  const isDateFullyBooked = (day: number) => {
    return fullyBookedDates.includes(day);
  };

  // Helper function to check if a time slot is admin-disabled for the selected date
  const isTimeSlotAdminDisabled = (timeSlotId: number) => {
    if (!selectedDate) return false;
    
    const monthName = months[selectedMonth];
    const dateKey = `${monthName}-${selectedDate}`;
    const disabledSlots = adminDisabledTimeSlots.get(dateKey);
    
    if (disabledSlots) {
      // Check if this specific time slot is disabled
      const timeSlot = timeSlots.find(slot => slot.id === timeSlotId);
      if (timeSlot) {
        return disabledSlots.has(timeSlot.start_time_formatted);
      }
    }
    
    return false;
  };

  const fetchOccupiedTimeSlots = async (date: string) => {
    try {
      const response = await fetch(`/reservations/occupied-time-slots?date=${date}`);
      const data = await response.json();
      setOccupiedTimeSlots(data.occupied_time_slots || []);
    } catch (error) {
      console.error('Error fetching occupied time slots:', error);
      setOccupiedTimeSlots([]);
    }
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate(day);
    const formattedDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    fetchOccupiedTimeSlots(formattedDate);
  };

  // Reset time slot if it becomes occupied
  useEffect(() => {
    if (selectedTimeSlot && occupiedTimeSlots.includes(selectedTimeSlot)) {
      const firstAvailableSlot = timeSlots.find(slot => !occupiedTimeSlots.includes(slot.id));
      setSelectedTimeSlot(firstAvailableSlot?.id || null);
    }
  }, [occupiedTimeSlots, selectedTimeSlot, timeSlots]);

  const formatSelectedDateTime = () => {
    const parts = [];
    
    // Add date if selected
    if (selectedDate) {
      const date = new Date(selectedYear, selectedMonth, selectedDate);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const monthName = months[selectedMonth];
      parts.push(`${monthName} ${selectedDate} (${dayName})`);
    }
    
    // Add time if selected
    if (selectedTimeSlot) {
      const selectedTime = timeSlots.find(slot => slot.id === selectedTimeSlot);
      if (selectedTime) {
        parts.push(selectedTime.start_time_formatted);
      }
    }
    
    // Always add guest count
    parts.push(`${guestCount} Guest${guestCount > 1 ? 's' : ''}`);
    
    // If no date or time selected, show placeholder
    if (!selectedDate && !selectedTimeSlot) {
      return 'Select date and time';
    }
    
    return parts.join(', ');
  };

  const isFormValid = () => {
    return selectedDate &&
      selectedTimeSlot &&
      !occupiedTimeSlots.includes(selectedTimeSlot) &&
      firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      phone.trim() &&
      email.includes('@') &&
      email.includes('.');
  };

  const handleBookTable = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!isFormValid()) {
      return;
    }

    setIsBooking(true);
    
    try {
      const formData = {
        guest_first_name: firstName.trim(),
        guest_last_name: lastName.trim(),
        guest_email: email.trim(),
        guest_phone: phone.trim(),
        reservation_date: `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`,
        time_slot_id: selectedTimeSlot,
        guest_count: guestCount,
      };

      router.post('/reservations', formData);
      setShowConfirmationModal(false);
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelBooking = () => {
    setShowConfirmationModal(false);
  };

  return {
    // State
    selectedMonth,
    selectedYear,
    selectedTimeSlot,
    guestCount,
    selectedDate,
    firstName,
    lastName,
    email,
    phone,
    occupiedTimeSlots,
    fullyBookedDates,
    showConfirmationModal,
    isBooking,
    months,
    years,
    
    // Setters
    setSelectedMonth,
    setSelectedYear,
    setSelectedTimeSlot,
    setGuestCount,
    setSelectedDate,
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    
    // Functions
    isDateDisabled,
    isDateFullyBooked,
    isTimeSlotAdminDisabled,
    handleDateSelect,
    formatSelectedDateTime,
    isFormValid,
    handleBookTable,
    handleConfirmBooking,
    handleCancelBooking,
    
    // Props
    timeSlots,
    errors
  };
}; 