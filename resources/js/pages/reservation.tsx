import Layout from '@/components/layout'

export default function Reservation() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#3f411a] flex justify-center text-white px-4 pt-10">
        <div className="max-w-4xl w-full py-12">
          <h1 className="text-5xl font-serif mb-10">RESERVATION</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left Content Container */}
            <div className="flex flex-col justify-start h-full">
              {/* Dropdowns + Calendar (used for height alignment) */}
              <div className="flex flex-col justify-start h-full">
                <div className="flex space-x-6 mb-8">
                  {/* Month */}
                  <div className="relative w-40">
                    <label className="block text-sm mb-1">Month</label>
                    <select className="bg-transparent border-b border-white text-white appearance-none w-full pr-8 py-1">
                      <option>June</option>
                      <option>July</option>
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
                    <select className="bg-transparent border-b border-white text-white appearance-none w-full pr-8 py-1">
                      <option>9:00 AM</option>
                      <option>10:00 AM</option>
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
                    <select className="bg-transparent border-b border-white text-white appearance-none w-full pr-8 py-1">
                      <option>1</option>
                      <option>2</option>
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
                  {Array.from({ length: 30 }, (_, i) => (
                    <div
                      key={i + 1}
                      className={`${
                        i + 1 === 22
                          ? 'bg-[#f6f5c6] text-[#3f411a] rounded-full px-3 py-1'
                          : 'text-white'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Form aligned with left content */}
            <div className="flex flex-col justify-between h-full self-stretch w-full max-w-sm ml-auto">
                <div className="space-y-6">
                    <div>
                    <label className="block text-sm mb-2">When</label>
                    <div className="border-b border-white pb-1">
                        June 22 (Sunday), 09:00, 1 Guest
                    </div>
                    </div>
                    <div>
                    <label className="block text-sm mb-1">Name</label>
                    <input
                        type="text"
                        className="w-full bg-transparent border-b border-white text-white pb-1 outline-none"
                        placeholder="Enter your name"
                    />
                    </div>
                    <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full bg-transparent border-b border-white text-white pb-1 outline-none"
                        placeholder="Enter your email"
                    />
                    </div>
                    <div>
                    <label className="block text-sm mb-1">Phone Number</label>
                    <input
                        type="tel"
                        className="w-full bg-transparent border-b border-white text-white pb-1 outline-none"
                        placeholder="Enter your phone number"
                    />
                    </div>
                </div>

                <button className="w-full bg-white text-[#3f411a] font-medium py-3 mt-6 hover:bg-[#f6f5c6] transition duration-200">
                    Book a Table
                </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
