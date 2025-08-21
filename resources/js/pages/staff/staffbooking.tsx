import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import StaffLayout from '@/components/staff/StaffLayout';
import ReservationTable from '@/components/staff/StaffReservationTable';
import QuickReservation from '@/components/staff/StaffQuickReservation';
import { Download, Calendar, X } from 'lucide-react';

interface Props {
  timeSlots: any[];
  systemSettings: any;
  [key: string]: any;
}

// Define allowed statuses
const cardStatuses = ['confirmed', 'completed', 'cancelled', 'all'] as const;
type CardStatus = typeof cardStatuses[number];

const cardData: { label: string; color: string; activeColor: string; status: CardStatus }[] = [
  { 
    label: 'CONFIRMED\nRESERVATION', 
    color: 'border-primary-light bg-primary-light text-primary',
    activeColor: 'border-olive bg-olive text-white ring-2 ring-primary ring-offset-2',
    status: 'confirmed' 
  },
  { 
    label: 'COMPLETED\nRESERVATION', 
    color: 'border-primary-light bg-primary-light text-primary',
    activeColor: 'border-olive bg-olive text-white ring-2 ring-primary ring-offset-2',
    status: 'completed' 
  },
  { 
    label: 'CANCELLED\nRESERVATION', 
    color: 'border-primary-light bg-primary-light text-primary',
    activeColor: 'border-olive bg-olive text-white ring-2 ring-primary ring-offset-2',
    status: 'cancelled' 
  },
  { 
    label: 'ALL\nRESERVATION', 
    color: 'border-primary-light bg-primary-light text-primary',
    activeColor: 'border-olive bg-olive text-white ring-2 ring-primary ring-offset-2',
    status: 'all' 
  },
];

