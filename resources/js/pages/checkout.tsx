import Layout from '@/components/layout'

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
  return (
    <Layout>
      <div className="min-h-screen bg-[#3f411a] text-white flex items-center justify-center py-12 px-4">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Summary Section */}
          <div className="space-y-6">
            <h1 className="text-3xl font-serif mb-4">Checkout Summary</h1>
            <div className="bg-[#f6f5c6] text-[#3f411a] p-4 rounded">
              <p><strong>Item:</strong> Signature Dinner Package</p>
              <p><strong>Date:</strong> June 22, 2025</p>
              <p><strong>Time:</strong> 7:00 PM</p>
              <p><strong>Guests:</strong> 2</p>
              <p><strong>Total:</strong> ₱2,500.00</p>
            </div>
          </div>

          {/* Payment Methods Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-serif">Payment Method</h2>

            <div className="space-y-4">
              {['credit_card', 'debit_card', 'digital_wallet'].map((type) => (
                <div key={type}>
                  <h3 className="text-lg font-medium capitalize mb-2">
                    {type.replace('_', ' ')}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods
                      .filter((pm) => pm.method_type === type)
                      .map((pm) => (
                        <button
                          key={pm.method_name}
                          className="bg-white text-[#3f411a] py-2 rounded hover:bg-[#f6f5c6] transition"
                        >
                          {pm.method_name}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 bg-white text-[#3f411a] font-medium hover:bg-[#f6f5c6] transition">
              Confirm & Pay
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
