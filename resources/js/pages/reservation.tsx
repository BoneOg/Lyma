import Layout from '@/components/layout'
import { usePage } from '@inertiajs/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select'
import Calendar from '@/components/Calendar'
import ReservationForm from '@/components/ReservationForm'
import { useReservation } from '@/hooks/useReservation'
import { useNotification } from '@/contexts/NotificationContext'
import { useEffect } from 'react'

interface Props {
  timeSlots: any[]
  systemSettings: any
  [key: string]: any
}

export default function Reservation() {
  const { timeSlots, systemSettings, errors } = usePage<Props>().props
  
  const {
    // State
    selectedMonth,
    selectedYear,
    selectedTimeSlot,
    guestCount,
    selectedDate,
    firstName,
    lastName,
    email,
    phone,
    occupiedTimeSlots,
    showConfirmationModal,
    isBooking,
    months,
    years,
    
    // Setters
    setSelectedMonth,
    setSelectedYear,
    setSelectedTimeSlot,
    setGuestCount,
    setSelectedDate,
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    
    // Functions
    isDateDisabled,
    isDateFullyBooked,
    isTimeSlotAdminDisabled,
    handleDateSelect,
    formatSelectedDateTime,
    isFormValid,
    handleBookTable,
    handleConfirmBooking,
    handleCancelBooking,
  } = useReservation({ timeSlots, systemSettings, errors });

  const { showNotification } = useNotification();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('expired') === '1') {
        showNotification('Your reservation has expired. Please try booking again.', 'warning');
        // Optionally, remove the param from the URL after showing
        params.delete('expired');
        const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [showNotification]);

  return (
    <Layout>
      <div className="min-h-screen bg-[#3f411a] flex justify-center text-white px-4 pt-10">
        <div className="max-w-5xl w-full py-12">
          <h1 className="text-6xl font-extralight font-lexend text-beige mb-12">RESERVATION</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Content Container */}
            <div className="flex flex-col justify-start h-full">
              {/* Dropdowns + Calendar */}
              <div className="flex flex-col justify-start h-full">
                <div className="flex space-x-4 mb-10">
                  {/* Month */}
                  <div className="relative w-40">
                    <label className="block text-base font-extralight font-lexend mb-2">Month</label>
                    <Select 
                      value={selectedMonth.toString()}
                      onValueChange={(value) => {
                        setSelectedMonth(parseInt(value))
                        setSelectedDate(null) // Reset selected date when month changes
                      }}
                    >
                      <SelectTrigger className="bg-transparent border-b border-white text-white w-full pr-8 py-2 text-base font-extralight font-lexend rounded-none border-t-0 border-l-0 border-r-0 focus:ring-0 focus:ring-offset-0 px-0 h-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#3f411a] border-white text-white">
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
                    <label className="block text-base font-extralight font-lexend mb-2">Year</label>
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
                  <div className="relative w-36">
                    <label className="block text-base font-extralight font-lexend mb-2">Time</label>
                    <Select 
                      value={selectedTimeSlot?.toString() || ''}
                      onValueChange={(value) => setSelectedTimeSlot(parseInt(value))}
                    >
                      <SelectTrigger className="bg-transparent border-b border-white text-white w-full pr-8 py-2 text-base font-extralight font-lexend rounded-none border-t-0 border-l-0 border-r-0 focus:ring-0 focus:ring-offset-0 px-0 h-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#3f411a] border-white text-white">
                        {timeSlots.map((slot) => {
                          const isOccupied = occupiedTimeSlots.includes(slot.id)
                          const isAdminDisabled = isTimeSlotAdminDisabled(slot.id)
                          const isDisabled = isOccupied || isAdminDisabled
                          
                          return (
                            <SelectItem 
                              key={slot.id} 
                              value={slot.id.toString()} 
                              className={`bg-[#3f411a] font-extralight font-lexend text-white hover:bg-[#5a5d2a] focus:bg-[#5a5d2a] ${isDisabled ? 'text-gray-100' : ''}`}
                              disabled={isDisabled}
                            >
                              {slot.start_time_formatted} {
                                isOccupied ? '(Fully Booked)' : 
                                isAdminDisabled ? '(Unavailable)' : ''
                              }
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Guests */}
                  <div className="relative w-24">
                    <label className="block text-base font-extralight font-lexend mb-2">Guests</label>
                    <Select 
                      value={guestCount.toString()}
                      onValueChange={(value) => setGuestCount(parseInt(value))}
                    >
                      <SelectTrigger className="bg-transparent border-b border-white text-white w-full pr-8 py-2 text-base font-extralight font-lexend rounded-none border-t-0 border-l-0 border-r-0 focus:ring-0 focus:ring-offset-0 px-0 h-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#3f411a] border-white text-white">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem 
                            key={num} 
                            value={num.toString()} 
                            className="bg-[#3f411a] font-extralight font-lexend text-white hover:bg-[#5a5d2a] focus:bg-[#5a5d2a]"
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
            </div>

            {/* Right Form */}
            <div className="flex flex-col justify-between h-full self-stretch w-full max-w-md ml-auto">
              <ReservationForm
                firstName={firstName}
                lastName={lastName}
                email={email}
                phone={phone}
                onFirstNameChange={setFirstName}
                onLastNameChange={setLastName}
                onEmailChange={setEmail}
                onPhoneChange={setPhone}
                formatSelectedDateTime={formatSelectedDateTime}
              />

              <button
                onClick={handleBookTable}
                disabled={!isFormValid()}
                  className={`block w-full text-center font-extralight font-lexend py-4 mt-8 text-lg transition duration-200 ${
                  isFormValid()
                    ? 'bg-white text-[#3f411a] hover:bg-[#f6f5c6] cursor-pointer'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                Book a Table
              </button>
              
              {/* Display errors if any */}
              {errors?.general && (
                <div className="mt-6 p-4 bg-red-500 text-white rounded text-base font-extralight font-lexend">
                  {errors.general}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-[#3f411a] border-2 border-white p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-extralight font-lexend text-white mb-4">Confirm Reservation</h3>
            <p className="text-white mb-6 font-extralight font-lexend">Ready to book your table? Please confirm your details before proceeding.</p>
            
            <div className="space-y-4 mb-6">
              <div className="border-b border-white pb-2">
                <span className="text-[#f6f5c6] text-sm font-extralight font-lexend">Date & Time:</span>
                <p className="text-white font-extralight font-lexend">{formatSelectedDateTime()}</p>
              </div>
              <div className="border-b border-white pb-2">
                <span className="text-[#f6f5c6] text-sm font-extralight font-lexend">Guest:</span>
                <p className="text-white font-extralight font-lexend">{firstName} {lastName}</p>
              </div>
              <div className="border-b border-white pb-2">
                <span className="text-[#f6f5c6] text-sm font-extralight font-lexend">Contact:</span>
                <p className="text-white font-extralight font-lexend">{email}</p>
                <p className="text-white font-extralight font-lexend">{phone}</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleConfirmBooking}
                disabled={isBooking}
                className={`flex-1 py-3 font-extralight font-lexend transition duration-200 ${
                  isBooking 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-white text-[#3f411a] hover:bg-[#f6f5c6]'
                }`}
              >
                {isBooking ? 'Booking...' : 'Yes, Book Now'}
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={isBooking}
                className={`flex-1 border border-white py-3 font-extralight font-lexend transition duration-200 ${
                  isBooking
                    ? 'bg-transparent text-gray-400 cursor-not-allowed'
                    : 'bg-transparent text-white hover:bg-white hover:text-[#3f411a]'
                }`}
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}