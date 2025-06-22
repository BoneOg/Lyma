import Layout from '@/components/layout'
import { usePage } from '@inertiajs/react'
import { useState } from 'react'

interface TimeSlot {
  id: number
  start_time: string
  end_time: string
  start_time_formatted: string
}

interface Reservation {
  id: number
  guest_first_name: string
  guest_last_name: string
  guest_email: string
  guest_phone: string
  reservation_date: string
  guest_count: number
  status: string
  time_slot: TimeSlot
}

interface Props {
  reservation: Reservation
  reservationFee: number
  [key: string]: any
}

const paymentMethods = [
  { method_name: 'Visa', method_type: 'credit_card' },
  { method_name: 'Mastercard', method_type: 'credit_card' },
  { method_name: 'JCB', method_type: 'credit_card' },
  { method_name: 'AMEX', method_type: 'credit_card' },
  { method_name: 'Visa Debit', method_type: 'debit_card' },
  { method_name: 'Mastercard Debit', method_type: 'debit_card' },
  { method_name: 'JCB Debit', method_type: 'debit_card' },
  { method_name: 'AMEX Debit', method_type: 'debit_card' },
  { method_name: 'Maya', method_type: 'digital_wallet' },
  { method_name: 'GCash', method_type: 'digital_wallet' },
  { method_name: 'WeChat Pay', method_type: 'digital_wallet' },
  { method_name: 'ShopeePay', method_type: 'digital_wallet' },
  { method_name: 'QR Ph', method_type: 'digital_wallet' },
]

export default function Checkout() {
  const { reservation, reservationFee } = usePage<Props>().props
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#3f411a] text-white flex items-center justify-center py-12 px-4">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Summary Section */}
          <div className="space-y-8">
            <h1 className="text-4xl font-serif mb-8">Checkout Summary</h1>
            
            {/* Personal Information Section */}
            <div className="border-2 border-white p-6">
              <h2 className="text-2xl font-serif mb-4 border-b-2 border-white pb-2">Personal Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#f6f5c6] font-medium">Name:</span>
                  <span className="text-white">{reservation.guest_first_name} {reservation.guest_last_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#f6f5c6] font-medium">Email:</span>
                  <span className="text-white">{reservation.guest_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#f6f5c6] font-medium">Phone:</span>
                  <span className="text-white">{reservation.guest_phone}</span>
                </div>
              </div>
            </div>

            {/* Booking Information Section */}
            <div className="border-2 border-white p-6">
              <h2 className="text-2xl font-serif mb-4 border-b-2 border-white pb-2">Booking Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#f6f5c6] font-medium">Date:</span>
                  <span className="text-white">{formatDate(reservation.reservation_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#f6f5c6] font-medium">Time:</span>
                  <span className="text-white">
                    {reservation.time_slot?.start_time_formatted || 'Time not available'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#f6f5c6] font-medium">Guests:</span>
                  <span className="text-white">{reservation.guest_count} {reservation.guest_count === 1 ? 'Guest' : 'Guests'}</span>
                </div>
              </div>
            </div>

            {/* Payment Summary Section */}
            <div className="border-2 border-white p-6">
              <h2 className="text-2xl font-serif mb-4 border-b-2 border-white pb-2">Payment Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#f6f5c6] font-medium">Reservation Fee:</span>
                  <span className="text-white">₱{reservationFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t-2 border-white pt-3">
                  <span className="text-[#f6f5c6] font-bold text-lg">Total Amount:</span>
                  <span className="text-white font-bold text-lg">₱{reservationFee.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods Section */}
          <div className="space-y-8">
            <h2 className="text-3xl font-serif">Payment Method</h2>

            <div className="space-y-6">
              {['credit_card', 'debit_card', 'digital_wallet'].map((type) => (
                <div key={type} className="border-2 border-white p-6">
                  <h3 className="text-xl font-serif capitalize mb-4 border-b-2 border-white pb-2">
                    {type.replace('_', ' ')}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods
                      .filter((pm) => pm.method_type === type)
                      .map((pm) => (
                        <button
                          key={pm.method_name}
                          onClick={() => setSelectedPaymentMethod(pm.method_name)}
                          className={`py-3 px-4 border-2 transition-all duration-200 ${
                            selectedPaymentMethod === pm.method_name
                              ? 'bg-white text-[#3f411a] border-white'
                              : 'bg-transparent text-white border-white hover:bg-white hover:text-[#3f411a]'
                          }`}
                        >
                          {pm.method_name}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <button 
              disabled={!selectedPaymentMethod}
              className={`w-full py-4 font-medium text-lg transition-all duration-200 ${
                selectedPaymentMethod
                  ? 'bg-white text-[#3f411a] hover:bg-[#f6f5c6] cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Confirm & Pay ₱{reservationFee.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
