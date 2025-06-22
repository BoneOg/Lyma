import Layout from '@/components/layout'
import { router, usePage } from '@inertiajs/react'
import { useState } from 'react'

interface TimeSlot {
  id: number
  start_time: string
  end_time: string
  formatted_time: string
  start_time_formatted: string
}

interface SystemSettings {
  max_advance_booking_days: number
}

interface Props {
  timeSlots: TimeSlot[]
  systemSettings: SystemSettings
  [key: string]: any // Add index signature to satisfy PageProps constraint
}

export default function Reservation() {
  const { timeSlots, systemSettings, errors } = usePage<Props>().props
  
  // Form state
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear] = useState(new Date().getFullYear())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(
    timeSlots.length > 0 ? timeSlots[0].id : null
  )
  const [guestCount, setGuestCount] = useState(1)
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Date calculations
  const today = new Date()
  const maxDate = new Date(today.getTime() + (systemSettings.max_advance_booking_days * 24 * 60 * 60 * 1000))

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1 // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  }

  const isDateDisabled = (day: number) => {
    const dateToCheck = new Date(selectedYear, selectedMonth, day)

    // Reset time to midnight for accurate date-only comparison
    dateToCheck.setHours(0, 0, 0, 0)

    const todayMidnight = new Date()
    todayMidnight.setHours(0, 0, 0, 0)

    return dateToCheck <= todayMidnight || dateToCheck > maxDate
  }

  const formatSelectedDateTime = () => {
    const parts = []
    
    // Add date if selected
    if (selectedDate) {
      const date = new Date(selectedYear, selectedMonth, selectedDate)
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
      const monthName = months[selectedMonth]
      parts.push(`${monthName} ${selectedDate} (${dayName})`)
    }
    
    // Add time if selected
    if (selectedTimeSlot) {
      const selectedTime = timeSlots.find(slot => slot.id === selectedTimeSlot)
      if (selectedTime) {
        parts.push(selectedTime.start_time_formatted)
      }
    }
    
    // Always add guest count
    parts.push(`${guestCount} Guest${guestCount > 1 ? 's' : ''}`)
    
    // If no date or time selected, show placeholder
    if (!selectedDate && !selectedTimeSlot) {
      return 'Select date and time'
    }
    
    return parts.join(', ')
  }

  const handleNameInput = (value: string, setter: (value: string) => void) => {
    // Only allow letters and spaces
    const nameRegex = /^[a-zA-Z\s]*$/
    if (nameRegex.test(value)) {
      setter(value)
    }
  }

  const handleEmailInput = (value: string) => {
    setEmail(value)
  }

  const handlePhoneInput = (value: string) => {
    // Only allow numbers, spaces, hyphens, and plus signs
    const phoneRegex = /^[\d\s\-\+]*$/
    if (phoneRegex.test(value)) {
      setPhone(value)
    }
  }

  const isFormValid = () => {
    return selectedDate && 
           selectedTimeSlot && 
           firstName.trim() && 
           lastName.trim() && 
           email.trim() && 
           phone.trim() &&
           email.includes('@') &&
           email.includes('.')
  }

  const handleBookTable = () => {
    if (!isFormValid()) return

    const reservationData = {
      guest_first_name: firstName.trim(),
      guest_last_name: lastName.trim(),
      guest_email: email.trim(),
      guest_phone: phone.trim(),
      reservation_date: `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`,
      time_slot_id: selectedTimeSlot,
      guest_count: guestCount
    }

    router.post('/reservations', reservationData)
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className=""></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isDisabled = isDateDisabled(day)
      const isSelected = selectedDate === day
      
      days.push(
        <div
          key={day}
          onClick={() => !isDisabled && setSelectedDate(day)}
          className={`cursor-pointer transition-colors ${
            isDisabled
              ? 'text-gray-500 cursor-not-allowed'
              : isSelected
              ? 'bg-[#f6f5c6] text-[#3f411a] rounded-full px-3 py-1'
              : 'text-white hover:text-[#f6f5c6]'
          }`}
        >
          {day}
        </div>
      )
    }

    return days
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#3f411a] flex justify-center text-white px-4 pt-10">
        <div className="max-w-4xl w-full py-12">
          <h1 className="text-5xl font-serif mb-10">RESERVATION</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left Content Container */}
            <div className="flex flex-col justify-start h-full">
              {/* Dropdowns + Calendar */}
              <div className="flex flex-col justify-start h-full">
                <div className="flex space-x-6 mb-8">
                  {/* Month */}
                  <div className="relative w-40">
                    <label className="block text-sm mb-1">Month</label>
                    <select 
                      value={selectedMonth}
                      onChange={(e) => {
                        setSelectedMonth(parseInt(e.target.value))
                        setSelectedDate(null) // Reset selected date when month changes
                      }}
                      className="bg-transparent border-b border-white text-white appearance-none w-full pr-8 py-1"
                    >
                      {months.map((month, index) => (
                        <option key={month} value={index} className="bg-[#3f411a]">
                          {month}
                        </option>
                      ))}
                    </select>
                    <img
                      src="/assets/ui/drop.webp"
                      alt="Dropdown"
                      className="w-4 h-4 absolute right-0 top-[34px] pointer-events-none"
                    />
                  </div>

                  {/* Time */}
                  <div className="relative w-40">
                    <label className="block text-sm mb-1">Time</label>
                    <select 
                      value={selectedTimeSlot || ''}
                      onChange={(e) => setSelectedTimeSlot(parseInt(e.target.value))}
                      className="bg-transparent border-b border-white text-white appearance-none w-full pr-8 py-1"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot.id} value={slot.id} className="bg-[#3f411a]">
                          {slot.start_time_formatted}
                        </option>
                      ))}
                    </select>
                    <img
                      src="/assets/ui/drop.webp"
                      alt="Dropdown"
                      className="w-4 h-4 absolute right-0 top-[34px] pointer-events-none"
                    />
                  </div>

                  {/* Guests */}
                  <div className="relative w-40">
                    <label className="block text-sm mb-1">Guests</label>
                    <select 
                      value={guestCount}
                      onChange={(e) => setGuestCount(parseInt(e.target.value))}
                      className="bg-transparent border-b border-white text-white appearance-none w-full pr-8 py-1"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num} className="bg-[#3f411a]">
                          {num}
                        </option>
                      ))}
                    </select>
                    <img
                      src="/assets/ui/drop.webp"
                      alt="Dropdown"
                      className="w-4 h-4 absolute right-0 top-[34px] pointer-events-none"
                    />
                  </div>
                </div>

                {/* Calendar */}
                <div className="grid grid-cols-7 text-center gap-y-6 text-[#f6f5c6]">
                  {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map((day) => (
                    <div key={day}>{day}</div>
                  ))}
                  {renderCalendar()}
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="flex flex-col justify-between h-full self-stretch w-full max-w-sm ml-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm mb-2">When</label>
                  <div className="border-b border-white pb-1">
                    {formatSelectedDateTime()}
                  </div>
                </div>
                
                {/* First Name and Last Name */}
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => handleNameInput(e.target.value, setFirstName)}
                      className="w-full bg-transparent border-b border-white text-white pb-1 outline-none"
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => handleNameInput(e.target.value, setLastName)}
                      className="w-full bg-transparent border-b border-white text-white pb-1 outline-none"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailInput(e.target.value)}
                    className="w-full bg-transparent border-b border-white text-white pb-1 outline-none"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneInput(e.target.value)}
                    className="w-full bg-transparent border-b border-white text-white pb-1 outline-none"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <button
                onClick={handleBookTable}
                disabled={!isFormValid()}
                className={`block w-full text-center font-medium py-3 mt-6 transition duration-200 ${
                  isFormValid()
                    ? 'bg-white text-[#3f411a] hover:bg-[#f6f5c6] cursor-pointer'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                Book a Table
              </button>
              
              {/* Display errors if any */}
              {errors?.general && (
                <div className="mt-4 p-3 bg-red-500 text-white rounded">
                  {errors.general}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}