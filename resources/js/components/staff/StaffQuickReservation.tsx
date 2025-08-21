import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select'
import Calendar from '@/components/Calendar'
import { useNotification } from '@/contexts/NotificationContext'

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [
    new Date().getFullYear(),
    new Date().getFullYear() + 1,
    new Date().getFullYear() + 2,
  ];

  // Date calculations
  const today = new Date();
  const maxDate = new Date(today.getTime() + (systemSettings.max_advance_booking_days * 24 * 60 * 60 * 1000));

  // Fetch data when month changes
  useEffect(() => {
    fetchFullyBookedDates();
    fetchClosedDates();
    fetchSpecialHoursDates();
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
    dateToCheck.setHours(0, 0, 0, 0);

    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    // Check if date is in the past (but allow current day)
    if (dateToCheck < todayMidnight) {
      return true;
    }

    // Check if date is beyond max booking days
    if (dateToCheck > maxDate) {
      return true;
    }

    // Check if date is completely closed
    if (closedDates.includes(day)) {
      return true;
    }

    return false;
  };

  const isDateFullyBooked = (day: number) => {
    return fullyBookedDates.includes(day);
  };

  const isDateClosed = (day: number) => {
    return closedDates.includes(day);
  };

  const isDateSpecialHours = (day: number) => {
    return specialHoursData.hasOwnProperty(day);
  };

  const getSpecialHoursForDate = (day: number) => {
    return specialHoursData[day] || null;
  };

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

  const sendConfirmationEmail = async (created: { reservation_date: string; guest_email: string; guest_first_name: string; guest_last_name: string; guest_phone?: string; guest_count: number; time_slot_id?: number | null; }) => {
    const dateLabel = formatLongDate(created.reservation_date);

    let timeLabel = 'Time not specified';
    if (selectedDate) {
      const special = getSpecialHoursForDate(selectedDate);
      if (special && (selectedTimeSlot === 'special-hours' || !created.time_slot_id)) {
        timeLabel = `${formatTo12Hour(special.special_start)} - ${formatTo12Hour(special.special_end)} (Special Hours)`;
      } else if (created.time_slot_id) {
        const slot = timeSlots.find(ts => ts.id === created.time_slot_id);
        if (slot) {
          timeLabel = slot.start_time_formatted && slot.end_time_formatted
            ? `${slot.start_time_formatted} - ${slot.end_time_formatted}`
            : `${formatTo12Hour(slot.start_time)} - ${formatTo12Hour(slot.end_time)}`;
        }
      }
    }

    const name = `${created.guest_first_name} ${created.guest_last_name}`.trim();
    const payload = {
      to: created.guest_email,
      guest_name: name,
      phone: created.guest_phone || '',
      date_formatted: dateLabel,
      time_range: timeLabel,
      guest_count: created.guest_count,
    };

    try {
      await fetch('/api/send-reservation-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(payload),
      });
    } catch {}
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
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
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
    return selectedDate &&
      selectedTimeSlot &&
      (selectedTimeSlot === 'special-hours' || (!occupiedTimeSlots.includes(selectedTimeSlot as number) && !disabledTimeSlots.includes(selectedTimeSlot as number))) &&
      firstName.trim() &&
      lastName.trim() &&
      phone.trim();
  };

  const handleNameInput = (value: string, setter: (value: string) => void) => {
    // Only allow letters and spaces
    const nameRegex = /^[a-zA-Z\s]*$/
    if (nameRegex.test(value)) {
      setter(value)
    }
  }

  const handleEmailInput = (value: string) => {
    setEmail(value)
  }

  const handlePhoneInput = (value: string) => {
    // Only allow numbers, spaces, hyphens, and plus signs, limit to 15 characters
    const phoneRegex = /^[\d\s\-\+]*$/
    if (phoneRegex.test(value) && value.length <= 15) {
      setPhone(value)
    }
  }

  const handleSubmit = async () => {
    if (!isFormValid()) {
      return;
    }

    setIsSubmitting(true);
    
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

      const response = await fetch('/staff/api/quick-reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showNotification('Reservation created successfully!', 'success');
        // Only send confirmation email if email is provided
        if (email.trim()) {
          try { await sendConfirmationEmail(data.reservation ?? formData as any); } catch {}
        }
        if (onReservationCreated) {
          onReservationCreated();
        }
        handleClose();
      } else {
        showNotification(data.message || 'Failed to create reservation', 'error');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      showNotification('An error occurred while creating the reservation', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setSelectedMonth(new Date().getMonth());
    setSelectedYear(new Date().getFullYear());
    setSelectedTimeSlot(timeSlots.length > 0 ? timeSlots[0].id : null);
    setGuestCount(systemSettings.min_guest_size || 1);
    setSelectedDate(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setSpecialRequests('');
    setOccupiedTimeSlots([]);
    setDisabledTimeSlots([]);
    setFullyBookedDates([]);
    setClosedDates([]);
    setSpecialHoursData({});
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-[#3f411a] rounded shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl text-beige font-lexend font-extralight">QUICK RESERVATION</h2>
            <button
              onClick={handleClose}
              className="text-white cursor-pointer text-3xl font-bold hover:text-beige transition-colors"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Content Container */}
            <div className="flex flex-col justify-start h-full">
              {/* Dropdowns + Calendar */}
              <div className="flex flex-col justify-start h-full">
                <div className="flex space-x-4 mb-10">
                  {/* Month */}
                  <div className="relative w-40">
                    <label className="block text-base font-extralight font-lexend mb-2 text-beige">Month</label>
                    <Select 
                      value={selectedMonth.toString()}
                      onValueChange={(value) => {
                        setSelectedMonth(parseInt(value))
                        setSelectedDate(null)
                      }}
                    >
                      <SelectTrigger className="bg-transparent border-b border-white text-white w-full pr-8 py-2 text-base font-extralight font-lexend rounded-none border-t-0 border-l-0 border-r-0 focus:ring-0 focus:ring-offset-0 px-0 h-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#3f411a] border-white text-white max-h-none overflow-y-visible">
                        {months.map((month, index) => (
                          <SelectItem 
                            key={month} 
                            value={index.toString()} 
                            className="bg-[#3f411a] font-extralight font-lexend text-white hover:bg-[#5a5d2a] focus:bg-[#5a5d2a]"
                          >
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Year */}
                  <div className="relative w-28">
                    <label className="block text-base font-extralight font-lexend mb-2 text-beige">Year</label>
                    <Select
                      value={selectedYear.toString()}
                      onValueChange={(value) => setSelectedYear(parseInt(value))}
                    >
                      <SelectTrigger className="bg-transparent border-b border-white text-white w-full pr-8 py-2 text-base font-extralight font-lexend rounded-none border-t-0 border-l-0 border-r-0 focus:ring-0 focus:ring-offset-0 px-0 h-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#3f411a] border-white text-white">
                        {years.map((year) => (
                          <SelectItem
                            key={year}
                            value={year.toString()}
                            className="bg-[#3f411a] font-extralight font-lexend text-white hover:bg-[#5a5d2a] focus:bg-[#5a5d2a]"
                          >
                            {year}
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
                      onValueChange={(value) => {
                        if (value === 'special-hours') {
                          setSelectedTimeSlot('special-hours');
                        } else {
                          setSelectedTimeSlot(parseInt(value));
                        }
                      }}
                    >
                      <SelectTrigger className={`bg-transparent border-b border-white text-white w-full font-extralight font-lexend rounded-none border-t-0 border-l-0 border-r-0 focus:ring-0 focus:ring-offset-0 px-0 h-auto text-left ${
                        selectedTimeSlot === 'special-hours' ? 'py-3 text-xs' : 'py-2 text-base'
                      }`}>
                        <SelectValue>
                          {(() => {
                            if (selectedTimeSlot === 'special-hours') {
                              return 'Special Hours';
                            } else if (selectedTimeSlot && typeof selectedTimeSlot === 'number') {
                              const selectedTime = timeSlots.find(slot => slot.id === selectedTimeSlot);
                              return selectedTime ? `${selectedTime.start_time_formatted} - ${selectedTime.end_time_formatted}` : '';
                            }
                            return '';
                          })()}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-[#3f411a] border-white text-white">
                        {(() => {
                          // Check if selected date has special hours
                          const specialHours = selectedDate ? getSpecialHoursForDate(selectedDate) : null;
                          
                          if (specialHours) {
                            // Show special hours time range
                            return (
                              <SelectItem 
                                value="special-hours" 
                                className="bg-[#3f411a] font-extralight font-lexend text-white hover:bg-[#5a5d2a] focus:bg-[#5a5d2a]"
                              >
                                {specialHours.special_start} - {specialHours.special_end} (Special Hours)
                              </SelectItem>
                            );
                          } else {
                            // Show regular time slots
                            return timeSlots.map((slot) => {
                              const isOccupied = occupiedTimeSlots.includes(slot.id)
                              const isAdminDisabled = disabledTimeSlots.includes(slot.id)
                              const isDisabled = isOccupied || isAdminDisabled
                              
                              return (
                                <SelectItem 
                                  key={slot.id} 
                                  value={slot.id.toString()} 
                                  className={`bg-[#3f411a] font-extralight font-lexend focus:bg-[#5a5d2a] relative ${isDisabled ? 'cursor-not-allowed' : 'hover:bg-[#5a5d2a]'} ${isOccupied ? '!opacity-100' : ''} ${isAdminDisabled ? '!opacity-100' : ''}`}
                                  disabled={isDisabled}
                                >
                                  <span className={isOccupied ? 'text-[#D4847C]' : isAdminDisabled ? 'text-[#5295bb]' : 'text-white'}>
                                    {slot.start_time_formatted} - {slot.end_time_formatted}
                                  </span>
                                  {isOccupied && (
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#D4847C] rounded-full opacity-100"></div>
                                  )}
                                  {isAdminDisabled && !isOccupied && (
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#5295bb] rounded-full opacity-100"></div>
                                  )}
                                </SelectItem>
                              )
                            });
                          }
                        })()}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Guests */}
                  <div className="relative w-24">
                    <label className="block text-base font-extralight font-lexend mb-2 text-beige">Guests</label>
                    <Select 
                      value={guestCount.toString()}
                      onValueChange={(value) => setGuestCount(parseInt(value))}
                    >
                      <SelectTrigger className="bg-transparent border-b border-white text-white w-full pr-8 py-2 text-base font-extralight font-lexend rounded-none border-t-0 border-l-0 border-r-0 focus:ring-0 focus:ring-offset-0 px-0 h-auto">
                        <SelectValue>{guestCount}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-[#3f411a] border-white text-white">
                        {(() => {
                          const minGuest = systemSettings.min_guest_size || 1;
                          const maxGuest = systemSettings.max_guest_size || 10;
                          const guestOptions = [];
                          
                          for (let i = minGuest; i <= maxGuest; i++) {
                            guestOptions.push(i);
                          }
                          
                          return guestOptions.map((num) => (
                            <SelectItem 
                              key={num} 
                              value={num.toString()} 
                              className="bg-[#3f411a] font-extralight font-lexend text-white hover:bg-[#5a5d2a] focus:bg-[#5a5d2a]"
                            >
                              {num}
                            </SelectItem>
                          ));
                        })()}
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
                  isDateClosed={isDateClosed}
                  isDateSpecialHours={isDateSpecialHours}
                  months={months}
					className="grid grid-cols-7 text-center gap-y-7 text-white text-lg"
					weekdayClassName={() => 'h-8 flex items-center justify-center font-lexend text-beige font-medium tracking-wide opacity-80'}
					dayClassName={(day, { isDisabled, isFullyBooked, isSelected, isClosed, isSpecialHours }) => {
						let className = 'transition-colors h-8 w-full flex items-center justify-center font-lexend font-light relative';
                    
                    if (isClosed) {
                      className += ' text-[#D4847C] cursor-not-allowed';
                    } else if (isFullyBooked) {
                      className += ' text-[#6B7A5E] cursor-not-allowed';
                    } else if (isSelected && isSpecialHours) {
							className += ' text-[#C5A572] font-semibold';
                    } else if (isSelected) {
							className += ' text-[#3f411a] font-semibold';
                    } else if (isSpecialHours) {
                      className += ' text-[#C5A572] hover:text-beige-dark cursor-pointer';
                    } else if (isDisabled) {
                      className += ' text-gray-400 cursor-not-allowed';
                    } else {
                      className += ' text-white hover:text-beige-dark cursor-pointer';
                    }
                    return className;
                  }}  
                  animatedSelection
                />

                {/* Legend */}
                <div className="flex justify-center items-center space-x-6 mt-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#6B7A5E]"></div>
                    <span className="text-white/80 font-light font-lexend text-sm">Fully Booked</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#C5A572]"></div>
                    <span className="text-white/80 font-light font-lexend text-sm">Special Hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#D4847C]"></div>
                    <span className="text-white/80 font-light font-lexend text-sm">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="flex flex-col justify-between h-full self-stretch w-full max-w-md ml-auto">
              <div className="space-y-8">
                <div>
                  <label className="block text-base font-extralight font-lexend mb-3 text-white">When</label>
                  <div className="border-b border-white pb-2 text-lg font-extralight font-lexend text-white">
                    {formatSelectedDateTime()}
                  </div>
                </div>
                
                {/* First Name and Last Name */}
                <div className="flex space-x-6">
                  <div className="flex-1">
                    <label className="block text-base font-extralight font-lexend mb-2 text-white">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => handleNameInput(e.target.value, setFirstName)}
                      className="w-full bg-transparent border-b border-white text-white pb-2 outline-none text-base font-extralight font-lexend"
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-base font-extralight font-lexend mb-2 text-white">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => handleNameInput(e.target.value, setLastName)}
                      className="w-full bg-transparent border-b border-white text-white pb-2 outline-none text-base font-extralight font-lexend"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-extralight font-lexend mb-2 text-white">Email (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailInput(e.target.value)}
                    className="w-full bg-transparent border-b border-white text-white pb-2 outline-none text-base font-extralight font-lexend"
                    placeholder="Enter your email (optional)"
                  />
                </div>
                
                {/* Phone Number and Special Requests */}
                <div className="flex space-x-6">
                  <div className="flex-1">
                  <label className="block text-base font-extralight font-lexend mb-2 text-white">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handlePhoneInput(e.target.value)}
                      className="w-full bg-transparent border-b border-white text-white pb-2 outline-none text-base font-extralight font-lexend"
                    placeholder="+639543846071"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-base font-extralight font-lexend mb-2 text-white">Special Requests</label>
                    <input
                      type="text"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full bg-transparent border-b border-white text-white pb-2 outline-none text-base font-extralight font-lexend"
                      placeholder="ex. Food Allergies"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!isFormValid() || isSubmitting}
                className={`block w-full text-center font-light font-lexend py-4 mt-8 text-lg transition duration-200 uppercase ${
                  isFormValid() && !isSubmitting
                    ? 'bg-beige-dark active:bg-beige text-[#3f411a] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg cursor-pointer tracking-wider'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed tracking-wider'
                }`}
              >
                {isSubmitting ? 'CREATING RESERVATION...' : 'CREATE RESERVATION'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickReservation; 