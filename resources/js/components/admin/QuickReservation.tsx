import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import Calendar from '../Calendar';
import { useNotification } from '../../contexts/NotificationContext';

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

interface QuickReservationProps {
  isOpen: boolean;
  onClose: () => void;
  onReservationCreated?: () => void;
  timeSlots: TimeSlot[];
  systemSettings: SystemSettings;
}

const QuickReservation: React.FC<QuickReservationProps> = ({
  isOpen,
  onClose,
  onReservationCreated,
  timeSlots,
  systemSettings
}) => {
  const { showNotification } = useNotification();
  
  // Form state
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Date calculations
  const today = new Date();
  const maxDate = new Date(today.getTime() + (systemSettings.max_advance_booking_days * 24 * 60 * 60 * 1000));

  // Fetch fully booked dates when month changes
  useEffect(() => {
    fetchFullyBookedDates();
  }, [selectedMonth, selectedYear]);

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
    dateToCheck.setHours(0, 0, 0, 0);

    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    // Check if date is in the past
    if (dateToCheck <= todayMidnight) {
      return true;
    }

    // Check if date is beyond max booking days
    const maxDate = new Date(todayMidnight.getTime() + (systemSettings.max_advance_booking_days * 24 * 60 * 60 * 1000));
    if (dateToCheck > maxDate) {
      return true;
    }

    return false;
  };

  const isDateFullyBooked = (day: number) => {
    return fullyBookedDates.includes(day);
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
    
    if (selectedDate) {
      const date = new Date(selectedYear, selectedMonth, selectedDate);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const monthName = months[selectedMonth];
      parts.push(`${monthName} ${selectedDate} (${dayName})`);
    }
    
    if (selectedTimeSlot) {
      const selectedTime = timeSlots.find(slot => slot.id === selectedTimeSlot);
      if (selectedTime) {
        parts.push(selectedTime.start_time_formatted);
      }
    }
    
    parts.push(`${guestCount} Guest${guestCount > 1 ? 's' : ''}`);
    
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

  const handleNameInput = (value: string, setter: (value: string) => void) => {
    const nameRegex = /^[a-zA-Z\s]*$/
    if (nameRegex.test(value)) {
      setter(value)
    }
  }

  const handleEmailInput = (value: string) => {
    setEmail(value)
  }

  const handlePhoneInput = (value: string) => {
    const phoneRegex = /^[\d\s\-\+]*$/
    if (phoneRegex.test(value) && value.length <= 12) {
      setPhone(value)
    }
  }

  const handleSubmit = async () => {
    if (!isFormValid()) {
      showNotification('Please fill in all required fields correctly.', 'error');
      return;
    }

    setIsSubmitting(true);
    
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

      const response = await fetch('/admin/api/quick-reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showNotification('Reservation created successfully!', 'success');
        handleClose();
        if (onReservationCreated) {
          onReservationCreated();
        }
      } else {
        showNotification(data.message || 'Failed to create reservation.', 'error');
      }
    } catch (error) {
      console.error('Reservation error:', error);
      showNotification('An error occurred while creating the reservation.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setSelectedMonth(new Date().getMonth());
    setSelectedTimeSlot(timeSlots.length > 0 ? timeSlots[0].id : null);
    setGuestCount(1);
    setSelectedDate(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('63');
    setOccupiedTimeSlots([]);
    setFullyBookedDates([]);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#3f411a] rounded-4xl shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl text-beige font-lexend font-bold">Quick Reservation</h2>
            <button
              onClick={handleClose}
              className="text-beige hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Calendar and Dropdowns */}
            <div className="space-y-6">
              {/* Dropdowns */}
              <div className="flex flex-wrap gap-4">
                {/* Month */}
                <div className="relative w-45">
                  <label className="block text-base font-extralight font-lexend mb-2 text-beige">Month</label>
                  <Select 
                    value={selectedMonth.toString()}
                    onValueChange={(value) => {
                      setSelectedMonth(parseInt(value))
                      setSelectedDate(null)
                    }}
                  >
                    <SelectTrigger className="bg-[#f6f5c6] border-[#3f411a] text-[#3f411a] w-full pr-8 py-2 text-base font-extralight font-lexend rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#f6f5c6] border-[#3f411a] text-[#3f411a]">
                      {months.map((month, index) => (
                        <SelectItem 
                          key={month} 
                          value={index.toString()} 
                          className="bg-[#f6f5c6] font-extralight font-lexend text-[#3f411a] hover:bg-[#e8e6b3] focus:bg-[#e8e6b3]"
                        >
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Time */}
                <div className="relative w-40">
                  <label className="block text-base font-extralight font-lexend mb-2 text-beige">Time</label>
                  <Select 
                    value={selectedTimeSlot?.toString() || ''}
                    onValueChange={(value) => setSelectedTimeSlot(parseInt(value))}
                  >
                    <SelectTrigger className="bg-[#f6f5c6] border-[#3f411a] text-[#3f411a] w-full pr-8 py-2 text-base font-extralight font-lexend rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#f6f5c6] border-[#3f411a] text-[#3f411a]">
                      {timeSlots.map((slot) => {
                        const isOccupied = occupiedTimeSlots.includes(slot.id)
                        
                        return (
                          <SelectItem 
                            key={slot.id} 
                            value={slot.id.toString()} 
                            className={`bg-[#f6f5c6] font-extralight font-lexend text-[#3f411a] hover:bg-[#e8e6b3] focus:bg-[#e8e6b3] ${isOccupied ? 'text-gray-500' : ''}`}
                            disabled={isOccupied}
                          >
                            {slot.start_time_formatted} {isOccupied ? '(Booked)' : ''}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Guests */}
                <div className="relative w-30">
                  <label className="block text-base font-extralight font-lexend mb-2 text-beige">Guests</label>
                  <Select 
                    value={guestCount.toString()}
                    onValueChange={(value) => setGuestCount(parseInt(value))}
                  >
                    <SelectTrigger className="bg-[#f6f5c6] border-[#3f411a] text-[#3f411a] w-full pr-8 py-2 text-base font-extralight font-lexend rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#f6f5c6] border-[#3f411a] text-[#3f411a]">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem 
                          key={num} 
                          value={num.toString()} 
                          className="bg-[#f6f5c6] font-extralight font-lexend text-[#3f411a] hover:bg-[#e8e6b3] focus:bg-[#e8e6b3]"
                        >
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Calendar */}
              <Calendar
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                isDateDisabled={isDateDisabled}
                isDateFullyBooked={isDateFullyBooked}
                months={months}
              />
            </div>

            {/* Right Side - Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-base font-extralight font-lexend mb-3 text-beige">Selected Details</label>
                <div className="border-b border-beige pb-2 text-lg font-extralight font-lexend text-beige">
                  {formatSelectedDateTime()}
                </div>
              </div>
              
              {/* First Name and Last Name */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-base font-extralight font-lexend mb-2 text-beige">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => handleNameInput(e.target.value, setFirstName)}
                    className="w-full bg-[#f6f5c6] border border-[#3f411a] text-[#3f411a] p-3 rounded-xl outline-none text-base font-extralight font-lexend"
                    placeholder="First name"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-base font-extralight font-lexend mb-2 text-beige">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => handleNameInput(e.target.value, setLastName)}
                    className="w-full bg-[#f6f5c6] border border-[#3f411a] text-[#3f411a] p-3 rounded-xl outline-none text-base font-extralight font-lexend"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-extralight font-lexend mb-2 text-beige">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailInput(e.target.value)}
                  className="w-full bg-[#f6f5c6] border border-[#3f411a] text-[#3f411a] p-3 rounded-xl outline-none text-base font-extralight font-lexend"
                  placeholder="Enter email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-base font-extralight font-lexend mb-2 text-beige">Phone Number</label>
                <div className="relative">
                  <div className="flex items-center bg-[#f6f5c6] border border-[#3f411a] p-3 rounded-xl">
                    <span className="text-[#3f411a] text-base font-extralight mr-1 select-none">+</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handlePhoneInput(e.target.value)}
                      className="flex-1 bg-transparent text-[#3f411a] outline-none text-base font-extralight font-lexend pr-12"
                      placeholder="63"
                      required
                    />
                    <span className="text-[#3f411a] text-sm font-extralight font-lexend">
                      {phone.length}/12
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!isFormValid() || isSubmitting}
                className={`block w-full text-center font-extralight font-lexend py-4 mt-8 text-lg transition duration-200 rounded-xl ${
                  isFormValid() && !isSubmitting
                    ? 'bg-beige text-[#3f411a] hover:bg-[#e8e6b3] cursor-pointer'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Creating Reservation...' : 'Create Reservation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickReservation;