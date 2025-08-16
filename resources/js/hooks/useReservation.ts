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
  min_guest_size?: number;
  max_guest_size?: number;
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
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | string | null>(
    timeSlots.length > 0 ? timeSlots[0].id : null
  );
  const [guestCount, setGuestCount] = useState(systemSettings.min_guest_size || 1);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [occupiedTimeSlots, setOccupiedTimeSlots] = useState<number[]>([]);
  const [disabledTimeSlots, setDisabledTimeSlots] = useState<number[]>([]);
  const [fullyBookedDates, setFullyBookedDates] = useState<number[]>([]);
  const [closedDates, setClosedDates] = useState<number[]>([]);
  const [specialHoursData, setSpecialHoursData] = useState<{[key: number]: {special_start: string, special_end: string}}>({});
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

  // Fetch fully booked dates, closed dates, and special hours dates when month changes
  useEffect(() => {
    fetchFullyBookedDates();
    fetchClosedDates();
    fetchSpecialHoursDates();
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

  const fetchClosedDates = async () => {
    try {
      const response = await fetch(`/reservations/closed-dates?month=${selectedMonth + 1}&year=${selectedYear}`);
      const data = await response.json();
      setClosedDates(data.closed_dates || []);
    } catch (error) {
      console.error('Error fetching closed dates:', error);
      setClosedDates([]);
    }
  };

  const fetchSpecialHoursDates = async () => {
    try {
      const response = await fetch(`/reservations/special-hours-dates?month=${selectedMonth + 1}&year=${selectedYear}`);
      const data = await response.json();
      const specialHoursMap: {[key: number]: {special_start: string, special_end: string}} = {};
      
      if (data.special_hours_data) {
        data.special_hours_data.forEach((item: any) => {
          specialHoursMap[item.day] = {
            special_start: item.special_start,
            special_end: item.special_end
          };
        });
      }
      
      setSpecialHoursData(specialHoursMap);
    } catch (error) {
      console.error('Error fetching special hours dates:', error);
      setSpecialHoursData({});
    }
  };

  const isDateDisabled = (day: number) => {
    const dateToCheck = new Date(selectedYear, selectedMonth, day);

    // Reset time to midnight for accurate date-only comparison
    dateToCheck.setHours(0, 0, 0, 0);

    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    // Check if date is in the past (but allow current day) or beyond max booking days
    if (dateToCheck < todayMidnight || dateToCheck > maxDate) {
      return true;
    }

    // Check if date is admin-disabled
    const monthName = months[selectedMonth];
    const dateKey = `${monthName}-${day}`;
    if (adminDisabledDates.has(dateKey)) {
      return true;
    }

    // Check if date is completely closed
    if (closedDates.includes(day)) {
      return true;
    }

    return false;
  };

  // New function to check if a date is fully booked (for red color and strikethrough)
  const isDateFullyBooked = (day: number) => {
    return fullyBookedDates.includes(day);
  };

  // New function to check if a date is closed (for grey color)
  const isDateClosed = (day: number) => {
    return closedDates.includes(day);
  };

  // New function to check if a date has special hours (for yellow color)
  const isDateSpecialHours = (day: number) => {
    return specialHoursData.hasOwnProperty(day);
  };

  // New function to get special hours for a specific date
  const getSpecialHoursForDate = (day: number) => {
    return specialHoursData[day] || null;
  };

  // Helper function to check if a time slot is admin-disabled for the selected date
  const isTimeSlotAdminDisabled = (timeSlotId: number) => {
    return disabledTimeSlots.includes(timeSlotId);
  };

  const fetchOccupiedTimeSlots = async (date: string) => {
    try {
      const response = await fetch(`/reservations/occupied-time-slots?date=${date}`);
      const data = await response.json();
      setOccupiedTimeSlots(data.occupied_time_slots || []);
      setDisabledTimeSlots(data.disabled_time_slots || []);
    } catch (error) {
      console.error('Error fetching occupied time slots:', error);
      setOccupiedTimeSlots([]);
      setDisabledTimeSlots([]);
    }
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate(day);
    const formattedDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    fetchOccupiedTimeSlots(formattedDate);
    
    // Auto-select special hours if the selected date has special hours
    if (isDateSpecialHours(day)) {
      setSelectedTimeSlot('special-hours');
    } else {
      // Reset to first available time slot for regular dates
      const firstAvailableSlot = timeSlots.find(slot => 
        !occupiedTimeSlots.includes(slot.id) && !disabledTimeSlots.includes(slot.id)
      );
      setSelectedTimeSlot(firstAvailableSlot?.id || null);
    }
  };

  // Reset time slot if it becomes occupied or disabled
  useEffect(() => {
    if (selectedTimeSlot && typeof selectedTimeSlot === 'number' && 
        (occupiedTimeSlots.includes(selectedTimeSlot) || disabledTimeSlots.includes(selectedTimeSlot))) {
      const firstAvailableSlot = timeSlots.find(slot => 
        !occupiedTimeSlots.includes(slot.id) && !disabledTimeSlots.includes(slot.id)
      );
      setSelectedTimeSlot(firstAvailableSlot?.id || null);
    }
  }, [occupiedTimeSlots, disabledTimeSlots, selectedTimeSlot, timeSlots]);

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
      if (selectedTimeSlot === 'special-hours') {
        const specialHours = getSpecialHoursForDate(selectedDate!);
        if (specialHours) {
          parts.push(`${specialHours.special_start} - ${specialHours.special_end} (Special Hours)`);
        }
      } else {
        const selectedTime = timeSlots.find(slot => slot.id === selectedTimeSlot);
        if (selectedTime) {
          parts.push(selectedTime.start_time_formatted);
        }
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
      (selectedTimeSlot === 'special-hours' || (!occupiedTimeSlots.includes(selectedTimeSlot as number) && !disabledTimeSlots.includes(selectedTimeSlot as number))) &&
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
        special_requests: specialRequests.trim(),
        reservation_date: `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`,
        time_slot_id: selectedTimeSlot === 'special-hours' ? null : selectedTimeSlot,
        guest_count: guestCount,
        is_special_hours: selectedTimeSlot === 'special-hours',
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
    specialRequests,
    occupiedTimeSlots,
    disabledTimeSlots,
    fullyBookedDates,
    closedDates,
    specialHoursData,
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
    setSpecialRequests,
    
    // Functions
    isDateDisabled,
    isDateFullyBooked,
    isDateClosed,
    isDateSpecialHours,
    getSpecialHoursForDate,
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

