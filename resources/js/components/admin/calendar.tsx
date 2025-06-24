import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

const CalendarComponent = () => {
  const [selectedMonth, setSelectedMonth] = useState('June');
  const [selectedTime, setSelectedTime] = useState('6:00 PM');
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const timeSlots = [
    { id: 1, time: '18:00', formatted: '6:00 PM' },
    { id: 2, time: '19:00', formatted: '7:00 PM' },
    { id: 3, time: '20:00', formatted: '8:00 PM' },
    { id: 4, time: '21:00', formatted: '9:00 PM' },
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
    
    // Disable past dates
    if (selectedDate < today) {
      return true;
    }
    
    // Disable weekends (Saturday = 6, Sunday = 0)
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return true;
    }
    
    return false;
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
      const isSelected = selectedDate === day;
      
      days.push(
        <div
          key={day}
          onClick={() => !isDisabled && handleDateSelect(day)}
          className={`cursor-pointer transition-colors h-8 flex items-center justify-center ${
            isDisabled
              ? 'text-gray-500 cursor-not-allowed'
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
    <div className="bg-[#3f411a] text-white rounded-2xl p-6 shadow-lg h-full">
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
              {timeSlots.map((slot) => (
                <SelectItem key={slot.id} value={slot.formatted} className="text-white hover:bg-[#f6f5c6] hover:text-[#3f411a] transition-colors duration-200 cursor-pointer font-lexend font-thin">
                  {slot.formatted}
                </SelectItem>
              ))}
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
        >
          Disable
        </button>
        <button
          type="button"
          className="flex-1 bg-[#f6f5c6] hover:bg-[#e8e6b3]/80 text-[#3f411a] py-3 px-4 rounded-md font-medium transition-colors font-lexend"
        >
          Enable
        </button>
      </div>
    </div>
  );
};

export default CalendarComponent; 