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
    specialRequests,
    occupiedTimeSlots,
    disabledTimeSlots,
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
    setSpecialRequests,
    
    // Functions
    isDateDisabled,
    isDateFullyBooked,
    isDateClosed,
    isDateSpecialHours,
    getSpecialHoursForDate,
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
        <div className="max-w-5xl w-full py-12 mt-20">
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
                  <div className="relative w-40">
                    <label className="block text-base font-extralight font-lexend mb-2">Time</label>
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
                              return selectedTime ? selectedTime.start_time_formatted : '';
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
                                    {slot.start_time_formatted}
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
                    <label className="block text-base font-extralight font-lexend mb-2">Guests</label>
                    <Select 
                      value={guestCount.toString()}
                      onValueChange={(value) => setGuestCount(parseInt(value))}
                    >
                      <SelectTrigger className="bg-transparent border-b border-white text-white w-full pr-8 py-2 text-base font-extralight font-lexend rounded-none border-t-0 border-l-0 border-r-0 focus:ring-0 focus:ring-offset-0 px-0 h-auto">
                        <SelectValue />
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
                  dayClassName={(day, { isDisabled, isFullyBooked, isSelected, isClosed, isSpecialHours }) => {
                    let className = 'transition-colors w-8 h-8 flex items-center justify-center font-lexend font-extralight relative';
                    
                    if (isClosed) {
                      className += ' text-[#5295bb] cursor-not-allowed';
                    } else if (isFullyBooked) {
                      className += ' text-[#D4847C] cursor-not-allowed';
                    } else if (isSelected && isSpecialHours) {
                      className += ' bg-[#f6f5c6] text-[#C5A572] font-semibold  rounded-full cursor-pointer';
                    } else if (isSelected) {
                      className += ' bg-[#f6f5c6] text-[#3f411a] font-semibold rounded-full cursor-pointer';
                    } else if (isSpecialHours) {
                      className += ' text-[#C5A572] hover:text-beige-dark cursor-pointer';
                    } else if (isDisabled) {
                      className += ' text-gray-400 cursor-not-allowed';
                    } else {
                      className += ' text-white hover:text-beige-dark cursor-pointer';
                    }
                    return className;
                  }}  
                />

                {/* Legend */}
                <div className="flex justify-center items-center space-x-6 mt-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#D4847C]"></div>
                    <span className="text-white font-extralight font-lexend text-sm">Fully Booked</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#C5A572]"></div>
                    <span className="text-white font-extralight font-lexend text-sm">Special Hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#5295bb]"></div>
                    <span className="text-white font-extralight font-lexend text-sm">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="flex flex-col justify-between h-full self-stretch w-full max-w-md ml-auto">
              <ReservationForm
                firstName={firstName}
                lastName={lastName}
                email={email}
                phone={phone}
                specialRequests={specialRequests}
                onFirstNameChange={setFirstName}
                onLastNameChange={setLastName}
                onEmailChange={setEmail}
                onPhoneChange={setPhone}
                onSpecialRequestsChange={setSpecialRequests}
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
              {specialRequests && (
                <div className="border-b border-white pb-2">
                  <span className="text-[#f6f5c6] text-sm font-extralight font-lexend">Special Requests:</span>
                  <p className="text-white font-extralight font-lexend">{specialRequests}</p>
                </div>
              )}
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