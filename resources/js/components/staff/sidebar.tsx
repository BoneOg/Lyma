import React from 'react';
import { Link, router } from '@inertiajs/react';

const StaffSidebar: React.FC = () => {
  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <div className="w-64 bg-[#3f411a] min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#f6f5c6]/20 flex flex-col items-center justify-center py-10 border-b-0">
        <Link href="/staff/dashboard" className="text-2xl font-bold text-white">
          Logo
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-6">
        <ul className="space-y-4">
          <li>
            <Link
              href="/staff/dashboard"
              className="flex items-center text-white hover:text-white hover:bg-[#f6f5c6]/10 px-4 py-3 rounded-lg transition-colors"
            >
              <span className="text-lg">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/staff/booking"
              className="flex items-center text-white hover:text-white hover:bg-[#f6f5c6]/10 px-4 py-3 rounded-lg transition-colors"
            >
              <span className="text-lg">Booking</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-6 mt-4 flex justify-center">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-3 rounded-lg transition-colors hover:bg-[#f6f5c6]/10 text-white w-full justify-center"
          title="Logout"
        >
          <span className="block transform -scale-x-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
              <path fill="#fff" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6q.425 0 .713.288T12 4t-.288.713T11 5H5v14h6q.425 0 .713.288T12 20t-.288.713T11 21zm12.175-8H10q-.425 0-.712-.288T9 12t.288-.712T10 11h7.175L15.3 9.125q-.275-.275-.275-.675t.275-.7t.7-.313t.725.288L20.3 11.3q.3.3.3.7t-.3.7l-3.575 3.575q-.3.3-.712.288t-.713-.313q-.275-.3-.262-.712t.287-.688z" />
            </svg>
          </span>
          <span className="text-lg font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default StaffSidebar; 