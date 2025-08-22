import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  formatted_time: string;
  start_time_formatted: string;
  end_time_formatted: string;
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
  const [fullyBookedTimeSlots, setFullyBookedTimeSlots] = useState<number[]>([]);
  const [fullyBookedDates, setFullyBookedDates] = useState<number[]>([]);
  const [datesWithFullyBookedSlots, setDatesWithFullyBookedSlots] = useState<Set<string>>(new Set());
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

  // Fetch initial data when component loads
  useEffect(() => {
    fetchMonthDisabledAndFullyBookedSlots();
  }, []);

  // Fetch fully booked dates, closed dates, and special hours dates when month changes
  useEffect(() => {
    fetchFullyBookedDates();
    fetchClosedDates();
    fetchSpecialHoursDates();
    fetchMonthDisabledAndFullyBookedSlots();
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

  const fetchMonthDisabledAndFullyBookedSlots = async () => {
    try {
      // Fetch all disabled and fully booked time slots for the current month
      const response = await fetch(`/admin/api/disabled-time-slots?month=${selectedMonth + 1}&year=${selectedYear}`);
      const data = await response.json();
      
      // Process the data to track which dates have fully booked slots
      const newDatesWithFullyBookedSlots = new Set<string>();
      
      if (data.fullyBooked && data.fullyBooked.length > 0) {
        // Group fully booked slots by date
        const fullyBookedByDate: { [key: string]: number[] } = {};
        
        data.fullyBooked.forEach((item: any) => {
          if (!fullyBookedByDate[item.date]) {
            fullyBookedByDate[item.date] = [];
          }
          fullyBookedByDate[item.date].push(item.time_slot_id);
        });
        
        // Check which dates have ALL time slots marked as fully booked
        Object.keys(fullyBookedByDate).forEach(dateStr => {
          const fullyBookedCount = fullyBookedByDate[dateStr].length;
          if (fullyBookedCount === timeSlots.length) {
            newDatesWithFullyBookedSlots.add(dateStr);
          }
        });
      }
      
      setDatesWithFullyBookedSlots(newDatesWithFullyBookedSlots);
    } catch (error) {
      console.error('Error fetching month disabled and fully booked slots:', error);
      setDatesWithFullyBookedSlots(new Set());
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
    // Check if ALL time slots for this date are fully booked (either by capacity or admin-marked)
    
    // First check if the date is capacity-based fully booked (all slots reach capacity)
    if (fullyBookedDates.includes(day)) {
      return true;
    }
    
    // Check if admin has marked ALL time slots as fully booked for this specific date
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return datesWithFullyBookedSlots.has(dateStr);
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

  // Helper function to convert 12-hour format to 24-hour format
  const convertTo24HourFormat = (time12h: string) => {
    if (!time12h) return null;
    
    // Parse time like "11:00 AM" or "3:00 PM"
    const [time, period] = time12h.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    let hours24 = hours;
    if (period === 'PM' && hours !== 12) {
      hours24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hours24 = 0;
    }
    
    return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Helper function to check if a time slot is admin-disabled for the selected date
  const isTimeSlotAdminDisabled = (timeSlotId: number) => {
    return disabledTimeSlots.includes(timeSlotId);
  };

  // Helper function to check if a time slot is fully booked for the selected date
  const isTimeSlotFullyBooked = (timeSlotId: number) => {
    return fullyBookedTimeSlots.includes(timeSlotId);
  };

  // Helper function to check if a date has some (but not all) fully booked time slots
  const hasPartiallyFullyBookedSlots = (day: number) => {
    // This function will be called when we need to show indicators for dates with some fully booked slots
    // For now, we'll implement this based on the selected date's data
    if (selectedDate === day) {
      return fullyBookedTimeSlots.length > 0 && fullyBookedTimeSlots.length < timeSlots.length;
    }
    return false;
  };

  const fetchOccupiedTimeSlots = async (date: string) => {
    try {
      const response = await fetch(`/reservations/occupied-time-slots?date=${date}`);
      const data = await response.json();
      setOccupiedTimeSlots(data.occupied_time_slots || []);
      setDisabledTimeSlots(data.disabled_time_slots || []);
      setFullyBookedTimeSlots(data.fully_booked_time_slots || []);
      
      // Track which dates have fully booked slots only if ALL time slots are fully booked
      const fullyBookedCount = (data.fully_booked_time_slots || []).length;
      const totalTimeSlots = timeSlots.length;
      
      if (fullyBookedCount > 0 && fullyBookedCount === totalTimeSlots) {
        // Only mark date as fully booked if ALL time slots are marked as fully booked
        setDatesWithFullyBookedSlots(prev => new Set([...prev, date]));
      } else {
        // Remove from fully booked dates if not all slots are marked
        setDatesWithFullyBookedSlots(prev => {
          const newSet = new Set(prev);
          newSet.delete(date);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error fetching occupied time slots:', error);
      setOccupiedTimeSlots([]);
      setDisabledTimeSlots([]);
      setFullyBookedTimeSlots([]);
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
        !occupiedTimeSlots.includes(slot.id) && !disabledTimeSlots.includes(slot.id) && !fullyBookedTimeSlots.includes(slot.id)
      );
      setSelectedTimeSlot(firstAvailableSlot?.id || null);
    }
  };

  // Reset time slot if it becomes occupied or disabled
  useEffect(() => {
    if (selectedTimeSlot && typeof selectedTimeSlot === 'number' && 
        (occupiedTimeSlots.includes(selectedTimeSlot) || disabledTimeSlots.includes(selectedTimeSlot) || fullyBookedTimeSlots.includes(selectedTimeSlot))) {
      const firstAvailableSlot = timeSlots.find(slot => 
        !occupiedTimeSlots.includes(slot.id) && !disabledTimeSlots.includes(slot.id) && !fullyBookedTimeSlots.includes(slot.id)
      );
      setSelectedTimeSlot(firstAvailableSlot?.id || null);
    }
  }, [occupiedTimeSlots, disabledTimeSlots, fullyBookedTimeSlots, selectedTimeSlot, timeSlots]);

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
          parts.push(`${selectedTime.start_time_formatted} - ${selectedTime.end_time_formatted}`);
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
    // Check if date and time slot are selected
    if (!selectedDate || !selectedTimeSlot) {
      console.log('Form validation failed: No date or time slot selected');
      return false;
    }

    // For special hours, check if special hours data exists
    if (selectedTimeSlot === 'special-hours') {
      const specialHours = getSpecialHoursForDate(selectedDate);
      console.log('Special hours validation:', { selectedDate, specialHours });
      if (!specialHours || !specialHours.special_start || !specialHours.special_end) {
        console.log('Form validation failed: Invalid special hours data');
        return false;
      }
    } else {
      // For regular time slots, check if they're available
      if (occupiedTimeSlots.includes(selectedTimeSlot as number) || disabledTimeSlots.includes(selectedTimeSlot as number)) {
        console.log('Form validation failed: Time slot not available');
        return false;
      }
    }

    // Check form fields
    const formFieldsValid = firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      phone.trim() &&
      email.includes('@') &&
      email.includes('.');
    
    if (!formFieldsValid) {
      console.log('Form validation failed: Form fields incomplete');
    }
    
    return formFieldsValid;
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
        is_special_hours: selectedTimeSlot === 'special-hours' ? true : false,
        special_hours_start: selectedTimeSlot === 'special-hours' && selectedDate ? convertTo24HourFormat(getSpecialHoursForDate(selectedDate)?.special_start) : null,
        special_hours_end: selectedTimeSlot === 'special-hours' && selectedDate ? convertTo24HourFormat(getSpecialHoursForDate(selectedDate)?.special_end) : null,
      };

      // Debug logging
      console.log('Form data being sent:', formData);
      console.log('Selected time slot:', selectedTimeSlot);
      console.log('Selected date:', selectedDate);
      console.log('Special hours data:', selectedDate ? getSpecialHoursForDate(selectedDate) : null);

      router.post('/reservations', formData, {
        onError: (errors) => {
          console.error('Booking error:', errors);
          // Show specific error messages
          if (errors.general) {
            console.error('General error:', errors.general);
          }
          if (errors.special_hours_start) {
            console.error('Special hours start error:', errors.special_hours_start);
          }
          if (errors.special_hours_end) {
            console.error('Special hours end error:', errors.special_hours_end);
          }
          if (errors.is_special_hours) {
            console.error('Is special hours error:', errors.is_special_hours);
          }
          // The notification will be handled by the backend error response
        },
        onSuccess: () => {
          console.log('Booking successful!');
          setShowConfirmationModal(false);
        }
      });
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
    convertTo24HourFormat,
    isTimeSlotAdminDisabled,
    isTimeSlotFullyBooked,
    hasPartiallyFullyBookedSlots,
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

