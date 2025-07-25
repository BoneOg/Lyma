import React from 'react';

interface CalendarProps {
  selectedMonth: number;
  selectedYear: number;
  selectedDate: number | null;
  onDateSelect: (day: number) => void;
  isDateDisabled: (day: number) => boolean;
  isDateFullyBooked?: (day: number) => boolean;
  isDateClosed?: (day: number) => boolean;
  isDateSpecialHours?: (day: number) => boolean;
  months: string[];
  className?: string; // NEW: for root
  dayClassName?: (day: number, opts: { isDisabled: boolean; isFullyBooked: boolean; isSelected: boolean; isClosed: boolean; isSpecialHours: boolean }) => string; // NEW: for day cell
  weekdayLabels?: string[]; // NEW
  weekdayClassName?: (weekday: string, index: number) => string; // NEW
}

const Calendar: React.FC<CalendarProps> = ({
  selectedMonth,
  selectedYear,
  selectedDate,
  onDateSelect,
  isDateDisabled,
  isDateFullyBooked,
  isDateClosed,
  isDateSpecialHours,
  months,
  className = 'grid grid-cols-7 text-center gap-y-8 text-white text-lg', // default
  dayClassName,
  weekdayLabels = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'], // NEW default
  weekdayClassName,
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
      const isClosed = isDateClosed ? isDateClosed(day) : false;
      const isSpecialHours = isDateSpecialHours ? isDateSpecialHours(day) : false;
      const isSelected = selectedDate === day;
      
      let defaultClassName = 'cursor-pointer transition-colors h-8 flex items-center justify-center font-lexend font-light';
      if (isClosed) {
        defaultClassName += ' text-gray-400 cursor-not-allowed';
      } else if (isFullyBooked) {
        defaultClassName += ' text-[#D4847C] cursor-not-allowed relative';
      } else if (isSelected) {
        defaultClassName += ' bg-olive text-beige-light rounded px-2';
      } else if (isDisabled) {
        defaultClassName += ' text-gray-400 cursor-not-allowed';
      } else {
        defaultClassName += ' text-white hover:text-beige-dark';
      }
      // Allow override
      const cellClass = dayClassName
        ? dayClassName(day, { isDisabled, isFullyBooked, isSelected, isClosed, isSpecialHours })
        : defaultClassName;
      days.push(
        <div
          key={day}
          onClick={() => !isDisabled && !isFullyBooked && !isClosed && onDateSelect(day)}
          className={cellClass}
        >
          {day}
          {isFullyBooked && !isDisabled && !isClosed && (
            <div className="absolute -top-1 left-8 w-2.5 h-2.5 bg-[#D4847C] rounded-full pointer-events-none"></div>
          )}
          {isSpecialHours && !isDisabled && !isClosed && !isFullyBooked && (
            <div className="absolute -top-1 left-8 w-2.5 h-2.5 bg-[#C5A572] rounded-full pointer-events-none"></div>
          )}
          {isClosed && (
            <div className="absolute -top-1 left-8 w-2.5 h-2.5 bg-[#5295bb] rounded-full pointer-events-none"></div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className={className}>
      {weekdayLabels.map((day, idx) => (
        <div key={day} className={weekdayClassName ? weekdayClassName(day, idx) : 'font-lexend font-medium'}>{day}</div>
      ))}
      {renderCalendar()}
    </div>
  );
};

export default Calendar; 