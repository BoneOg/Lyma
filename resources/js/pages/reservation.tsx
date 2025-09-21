import Layout from '@/components/layout'
import PatternBackground from '@/components/PatternBackground'
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
import SEO from '@/components/SEO'
import { Phone, Instagram } from 'lucide-react'

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
    isTimeSlotFullyBooked,
    handleDateSelect,
    formatSelectedDateTime,
    isFormValid,
    handleConfirmBooking,
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
    <>
      <SEO 
        title="Reservation - Book Your Table at Lyma Restaurant"
        description="Reserve your table at Lyma Restaurant in General Luna, Siargao. Experience exceptional fine dining with Chef Marc's culinary masterpiece. Book online for the best dining experience."
        keywords="Lyma reservation, book table, Siargao restaurant, General Luna dining, fine dining reservation, Chef Marc restaurant, online booking"
        image="/assets/images/hero.webp"
        type="website"
      />
      <Layout>
        <div className="min-h-screen bg-[#3f411a] relative overflow-hidden flex justify-center text-white px-4 pt-10">
          <PatternBackground overrides={{ grapes: 'absolute -bottom-10 left-2 lg:left-6 w-22 lg:w-36 rotate-[-1deg] -translate-x-4' }} />
          <div className="max-w-5xl w-full py-6 sm:py-8 md:py-12 mt-16 sm:mt-18 md:mt-20 lg:mt-2 px-4 sm:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-thin tracking-wider font-lexend text-beige mb-6 sm:mb-8 md:mb-12 -ml-[1px] md:-ml-[8px]">RESERVATION</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
              {/* Left Content Container */}
              <div className="flex flex-col justify-start h-full">
                {/* Dropdowns + Calendar */}
                <div className="flex flex-col justify-start h-full">
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8 md:mb-10">
                    {/* Month */}
                    <div className="relative w-full sm:w-40">
                      <label className="block text-sm sm:text-base text-beige font-light font-lexend mb-2">Month</label>
                      <Select 
                        value={selectedMonth.toString()}
                        onValueChange={(value) => {
                          setSelectedMonth(parseInt(value))
                          setSelectedDate(null) // Reset selected date when month changes
                        }}
                      >
                        <SelectTrigger className="bg-transparent border-b border-white text-white w-full pr-8 py-2 text-sm sm:text-base font-extralight font-lexend rounded-none border-t-0 border-l-0 border-r-0 focus:ring-0 focus:ring-offset-0 px-0 h-auto">
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
                    <div className="relative w-full sm:w-28">
                      <label className="block text-sm sm:text-base text-beige font-light font-lexend mb-2">Year</label>
                      <Select
                        value={selectedYear.toString()}
                        onValueChange={(value) => setSelectedYear(parseInt(value))}
                      >
                        <SelectTrigger className="bg-transparent border-b border-white text-white w-full pr-8 py-2 text-sm sm:text-base font-extralight font-lexend rounded-none border-t-0 border-l-0 border-r-0 focus:ring-0 focus:ring-offset-0 px-0 h-auto">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#3f411a] border-white text-white">
                          {years.map((year) => (
                            <SelectItem
                              key={year}
                              value={year.toString()}
                              className="bg-[#3f411a] font-extralight font-lexend text-white hover:bg-[#5d2a] focus:bg-[#5a5d2a]"
                            >
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Time */}
                    <div className="relative w-full sm:w-40">
                      <label className="block text-sm sm:text-base text-beige font-light font-lexend mb-2">Time</label>
                      <Select 
                        value={selectedTimeSlot?.toString() || ''}
                        onValueChange={(value) => {
                          if (value === 'special-hours') {
                            setSelectedTimeSlot('special-hours');
                          } else {
                            setSelectedTimeSlot(parseInt(value));
                          }
                        }}
                        disabled={!selectedDate}
                      >
                        <SelectTrigger className={`bg-transparent border-b border-white text-white w-full font-extralight font-lexend rounded-none border-t-0 border-l-0 border-r-0 focus:ring-0 focus:ring-offset-0 px-0 h-auto text-left ${
                          selectedTimeSlot === 'special-hours' ? 'py-3 text-xs' : 'py-2 text-sm sm:text-base'
                        } ${!selectedDate ? 'opacity-50 cursor-not-allowed' : ''}`} style={{ minHeight: '2.5rem' }}>
                          <SelectValue>
                            {(() => {
                              if (!selectedDate) {
                                return 'Select a date first';
                              } else if (selectedTimeSlot === 'special-hours') {
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
                                const isAdminDisabled = isTimeSlotAdminDisabled(slot.id)
                                const isFullyBooked = isTimeSlotFullyBooked(slot.id)
                                const isDisabled = isOccupied || isAdminDisabled || isFullyBooked
                                
                                return (
                                  <SelectItem 
                                    key={slot.id} 
                                    value={slot.id.toString()} 
                                    className={`bg-[#3f411a] font-extralight font-lexend focus:bg-[#5a5d2a] relative ${isDisabled ? 'cursor-not-allowed' : 'hover:bg-[#5a5d2a]'} ${isOccupied ? '!opacity-100' : ''} ${isAdminDisabled ? '!opacity-100' : ''} ${isFullyBooked ? '!opacity-100' : ''}`}
                                    disabled={isDisabled}
                                  >
                                    <span className={isOccupied ? 'text-[#D4847C]' : isAdminDisabled ? 'text-[#D4847C]' : isFullyBooked ? 'text-[#6B7A5E]' : 'text-white'}>
                                      {slot.start_time_formatted} - {slot.end_time_formatted}
                                    </span>
                                    {isOccupied && (
                                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#D4847C] rounded-full opacity-100"></div>
                                    )}
                                    {isAdminDisabled && !isOccupied && (
                                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#D4847C] rounded-full opacity-100"></div>
                                    )}
                                    {isFullyBooked && !isOccupied && !isAdminDisabled && (
                                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#6B7A5E] rounded-full opacity-100"></div>
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
                    <div className="relative w-full sm:w-24">
                      <label className="block text-sm sm:text-base text-beige font-light font-lexend mb-2">Guests</label>
                      <Select 
                        value={guestCount.toString()}
                        onValueChange={(value) => setGuestCount(parseInt(value))}
                      >
                        <SelectTrigger className="bg-transparent border-b border-white text-white w-full pr-8 py-2 text-sm sm:text-base font-extralight font-lexend rounded-none border-t-0 border-l-0 border-r-0 focus:ring-0 focus:ring-offset-0 px-0 h-auto">
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
                    className="grid grid-cols-7 text-center gap-y-4 sm:gap-y-6 md:gap-y-7 text-white text-sm sm:text-base md:text-lg"
                    weekdayClassName={() => 'h-6 sm:h-7 md:h-8 flex items-center justify-center font-lexend text-beige font-light tracking-wide opacity-80 text-xs sm:text-sm md:text-base'}
                    dayClassName={(day, { isDisabled, isFullyBooked, isSelected, isClosed, isSpecialHours }) => {
                      let className = 'transition-colors h-6 sm:h-7 md:h-8 w-full flex items-center justify-center font-lexend font-light relative text-xs sm:text-sm md:text-base';
                      
                      if (isClosed) {
                        className += ' text-[#D4847C] cursor-not-allowed';
                      } else if (isFullyBooked) {
                        className += ' text-[#6B7A5E] cursor-not-allowed';
                      } else if (isSelected && isSpecialHours) {
                        className += ' text-[#C5A572] font-semibold';
                      } else if (isSelected) {
                        className += ' text-[#3f411a] font-semibold';
                      } else if (isSpecialHours) {
                        className += ' text-[#C5A572] hover:text-beige-dark cursor-pointer';
                      } else if (isDisabled) {
                        className += ' text-gray-400 cursor-not-allowed';
                      } else {
                        className += ' text-white hover:text-beige-dark cursor-pointer';
                      }
                      return className;
                    }}
                    animatedSelection
                  />

                  {/* Legend */}
                  <div className="flex flex-row sm:flex-row justify-center items-center space-x-6 space-y-0 sm:space-y-0 sm:space-x-4 md:space-x-6 mt-4 sm:mt-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#6B7A5E]"></div>
                      <span className="text-white/80 font-light font-lexend text-[10px] sm:text-sm">Fully Booked</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#C5A572]"></div>
                      <span className="text-white/80 font-light font-lexend text-[10px] sm:text-sm">Special Hours</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#D4847C]"></div>
                      <span className="text-white/80 font-light font-lexend text-[10px] sm:text-sm">Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Form */}
              <div className="flex flex-col justify-between h-full self-stretch w-full max-w-md mx-auto lg:ml-auto">
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
                  onClick={handleConfirmBooking}
                  disabled={!isFormValid() || isBooking}
                  className={`block w-full text-center font-light font-lexend py-3 sm:py-4 mt-6 sm:mt-8 text-base sm:text-lg transition duration-200 ${
                    !isFormValid() || isBooking
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed tracking-wider'
                      : 'bg-beige-dark text-[#3f411a] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg cursor-pointer tracking-wider'
                  }`}
                >
                  {isBooking ? 'Booking...' : 'BOOK A TABLE'}
                </button>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="mt-6 sm:mt-16 md:mt-8 max-w-4xl mx-auto text-center">
              <div className="p-6 sm:p-8 md:p-10">
                {/* Heading with underline */}
                <div className="mb-8">
                  <h2 className="text-beige font-lexend font-light text-lg sm:text-xl md:text-2xl tracking-wide uppercase relative inline-block">
                    Special Reservations
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-px bg-beige"></div>
                  </h2>
                </div>

                {/* Body content */}
                <div className="space-y-6">
                  <p className="text-beige font-lexend font-extralight text-sm sm:text-base leading-relaxed">
                    For intimate dinners, family gatherings, or group celebrations, our team ensures every visit is memorable.
                  </p>
                  
                  <p className="text-beige font-lexend font-extralight text-sm sm:text-base leading-relaxed">
                    To modify or cancel a booking — or if your party exceeds 12 guests — please reach us directly:
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-beige" />
                      <span className="text-beige font-lexend font-extralight text-sm sm:text-base">
                        +63 929 756 1379
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Instagram className="w-4 h-4 text-beige" />
                      <span className="text-beige font-lexend font-extralight text-sm sm:text-base">
                        @lymasiargao
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-beige font-lexend font-extralight text-sm sm:text-base leading-relaxed">
                    Advance reservations are highly recommended so we may prepare the best dining experience for you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}