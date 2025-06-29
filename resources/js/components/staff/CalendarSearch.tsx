import React, { useState } from 'react';

interface CalendarSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: string | null) => void;
  selectedDate: string | null;
  onMonthSelect?: (month: string, year: number) => void;
  selectedMonth?: string | null;
  selectedYear?: number | null;
}

const CalendarSearch: React.FC<CalendarSearchProps> = ({ 
  isOpen, 
  onClose, 
  onDateSelect, 
  selectedDate,
  onMonthSelect,
  selectedMonth,
  selectedYear
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (selectedDate) {
      return new Date(selectedDate).toLocaleString('default', { month: 'long' });
    }
    return new Date().toLocaleString('default', { month: 'long' });
  });
  const [currentYear, setCurrentYear] = useState(() => {
    if (selectedDate) {
      return new Date(selectedDate).getFullYear();
    }
    return new Date().getFullYear();
  });
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month: string, year: number) => {
    const monthIndex = months.indexOf(month);
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: string, year: number) => {
    const monthIndex = months.indexOf(month);
    return new Date(year, monthIndex, 1).getDay();
  };

  const formatDate = (day: number) => {
    const monthIndex = months.indexOf(currentMonth);
    const date = new Date(currentYear, monthIndex, day);
    // Ensure we get the correct date by using UTC methods to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const handleDateClick = (day: number) => {
    const dateString = formatDate(day);
    console.log('Selected date:', dateString);
    onDateSelect(dateString);
    onClose();
  };

  const handleClearDate = () => {
    onDateSelect(null);
    onClose();
  };

  const handlePreviousMonth = () => {
    const currentMonthIndex = months.indexOf(currentMonth);
    if (currentMonthIndex === 0) {
      setCurrentMonth('December');
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(months[currentMonthIndex - 1]);
    }
  };

  const handleNextMonth = () => {
    const currentMonthIndex = months.indexOf(currentMonth);
    if (currentMonthIndex === 11) {
      setCurrentMonth('January');
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(months[currentMonthIndex + 1]);
    }
  };

  const handleMonthSelect = (month: string) => {
    setCurrentMonth(month);
    setShowMonthDropdown(false);
  };

  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    setShowYearDropdown(false);
  };

  const handleSelectThisMonth = () => {
    // Use the currently displayed month and year instead of the current date
    const currentMonthName = currentMonth;
    const currentYearNum = currentYear;
    
    // Call onMonthSelect if provided, otherwise call onDateSelect with null
    if (onMonthSelect) {
      onMonthSelect(currentMonthName, currentYearNum);
    } else {
      onDateSelect(null); // Clear any specific date selection
    }
    onClose();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDate(day);
      const isSelected = selectedDate === dateString;
      
      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`cursor-pointer transition-colors h-8 flex items-center justify-center rounded-lg ${
            isSelected
              ? 'bg-[#f6f5c6] text-[#3f411a]'
              : 'text-[#3f411a] hover:bg-[#f6f5c6] hover:text-[#3f411a]'
          }`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  // Generate years (current year + next 5 years)
  const currentYearNum = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYearNum + i);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg max-w-sm w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-[#3f411a] font-lexend">Select Date</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Month/Year Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-[#3f411a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2">
            {/* Month Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                className="px-3 py-1 text-lg font-semibold text-[#3f411a] font-lexend hover:bg-gray-100 rounded-lg transition-colors"
              >
                {currentMonth}
                <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showMonthDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                  {months.map((month) => (
                    <button
                      key={month}
                      onClick={() => handleMonthSelect(month)}
                      className={`block w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors font-lexend ${
                        month === currentMonth ? 'bg-[#f6f5c6] text-[#3f411a]' : 'text-[#3f411a]'
                      }`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Year Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowYearDropdown(!showYearDropdown)}
                className="px-3 py-1 text-lg font-semibold text-[#3f411a] font-lexend hover:bg-gray-100 rounded-lg transition-colors"
              >
                {currentYear}
                <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showYearDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[80px]">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      className={`block w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors font-lexend ${
                        year === currentYear ? 'bg-[#f6f5c6] text-[#3f411a]' : 'text-[#3f411a]'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-[#3f411a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Select This Month Button */}
        <div className="mb-4">
          <button
            onClick={handleSelectThisMonth}
            className="w-full bg-[#f6f5c6] hover:bg-[#e8e6b3] text-[#3f411a] py-2 px-4 rounded-lg transition-colors font-lexend text-sm"
          >
            Select This Month
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 text-center gap-y-2 mb-4">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-sm font-medium text-gray-500 font-lexend">{day}</div>
          ))}
          {renderCalendar()}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {selectedDate && (
            <button
              onClick={handleClearDate}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition-colors font-lexend"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-[#f6f5c6] hover:bg-[#e8e6b3] text-[#3f411a] py-2 px-4 rounded-lg transition-colors font-lexend"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarSearch; 