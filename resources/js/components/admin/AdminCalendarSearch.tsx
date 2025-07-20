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
  const [showMonthYearPanel, setShowMonthYearPanel] = useState(false);
  const [panelYear, setPanelYear] = useState(currentYear);
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
          className={`cursor-pointer transition-colors h-8 flex items-center justify-center rounded-lg font-lexend ${
            isSelected
              ? 'bg-olive text-beige'
              : 'text-[#3f411a] hover:bg-olive hover:text-beige'
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
      <div className="bg-background rounded p-8 shadow-lg max-w-lg w-full mx-4">
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
            className="p-2 rounded hover:bg-olive-light hover:text-beige-light transition-colors"
            aria-label="Previous Month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="relative mx-2 flex-1 flex justify-center">
            <button
              onClick={() => { setShowMonthYearPanel(!showMonthYearPanel); setPanelYear(currentYear); }}
              className="px-4 py-2 text-lg font-semibold text-[#3f411a] font-lexend rounded hover:bg-gray-300 transition-colors text-center whitespace-nowrap"
              style={{ minWidth: 140 }}
            >
              {currentMonth} {currentYear}
            </button>
            {showMonthYearPanel && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-3 bg-background border border-gray-400 rounded-lg shadow-lg z-10 min-w-[380px] p-4">
                <div className="relative mb-4">
                  <button onClick={() => setPanelYear(panelYear - 1)} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-olive-light hover:text-beige-light transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <span className="block text-xl font-semibold text-[#3f411a] font-lexend select-none text-center">{panelYear}</span>
                  <button onClick={() => setPanelYear(panelYear + 1)} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-olive-light hover:text-beige-light transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1 mb-4">
                  {months.map((month) => (
                    <button
                      key={month}
                      onClick={() => {
                        setCurrentMonth(month);
                        setCurrentYear(panelYear);
                        setShowMonthYearPanel(false);
                      }}
                      className={`flex items-center justify-center px-6 py-3 hover:bg-olive hover:text-beige cursor-pointer transition-colors rounded font-lexend text-olive text-sm ${month === currentMonth && panelYear === currentYear ? 'bg-olive text-beige  font-medium' : ''}`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowMonthYearPanel(false)} className="w-full mt-2 px-3 py-2 text-base text-olive font-lexend bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors cursor-pointer rounded">Close</button>
              </div>
            )}
          </div>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded hover:bg-olive-light hover:text-beige-light transition-colors"
            aria-label="Next Month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 text-center gap-y-2 mb-4">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-base font-medium text-gray-500 font-lexend">{day}</div>
          ))}
          {renderCalendar()}
        </div>
        {/* Select This Month Button (moved below grid) */}
        <div className="mb-4">
          <button
            onClick={handleSelectThisMonth}
            className="w-full bg-olive-light hover:bg-olive text-beige py-2 px-4 rounded-lg transition-colors font-lexend text-base"
          >
            Select This Month
          </button>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClearDate}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition-colors font-lexend text-base"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition-colors font-lexend text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarSearch; 