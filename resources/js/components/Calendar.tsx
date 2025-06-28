import React from 'react';

interface CalendarProps {
  selectedMonth: number;
  selectedYear: number;
  selectedDate: number | null;
  onDateSelect: (day: number) => void;
  isDateDisabled: (day: number) => boolean;
  isDateFullyBooked?: (day: number) => boolean;
  months: string[];
}

const Calendar: React.FC<CalendarProps> = ({
  selectedMonth,
  selectedYear,
  selectedDate,
  onDateSelect,
  isDateDisabled,
  isDateFullyBooked,
  months
}) => {
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isDisabled = isDateDisabled(day);
      const isFullyBooked = isDateFullyBooked ? isDateFullyBooked(day) : false;
      const isSelected = selectedDate === day;
      
      let className = 'cursor-pointer transition-colors h-8 flex items-center justify-center';
      
      if (isDisabled) {
        className += ' text-gray-500 cursor-not-allowed';
      } else if (isFullyBooked) {
        className += ' text-red-500 cursor-not-allowed relative';
      } else if (isSelected) {
        className += ' bg-[#f6f5c6] text-[#3f411a] rounded-lg px-2';
      } else {
        className += ' text-white hover:text-[#f6f5c6]';
      }
      
      days.push(
        <div
          key={day}
          onClick={() => !isDisabled && !isFullyBooked && onDateSelect(day)}
          className={className}
        >
          {day}
          {isFullyBooked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-0.5 bg-red-500"></div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="grid grid-cols-7 text-center gap-y-8 text-[#f6f5c6] text-lg">
      {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map((day) => (
        <div key={day} className="font-lexend font-extralight">{day}</div>
      ))}
      {renderCalendar()}
    </div>
  );
};

export default Calendar; 