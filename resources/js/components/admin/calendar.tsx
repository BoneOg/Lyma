import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

interface Settings {
  reservation_fee: number;
  max_advance_booking_days: number;
  restaurant_email: string;
  restaurant_phone: string;
}

interface CalendarComponentProps {
  settings: Settings;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ settings }) => {
  const [selectedMonth, setSelectedMonth] = useState('June');
  const [selectedTime, setSelectedTime] = useState('All Time');
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  
  // State to track disabled dates and time slots
  const [disabledDates, setDisabledDates] = useState<Set<string>>(new Set());
  const [disabledTimeSlots, setDisabledTimeSlots] = useState<Map<string, Set<string>>>(new Map());

  // Load disabled dates from localStorage on component mount
  useEffect(() => {
    const savedDisabledDates = localStorage.getItem('disabledDates');
    const savedDisabledTimeSlots = localStorage.getItem('disabledTimeSlots');
    
    if (savedDisabledDates) {
      setDisabledDates(new Set(JSON.parse(savedDisabledDates)));
    }
    
    if (savedDisabledTimeSlots) {
      const parsed = JSON.parse(savedDisabledTimeSlots);
      const newMap = new Map();
      Object.keys(parsed).forEach(key => {
        newMap.set(key, new Set(parsed[key]));
      });
      setDisabledTimeSlots(newMap);
    }
  }, []);

  // Save disabled dates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('disabledDates', JSON.stringify([...disabledDates]));
    
    const timeSlotsObj: Record<string, string[]> = {};
    disabledTimeSlots.forEach((slots, date) => {
      timeSlotsObj[date] = [...slots];
    });
    localStorage.setItem('disabledTimeSlots', JSON.stringify(timeSlotsObj));
  }, [disabledDates, disabledTimeSlots]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const timeSlots = [
    { id: 'all', time: 'all', formatted: 'All Time' },
    { id: 1, time: '11:00', formatted: '11:00 AM' },
    { id: 2, time: '13:30', formatted: '1:30 PM' },
    { id: 3, time: '16:00', formatted: '4:00 PM' },
    { id: 4, time: '18:30', formatted: '6:30 PM' },
    { id: 5, time: '21:00', formatted: '9:00 PM' },
  ];

  const getDaysInMonth = (month: string, year: number) => {
    const monthIndex = months.indexOf(month);
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: string, year: number) => {
    const monthIndex = months.indexOf(month);
    return new Date(year, monthIndex, 1).getDay();
  };

  const isDateDisabled = (day: number) => {
    const today = new Date();
    const monthIndex = months.indexOf(selectedMonth);
    const selectedDate = new Date(today.getFullYear(), monthIndex, day);
    
    // Disable past dates (yesterday and earlier)
    const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    if (selectedDateOnly < todayOnly) {
      return true;
    }
    
    // Disable dates beyond max_advance_booking_days
    const maxBookingDate = new Date(today);
    maxBookingDate.setDate(today.getDate() + settings.max_advance_booking_days);
    const maxBookingDateOnly = new Date(maxBookingDate.getFullYear(), maxBookingDate.getMonth(), maxBookingDate.getDate());
    
    if (selectedDateOnly > maxBookingDateOnly) {
      return true;
    }
    
    return false;
  };

  // Helper function to check if a date is custom disabled (for admin strikethrough)
  const isDateCustomDisabled = (day: number) => {
    const dateKey = `${selectedMonth}-${day}`;
    return disabledDates.has(dateKey);
  };

  // Helper function to check if a time slot is disabled for a specific date
  const isTimeSlotDisabled = (day: number, timeSlotId: string) => {
    const dateKey = `${selectedMonth}-${day}`;
    const disabledSlots = disabledTimeSlots.get(dateKey);
    return disabledSlots ? disabledSlots.has(timeSlotId) : false;
  };

  // Helper function to get date key
  const getDateKey = (day: number) => {
    return `${selectedMonth}-${day}`;
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate(selectedDate === day ? null : day);
  };

  const formatSelectedDateTime = () => {
    if (selectedDate) {
      const selectedDateObj = new Date(today.getFullYear(), months.indexOf(selectedMonth), selectedDate);
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = dayNames[selectedDateObj.getDay()];
      return `${selectedMonth} ${selectedDate} (${dayName}), ${selectedTime}`;
    }
    return `${selectedMonth} 27 (Friday), ${selectedTime}`;
  };

  const handleEnableClick = () => {
    setShowEnableModal(true);
  };

  const handleDisableClick = () => {
    setShowDisableModal(true);
  };

  const handleConfirmEnable = () => {
    if (selectedDate) {
      const dateKey = getDateKey(selectedDate);
      
      if (selectedTime === 'All Time') {
        // Enable entire date
        setDisabledDates(prev => {
          const newSet = new Set(prev);
          newSet.delete(dateKey);
          return newSet;
        });
        // Remove all time slot restrictions for this date
        setDisabledTimeSlots(prev => {
          const newMap = new Map(prev);
          newMap.delete(dateKey);
          return newMap;
        });
      } else {
        // Enable specific time slot for this date
        setDisabledTimeSlots(prev => {
          const newMap = new Map(prev);
          const existingSlots = newMap.get(dateKey);
          if (existingSlots) {
            existingSlots.delete(selectedTime);
            if (existingSlots.size === 0) {
              newMap.delete(dateKey);
            }
          }
          return newMap;
        });
      }
    }
    setShowEnableModal(false);
  };

  const handleConfirmDisable = () => {
    if (selectedDate) {
      const dateKey = getDateKey(selectedDate);
      
      if (selectedTime === 'All Time') {
        // Disable entire date
        setDisabledDates(prev => new Set([...prev, dateKey]));
        // Remove any specific time slot restrictions for this date
        setDisabledTimeSlots(prev => {
          const newMap = new Map(prev);
          newMap.delete(dateKey);
          return newMap;
        });
      } else {
        // Disable specific time slot for this date
        setDisabledTimeSlots(prev => {
          const newMap = new Map(prev);
          const existingSlots = newMap.get(dateKey) || new Set();
          existingSlots.add(selectedTime);
          newMap.set(dateKey, existingSlots);
          return newMap;
        });
      }
    }
    setShowDisableModal(false);
  };

  const handleCancelModal = () => {
    setShowEnableModal(false);
    setShowDisableModal(false);
  };

  const today = new Date();

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, today.getFullYear());
    const firstDay = getFirstDayOfMonth(selectedMonth, today.getFullYear());
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isDisabled = isDateDisabled(day);
      const isCustomDisabled = isDateCustomDisabled(day);
      const isSelected = selectedDate === day;
      
      days.push(
        <div
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`cursor-pointer transition-colors h-8 flex items-center justify-center ${
            isDisabled
              ? 'text-gray-500 cursor-not-allowed'
              : isCustomDisabled
              ? 'text-red-500 line-through cursor-pointer'
              : isSelected
              ? 'bg-[#f6f5c6] text-[#3f411a] rounded-lg px-2'
              : 'text-white hover:text-[#f6f5c6]'
          }`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-[#3f411a] text-white rounded p-6 shadow-lg h-full">
      <h3 className="text-xl font-semibold mb-6 font-lexend">Calendar</h3>
      
      {/* Month and Time Selectors */}
      <div className="grid grid-cols-16 gap-4 mb-6">
        <div className="col-span-4">
          <label className="block text-sm text-beige-dark mb-2 font-lexend">Month</label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="bg-olive-light border-olive-light text-blue font-lexend">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-olive-dark border-olive-light text-white max-h-none">
              {months.map((month) => (
                <SelectItem key={month} value={month} className="text-white hover:bg-[#f6f5c6] hover:text-[#3f411a] transition-colors duration-200 cursor-pointer font-lexend font-thin">
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="col-span-3">
          <label className="block text-sm text-beige-dark mb-2 font-lexend">Time</label>
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger className="bg-olive-light border-olive-light text-white font-lexend">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-olive-dark border-olive-light text-white max-h-none">
              {timeSlots.map((slot) => {
                const isDisabled = selectedDate ? isTimeSlotDisabled(selectedDate, slot.formatted) : false;
                return (
                  <SelectItem 
                    key={slot.id} 
                    value={slot.formatted} 
                    className={`transition-colors duration-200 cursor-pointer font-lexend font-thin ${
                      isDisabled 
                        ? 'text-red-500 line-through' 
                        : 'text-white hover:bg-[#f6f5c6] hover:text-[#3f411a]'
                    }`}
                  >
                    {slot.formatted}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        
        <div className="col-span-9">
          <label className="block text-sm text-beige-dark mb-2 font-lexend">When</label>
          <div className="text-white p-3 bg-olive-light border border-olive-light rounded-md h-10 flex items-center font-lexend text-sm">
            {formatSelectedDateTime()}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 text-center gap-y-6 text-[#f6f5c6] mb-6">
        {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((day) => (
          <div key={day}>{day}</div>
        ))}
        {renderCalendar()}
      </div>

      {/* Enable and Disable Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          className="flex-1 bg-[#f6f5c6] hover:bg-[#e8e6b3]/80 text-[#3f411a] py-3 px-4 rounded-md font-medium transition-colors font-lexend"
          onClick={handleEnableClick}
        >
          Enable
        </button>
        <button
          type="button"
          className="flex-1 bg-[#f6f5c6] hover:bg-[#e8e6b3]/80 text-[#3f411a] py-3 px-4 rounded-md font-medium transition-colors font-lexend"
          onClick={handleDisableClick}
        >
          Disable
        </button>
      </div>

      {/* Enable Confirmation Modal */}
      {showEnableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#3f411a] text-white rounded-2xl p-6 shadow-lg max-w-md w-full mx-4">
            <h3 className="text-xl mb-4 font-lexend">Confirm Enable</h3>
            <p className="text-[#f6f5c6] mb-6 font-lexend">Are you sure you want to enable this time slot?</p>
            <p className="text-white mb-6 font-lexend">{formatSelectedDateTime()}</p>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancelModal}
                className="flex-1 bg-[#f6f5c6] hover:bg-[#e8e6b3]/80 text-[#3f411a] py-3 px-4 rounded-md font-medium transition-colors font-lexend"
              >
                No
              </button>
              <button
                onClick={handleConfirmEnable}
                className="flex-1 bg-[#f6f5c6] hover:bg-[#e8e6b3]/80 text-[#3f411a] py-3 px-4 rounded-md font-medium transition-colors font-lexend"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disable Confirmation Modal */}
      {showDisableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#3f411a] text-white rounded-2xl p-6 shadow-lg max-w-md w-full mx-4">
            <h3 className="text-xl mb-4 font-lexend">Confirm Disable</h3>
            <p className="text-[#f6f5c6] mb-6 font-lexend">Are you sure you want to disable this time slot?</p>
            <p className="text-white mb-6 font-lexend">{formatSelectedDateTime()}</p>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancelModal}
                className="flex-1 bg-[#f6f5c6] hover:bg-[#e8e6b3]/80 text-[#3f411a] py-3 px-4 rounded-md font-medium transition-colors font-lexend"
              >
                No
              </button>
              <button
                onClick={handleConfirmDisable}
                className="flex-1 bg-[#f6f5c6] hover:bg-[#e8e6b3]/80 text-[#3f411a] py-3 px-4 rounded-md font-medium transition-colors font-lexend"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent; 