const StaffBooking: React.FC = () => {
  const { timeSlots, systemSettings } = usePage<Props>().props;
  const [counts, setCounts] = useState<Record<CardStatus, number>>({
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    all: 0,
  });
  const [activeStatus, setActiveStatus] = useState<CardStatus>('all');
  const [showQuickReservation, setShowQuickReservation] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [isDownloading, setIsDownloading] = useState(false);

  const currentYear = new Date().getFullYear();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const fetchCounts = () => {
    fetch('/staff/api/reservation-counts')
      .then(res => res.json())
      .then(data => {
        setCounts({
          confirmed: data.confirmed || 0,
          completed: data.completed || 0,
          cancelled: data.cancelled || 0,
          all: data.all || 0,
        });
      })
      .catch(error => {
        console.error('Error fetching counts:', error);
      });
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleReservationUpdate = () => {
    // Refresh the counts when a reservation is updated
    fetchCounts();
  };

  const handleDownload = () => {
    setShowDownloadModal(true);
  };

  const handleDownloadConfirm = async () => {
    // Create date in local timezone (Manila) and format it properly
    const selectedDate = new Date(currentYear, selectedMonth, selectedDay);
    
    // Format the date as YYYY-MM-DD in local timezone (avoiding UTC conversion)
    const year = currentYear;
    const month = String(selectedMonth + 1).padStart(2, '0'); // Add 1 because months are 0-indexed
    const day = String(selectedDay).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    setIsDownloading(true);
    
    try {
      const response = await fetch('/staff/api/download-reservations-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ date: formattedDate }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reservations_${formattedDate}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setShowDownloadModal(false);
      } else {
        console.error('Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadCancel = () => {
    setShowDownloadModal(false);
  };

  return (
    <StaffLayout>
      <div className="flex flex-col items-center px-6 sm:px-8 md:px-10 lg:px-12 xl:px-12 2xl:px-12 py-6 sm:py-8 md:py-10 lg:py-10 xl:py-10 2xl:py-10">
        <p className="text-olive text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-7xl font-thin font-lexend text-center">BOOKING</p>
        <div className="w-32 sm:w-40 md:w-44 lg:w-48 xl:w-50 2xl:w-50 h-[1px] bg-olive mt-4 sm:mt-5 md:mt-6 lg:mt-6 xl:mt-6 2xl:mt-6" style={{ opacity: 0.5 }} />
      </div>
      {/* Horizontal clickable cards */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-12 mb-6 sm:mb-7 md:mb-8 lg:mb-8 xl:mb-8 2xl:mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-6">
          {cardData.map((card, idx) => (
            <button
              key={card.label}
              className={`border-2 p-3 sm:p-4 md:p-4 lg:p-5 xl:p-6 2xl:p-7 font-lexend font-light text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
                activeStatus === card.status
                  ? card.activeColor
                  : card.color
              }`}
              onClick={() => setActiveStatus(card.status)}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <span className="leading-tight">{card.label.split('\n').map((line, i) => (<React.Fragment key={i}>{line}<br /></React.Fragment>))}</span>
                <span className="mt-1 sm:mt-2 md:mt-2 lg:mt-3 xl:mt-3 2xl:mt-4 text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold tracking-wide">{counts[card.status]}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Bottom row - Full width container */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-12 relative">
        <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-6 xl:mb-6 2xl:mb-6"></div>
        <ReservationTable 
          status={activeStatus} 
          onReservationUpdate={handleReservationUpdate}
          endpointPrefix="/staff"
          timeSlots={timeSlots}
          systemSettings={systemSettings}
        />

        {/* Floating Download Button - fixed to viewport */}
        <button
          onClick={handleDownload}
          className="fixed bottom-4 sm:bottom-6 md:bottom-6 lg:bottom-4 xl:bottom-4 2xl:bottom-4 left-4 sm:left-6 md:left-6 lg:left-4 xl:left-4 2xl:left-4 w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 lg:w-16 lg:h-16 xl:w-16 xl:h-16 2xl:w-16 2xl:h-16 bg-olive text-beige rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-50"
          title="Download Reservations PDF"
        >
          <Download className="w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-8 xl:h-8 2xl:w-8 2xl:h-8" />
        </button>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-4 md:p-4 lg:p-4 xl:p-4 2xl:p-4">
          <div className="bg-white rounded-none p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-8 max-w-sm sm:max-w-sm md:max-w-md lg:max-w-md xl:max-w-md 2xl:max-w-md w-full mx-2 sm:mx-3 md:mx-4 lg:mx-4 xl:mx-4 2xl:mx-4">
            <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6 lg:mb-6 xl:mb-6 2xl:mb-6">
              <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-3xl 2xl:text-3xl font-lexend font-light text-olive">Download Reservations</h2>
              <button
                onClick={handleDownloadCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 xl:w-6 xl:h-6 2xl:w-6 2xl:h-6" />
              </button>
            </div>

            <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-6 xl:mb-6 2xl:mb-6">
              <p className="text-gray-600 mb-3 sm:mb-4 md:mb-4 lg:mb-4 xl:mb-4 2xl:mb-4 text-sm sm:text-sm md:text-sm lg:text-base xl:text-base 2xl:text-base">Select a date to download reservations PDF</p>
              
              {/* Month Selection */}
              <div className="mb-3 sm:mb-4 md:mb-4 lg:mb-4 xl:mb-4 2xl:mb-4">
                <label className="block text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-medium text-gray-700 mb-1 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-2 2xl:mb-2">Month:</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full p-2 sm:p-2 md:p-3 lg:p-3 xl:p-3 2xl:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent text-sm sm:text-sm md:text-sm lg:text-base xl:text-base 2xl:text-base"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
              </div>

              {/* Day Selection */}
              <div className="mb-3 sm:mb-4 md:mb-4 lg:mb-4 xl:mb-4 2xl:mb-4">
                <label className="block text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-medium text-gray-700 mb-1 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-2 2xl:mb-2">Day:</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(Number(e.target.value))}
                  className="w-full p-2 sm:p-2 md:p-3 lg:p-3 xl:p-3 2xl:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent text-sm sm:text-sm md:text-sm lg:text-base xl:text-base 2xl:text-base"
                >
                  {Array.from({ length: getDaysInMonth(selectedMonth, currentYear) }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-50 p-3 sm:p-3 md:p-4 lg:p-4 xl:p-4 2xl:p-4 rounded-lg">
                <p className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-gray-600">
                  <strong>Selected Date:</strong> {months[selectedMonth]} {selectedDay}, {currentYear}
                </p>
              </div>
            </div>

            <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-6 xl:mb-6 2xl:mb-6">
              <p className="text-gray-700 font-medium text-sm sm:text-sm md:text-sm lg:text-base xl:text-base 2xl:text-base">
                Will you download the PDF of reservations for {months[selectedMonth]} {selectedDay}, {currentYear}?
              </p>
            </div>

            <div className="flex gap-2 sm:gap-3 md:gap-3 lg:gap-3 xl:gap-3 2xl:gap-3">
              <button
                onClick={handleDownloadCancel}
                className="flex-1 px-3 py-3 sm:px-3 sm:py-3 md:px-4 md:py-4 lg:px-4 lg:py-4 xl:px-4 xl:py-4 2xl:px-4 2xl:py-4 border border-gray-300 text-gray-700 rounded-none hover:bg-gray-50 transition-colors font-lexend text-sm sm:text-sm md:text-sm lg:text-base xl:text-base 2xl:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadConfirm}
                disabled={isDownloading}
                className="flex-1 px-3 py-3 sm:px-3 sm:py-3 md:px-4 md:py-4 lg:px-4 lg:py-4 xl:px-4 xl:py-4 2xl:px-4 2xl:py-4 bg-olive text-beige rounded-none hover:bg-olive-dark transition-colors font-lexend disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-sm md:text-sm lg:text-base xl:text-base 2xl:text-base"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-4 lg:w-4 xl:h-4 xl:w-4 2xl:h-4 2xl:w-4 border-b-2 border-beige mr-2"></div>
                    <span className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm">Downloading...</span>
                  </>
                ) : (
                  'Download PDF'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </StaffLayout>
  );
};

export default StaffBooking; 