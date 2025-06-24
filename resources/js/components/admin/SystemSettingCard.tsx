import React from 'react';

const SystemSettingCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 h-full">
      <h2 className="text-2xl font-semibold text-[#3f411a] mb-8 font-lexend">System</h2>
      
      <div className="space-y-8">
        {/* First Row */}
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-medium text-[#3f411a] font-lexend">
              Reservation Fee
            </label>
            <div className="relative">
              <input
                type="number"
                value="1200"
                className="w-full px-3 py-2 border border-[#3f411a]/20 rounded-lg focus:outline-none focus:border-[#3f411a] bg-[#fdfcf0]/30 pr-10 font-lexend"
                step="0.01"
                min="0"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-[#f6f5c6] text-black">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" d="M22 10.5V12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2h1.5" />
                    <path d="m16.652 3.455l.649-.649A2.753 2.753 0 0 1 21.194 6.7l-.65.649m-3.892-3.893s.081 1.379 1.298 2.595c1.216 1.217 2.595 1.298 2.595 1.298m-3.893-3.893L10.687 9.42c-.404.404-.606.606-.78.829q-.308.395-.524.848c-.121.255-.211.526-.392 1.068L8.412 13.9m12.133-6.552l-5.965 5.965c-.404.404-.606.606-.829.78a4.6 4.6 0 0 1-.848.524c-.255.121-.526.211-1.068.392l-1.735.579m0 0l-1.123.374a.742.742 0 0 1-.939-.94l.374-1.122m1.688 1.688L8.412 13.9" />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-[#3f411a] font-lexend">
              Max Booking Days
            </label>
            <div className="relative">
              <input
                type="number"
                value="30"
                className="w-full px-3 py-2 border border-[#3f411a]/20 rounded-lg focus:outline-none focus:border-[#3f411a] bg-[#fdfcf0]/30 pr-10 font-lexend"
                min="1"
                max="365"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-[#f6f5c6] text-black">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" d="M22 10.5V12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2h1.5" />
                    <path d="m16.652 3.455l.649-.649A2.753 2.753 0 0 1 21.194 6.7l-.65.649m-3.892-3.893s.081 1.379 1.298 2.595c1.216 1.217 2.595 1.298 2.595 1.298m-3.893-3.893L10.687 9.42c-.404.404-.606.606-.78.829q-.308.395-.524.848c-.121.255-.211.526-.392 1.068L8.412 13.9m12.133-6.552l-5.965 5.965c-.404.404-.606.606-.829.78a4.6 4.6 0 0 1-.848.524c-.255.121-.526.211-1.068.392l-1.735.579m0 0l-1.123.374a.742.742 0 0 1-.939-.94l.374-1.122m1.688 1.688L8.412 13.9" />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-[#3f411a] font-lexend">
              Restaurant Email
            </label>
            <div className="relative">
              <input
                type="email"
                value="lyma1@gmail.com"
                className="w-full px-3 py-2 border border-[#3f411a]/20 rounded-lg focus:outline-none focus:border-[#3f411a] bg-[#fdfcf0]/30 pr-10 font-lexend"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-[#f6f5c6] text-black">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" d="M22 10.5V12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2h1.5" />
                    <path d="m16.652 3.455l.649-.649A2.753 2.753 0 0 1 21.194 6.7l-.65.649m-3.892-3.893s.081 1.379 1.298 2.595c1.216 1.217 2.595 1.298 2.595 1.298m-3.893-3.893L10.687 9.42c-.404.404-.606.606-.78.829q-.308.395-.524.848c-.121.255-.211.526-.392 1.068L8.412 13.9m12.133-6.552l-5.965 5.965c-.404.404-.606.606-.829.78a4.6 4.6 0 0 1-.848.524c-.255.121-.526.211-1.068.392l-1.735.579m0 0l-1.123.374a.742.742 0 0 1-.939-.94l.374-1.122m1.688 1.688L8.412 13.9" />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-[#3f411a] font-lexend">
              Restaurant Phone <span className="text-[#3f411a]/60 text-xs">(0 left)</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                value="09123456789"
                className="w-full px-3 py-2 border border-[#3f411a]/20 rounded-lg focus:outline-none focus:border-[#3f411a] bg-[#fdfcf0]/30 pr-10 font-lexend"
                maxLength={11}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-[#f6f5c6] text-black">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" d="M22 10.5V12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2h1.5" />
                    <path d="m16.652 3.455l.649-.649A2.753 2.753 0 0 1 21.194 6.7l-.65.649m-3.892-3.893s.081 1.379 1.298 2.595c1.216 1.217 2.595 1.298 2.595 1.298m-3.893-3.893L10.687 9.42c-.404.404-.606.606-.78.829q-.308.395-.524.848c-.121.255-.211.526-.392 1.068L8.412 13.9m12.133-6.552l-5.965 5.965c-.404.404-.606.606-.829.78a4.6 4.6 0 0 1-.848.524c-.255.121-.526.211-1.068.392l-1.735.579m0 0l-1.123.374a.742.742 0 0 1-.939-.94l.374-1.122m1.688 1.688L8.412 13.9" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            className="bg-[#f6f5c6] hover:bg-[#e8e6b3] text-[#3f411a] font-medium px-8 py-2 rounded-lg transition-colors font-lexend"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingCard; 