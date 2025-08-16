import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const CalendarScheduleCard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const [calendarOption, setCalendarOption] = useState('Normal Day');
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [disableSlotPage, setDisableSlotPage] = useState(0);
  const [disabledSlots, setDisabledSlots] = useState<number[]>([]);
  const [dateSettings, setDateSettings] = useState<{[key: string]: {
    type: 'Normal Day' | 'Close Completely' | 'Special Hours' | 'Disable Specific Time Slots',
    specialHours?: { start: string, end: string },
    disabledSlots?: number[]
  }}>({});
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [disabledTimeSlots, setDisabledTimeSlots] = useState<{date: string, time_slot_id: number}[]>([]);
  const [specials, setSpecials] = useState<any[]>([]);
  const [specialStart, setSpecialStart] = useState('11:00');
  const [specialEnd, setSpecialEnd] = useState('15:00');
  const [loading, setLoading] = useState(false);

  // Helper function to get CSRF token
  const getCsrfToken = () => {
    const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    return csrfMeta?.getAttribute('content') || '';
  };

  useEffect(() => {
    fetch('/admin/api/time-slots')
      .then(res => res.json())
      .then(data => setTimeSlots(data.timeSlots || []))
      .catch(err => console.error('Failed to fetch time slots:', err));
  }, []);

  useEffect(() => {
    fetch(`/admin/api/disabled-time-slots?month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`)
      .then(res => res.json())
      .then(data => {
        setDisabledTimeSlots(data.disabled || []);
        setSpecials(data.specials || []);
      })
      .catch(err => console.error('Failed to fetch disabled time slots:', err));
  }, [currentDate]);

  const slotsPerPage = 4; // 2x2 grid
  const totalPages = Math.ceil(timeSlots.length / slotsPerPage);
  const currentSlots = timeSlots.slice(
    disableSlotPage * slotsPerPage,
    (disableSlotPage + 1) * slotsPerPage
  );

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDateKey = (date: number) => {
    return `${currentDate.getFullYear()}-${currentDate.getMonth()}-${date}`;
  };

  const getDateStr = (date: number) => `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const handleMonthYearChange = (month: number, year: number) => {
    const newDate = new Date(year, month, 1);
    setCurrentDate(newDate);
    setShowMonthYearPicker(false);
    setSelectedDate(null);
  };

  const toggleSlotDisabled = (slotId: number) => {
    setDisabledSlots(prev => 
      prev.includes(slotId)
        ? prev.filter(s => s !== slotId)
        : [...prev, slotId]
    );
  };

  const getDateIndicator = (date: number) => {
    const dateStr = getDateStr(date);
    const special = specials.find(s => s.date === dateStr);
    if (special) {
      if (special.is_closed) return 'bg-red-500';
      if (special.special_start && special.special_end) return 'bg-yellow-500';
    }
    if (disabledTimeSlots.some(d => d.date === dateStr)) {
      return 'bg-blue-500';
    }
    return null;
  };

  const { showNotification } = useNotification ? useNotification() : { showNotification: () => {} };

  const handleSaveChanges = async () => {
    if (selectedDate === null || loading) return;
    
    setLoading(true);
    const dateKey = getDateKey(selectedDate);
    const dateStr = getDateStr(selectedDate);
    const newSettings = { ...dateSettings };
    const prevDisabled = disabledTimeSlots.filter(d => d.date === dateStr).map(d => d.time_slot_id);
    const csrfToken = getCsrfToken();

    try {
      if (calendarOption === 'Normal Day') {
        // Clear any special settings for this date
        const res = await fetch('/admin/api/clear-date', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
          },
          body: JSON.stringify({ date: dateStr })
        });

        if (!res.ok) {
          const errorData = await res.text();
          console.error('Clear date error:', errorData);
          throw new Error(`Failed to clear date: ${res.status} ${res.statusText}`);
        }

        // Re-enable all previously disabled slots
        for (const slotId of prevDisabled) {
          const enableRes = await fetch('/admin/api/disable-time-slot', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': csrfToken,
              'Accept': 'application/json',
            },
            body: JSON.stringify({ 
              time_slot_id: slotId, 
              date: dateStr, 
              enable: true 
            })
          });

          if (!enableRes.ok) {
            const errorData = await enableRes.text();
            console.error('Enable slot error:', errorData);
            throw new Error(`Failed to enable time slot ${slotId}`);
          }
        }

        delete newSettings[dateKey];

      } else if (calendarOption === 'Close Completely') {
        const res = await fetch('/admin/api/close-date', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
          },
          body: JSON.stringify({ date: dateStr })
        });

        if (!res.ok) {
          const errorData = await res.text();
          console.error('Close date error:', errorData);
          throw new Error(`Failed to close date: ${res.status} ${res.statusText}`);
        }

        newSettings[dateKey] = { type: 'Close Completely' };

      } else if (calendarOption === 'Special Hours') {
        // Validate time format and logic
        if (!specialStart || !specialEnd) {
          throw new Error('Special hours start and end times are required');
        }

        if (specialStart >= specialEnd) {
          throw new Error('Start time must be before end time');
        }

        const res = await fetch('/admin/api/special-hours', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
          },
          body: JSON.stringify({ 
            date: dateStr, 
            special_start: specialStart, 
            special_end: specialEnd 
          })
        });

        if (!res.ok) {
          const errorData = await res.text();
          console.error('Special hours error:', errorData);
          throw new Error(`Failed to set special hours: ${res.status} ${res.statusText}`);
        }

        newSettings[dateKey] = { 
          type: 'Special Hours', 
          specialHours: { start: specialStart, end: specialEnd } 
        };

      } else if (calendarOption === 'Disable Specific Time Slots') {
        const toDisable = disabledSlots.filter(id => !prevDisabled.includes(id));
        const toEnable = prevDisabled.filter(id => !disabledSlots.includes(id));

        // Disable new slots
        for (const slotId of toDisable) {
          const res = await fetch('/admin/api/disable-time-slot', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': csrfToken,
              'Accept': 'application/json',
            },
            body: JSON.stringify({ 
              time_slot_id: slotId, 
              date: dateStr, 
              enable: false 
            })
          });

          if (!res.ok) {
            const errorData = await res.text();
            console.error('Disable slot error:', errorData);
            throw new Error(`Failed to disable time slot ${slotId}: ${res.status} ${res.statusText}`);
          }
        }

        // Enable removed slots
        for (const slotId of toEnable) {
          const res = await fetch('/admin/api/disable-time-slot', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': csrfToken,
              'Accept': 'application/json',
            },
            body: JSON.stringify({ 
              time_slot_id: slotId, 
              date: dateStr, 
              enable: true 
            })
          });

          if (!res.ok) {
            const errorData = await res.text();
            console.error('Enable slot error:', errorData);
            throw new Error(`Failed to enable time slot ${slotId}: ${res.status} ${res.statusText}`);
          }
        }

        if (disabledSlots.length > 0) {
          newSettings[dateKey] = { 
            type: 'Disable Specific Time Slots',
            disabledSlots: [...disabledSlots]
          };
        } else {
          delete newSettings[dateKey];
        }
      }

      // Refetch data after successful save
      const refreshRes = await fetch(`/admin/api/disabled-time-slots?month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`);
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        setDisabledTimeSlots(data.disabled || []);
        setSpecials(data.specials || []);
      }

      setDateSettings(newSettings);
      setSelectedDate(null);
      setDisabledSlots([]);
      setCalendarOption('Normal Day');
      showNotification && showNotification('Changes saved successfully!', 'success');

    } catch (error) {
      console.error('Save error:', error);
      showNotification && showNotification(
        error instanceof Error ? error.message : 'Failed to save changes.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: number) => {
    setSelectedDate(date);
    const dateKey = getDateKey(date);
    const dateStr = getDateStr(date);
    
    // Find all slots disabled for this date
    const disabledForDate = disabledTimeSlots.filter(d => d.date === dateStr && d.time_slot_id !== null).map(d => d.time_slot_id);
    setDisabledSlots(disabledForDate);
    
    // Set calendar option and special hours if present
    const special = specials.find(s => s.date === dateStr);
    if (special) {
      if (special.is_closed) {
        setCalendarOption('Close Completely');
      } else if (special.special_start && special.special_end) {
        setCalendarOption('Special Hours');
        setSpecialStart(special.special_start.slice(0,5));
        setSpecialEnd(special.special_end.slice(0,5));
      } else {
        setCalendarOption('Normal Day');
      }
    } else if (disabledForDate.length > 0) {
      setCalendarOption('Disable Specific Time Slots');
    } else {
      setCalendarOption('Normal Day');
    }
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="text-center p-1 text-xs font-lexend"></div>
      );
    }

    // Add days of the month
    for (let date = 1; date <= daysInMonth; date++) {
      const isSelected = selectedDate === date;
      const indicator = getDateIndicator(date);
      days.push(
        <div 
          key={date} 
          className={`relative text-center p-1 cursor-pointer rounded text-xs font-lexend transition-colors ${
            isSelected 
              ? 'bg-olive text-white' 
              : 'hover:bg-gray-100'
          }`}
          onClick={() => handleDateSelect(date)}
        >
          {date}
          {indicator && (
            <div className={`absolute top-0 right-0 w-2 h-2 rounded-full ${indicator}`} />
          )}
        </div>
      );
    }

    return days;
  };

  const renderMonthYearPicker = () => {
    const currentYear = currentDate.getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

    return (
      <div className="absolute top-0 left-0 right-0 bg-white border border-gray-300 rounded shadow-lg z-10 p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-lexend font-medium text-sm">Select Month & Year</h4>
          <button
            onClick={() => setShowMonthYearPicker(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-lexend font-medium mb-1">Month</label>
            <select
              value={currentDate.getMonth()}
              onChange={(e) => handleMonthYearChange(parseInt(e.target.value), currentDate.getFullYear())}
              className="w-full px-2 py-1 border border-gray-300 rounded font-lexend text-xs"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-lexend font-medium mb-1">Year</label>
            <select
              value={currentDate.getFullYear()}
              onChange={(e) => handleMonthYearChange(currentDate.getMonth(), parseInt(e.target.value))}
              className="w-full px-2 py-1 border border-gray-300 rounded font-lexend text-xs"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="col-span-1 row-span-3 bg-white text-olive rounded p-6 shadow-sm border-gray-300 border flex flex-col">
      <div className="flex items-center mb-3">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-gray-100/50 text-olive mr-3">
          <Calendar size={20} />
        </span>
        <h3 className="text-base font-semibold font-lexend tracking-tighter">Calendar Schedule</h3>
      </div>
      
      <div className="flex-1 flex flex-col">
        {selectedDate && (
          <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm font-lexend">
            <span className="font-medium">
              Selected: {months[currentDate.getMonth()]} {selectedDate}, {currentDate.getFullYear()}
            </span>
          </div>
        )}
        
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <ChevronLeft 
              size={18} 
              className="cursor-pointer hover:text-blue-600 transition-colors" 
              onClick={() => navigateMonth('prev')}
            />
            <span 
              className="font-lexend font-medium text-sm cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => setShowMonthYearPicker(true)}
            >
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <ChevronRight 
              size={18} 
              className="cursor-pointer hover:text-blue-600 transition-colors" 
              onClick={() => navigateMonth('next')}
            />
          </div>
          
          {showMonthYearPicker && renderMonthYearPicker()}
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-7 gap-1 text-xs">
            <div className="text-center font-medium p-1 text-xs font-lexend">Sun</div>
            <div className="text-center font-medium p-1 text-xs font-lexend">Mon</div>
            <div className="text-center font-medium p-1 text-xs font-lexend">Tue</div>
            <div className="text-center font-medium p-1 text-xs font-lexend">Wed</div>
            <div className="text-center font-medium p-1 text-xs font-lexend">Thu</div>
            <div className="text-center font-medium p-1 text-xs font-lexend">Fri</div>
            <div className="text-center font-medium p-1 text-xs font-lexend">Sat</div>
            {renderCalendarGrid()}
          </div>
          
          <select
            className={`w-full px-2 py-1 border border-gray-400 rounded font-lexend font-light text-xs focus:outline-none transition-colors duration-150 ${
              selectedDate === null
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-50 text-olive hover:bg-gray-200 hover:text-white cursor-pointer'
            }`}
            value={calendarOption}
            onChange={e => setCalendarOption(e.target.value as any)}
            disabled={selectedDate === null}
          >
            <option>Normal Day</option>
            <option>Close Completely</option>
            <option>Special Hours</option>
            <option>Disable Specific Time Slots</option>
          </select>
        </div>
        
        <div className="flex-1 min-h-0 py-2">
          {calendarOption === 'Special Hours' && (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded p-2">
              <div className="flex-1 flex items-center justify-center p-2 bg-white rounded border border-gray-200">
                <input
                  type="time"
                  value={specialStart}
                  onChange={e => setSpecialStart(e.target.value)}
                  className="font-lexend font-light text-sm text-center bg-transparent border-none outline-none w-full"
                />
              </div>
              <span className="mx-1 text-gray-400">to</span>
              <div className="flex-1 flex items-center justify-center p-2 bg-white rounded border border-gray-200">
                <input
                  type="time"
                  value={specialEnd}
                  onChange={e => setSpecialEnd(e.target.value)}
                  className="font-lexend font-light text-sm text-center bg-transparent border-none outline-none w-full"
                />
              </div>
            </div>
          )}
          
          {calendarOption === 'Disable Specific Time Slots' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 flex items-center justify-center">
                <div className="grid grid-cols-2 grid-rows-2 gap-3 w-full">
                  {currentSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-xs cursor-pointer transition-colors w-full font-lexend ${
                        disabledSlots.includes(slot.id)
                          ? 'bg-red-100 border border-red-300 text-red-700'
                          : 'bg-gray-50 border border-gray-300 text-olive hover:bg-gray-100'
                      }`}
                      onClick={() => toggleSlotDisabled(slot.id)}
                    >
                      <span className="font-lexend font-light">{slot.start_time_formatted} - {slot.end_time_formatted}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs border border-gray-300 bg-gray-50 text-olive font-lexend font-light transition-colors duration-150 ${
                    disableSlotPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setDisableSlotPage(p => Math.max(0, p - 1))}
                  disabled={disableSlotPage === 0}
                >
                  <ChevronLeft size={12} /> Back
                </button>
                <span className="text-xs text-gray-500 font-lexend">
                  {disableSlotPage + 1} of {totalPages}
                </span>
                <button
                  type="button"
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs border border-gray-300 bg-gray-50 text-olive font-lexend font-light transition-colors duration-150 ${
                    disableSlotPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setDisableSlotPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={disableSlotPage === totalPages - 1}
                >
                  Next <ChevronRight size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
          <div className="text-xs font-medium mb-1 font-lexend">Legend:</div>
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="font-lexend">Closed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="font-lexend">Special Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-lexend">Disabled Time Slots</span>
            </div>
          </div>
        </div>
      </div>
      
      <button
        type="button"
        className={`w-full flex items-center text-sm justify-center gap-2 p-2 rounded focus:outline-none transition-colors duration-150 mt-2 border border-gray-300 font-lexend font-light
          ${!selectedDate || loading
            ? 'bg-gray-200 text-gray-400 opacity-60 cursor-not-allowed'
            : 'bg-gray-50 text-olive hover:bg-gray-200 hover:text-white cursor-pointer'}
        `}
        onClick={handleSaveChanges}
        disabled={!selectedDate || loading}
      >
        <Check size={14} /> {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default CalendarScheduleCard;