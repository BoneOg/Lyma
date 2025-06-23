import React from 'react';
import { Link, router } from '@inertiajs/react';

const AdminSidebar: React.FC = () => {
  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <div className="w-64 bg-[#3f411a] min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#f6f5c6]/20">
        <Link href="/admin/dashboard" className="text-2xl font-bold text-white">
          Logo
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-6">
        <ul className="space-y-4">
          <li>
            <Link
              href="/admin/dashboard"
              className="flex items-center text-white hover:text-white hover:bg-[#f6f5c6]/10 px-4 py-3 rounded-lg transition-colors"
            >
              <span className="text-lg">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/users"
              className="flex items-center text-white hover:text-white hover:bg-[#f6f5c6]/10 px-4 py-3 rounded-lg transition-colors"
            >
              <span className="text-lg">Users</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/booking"
              className="flex items-center text-white hover:text-white hover:bg-[#f6f5c6]/10 px-4 py-3 rounded-lg transition-colors"
            >
              <span className="text-lg">Booking</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-6 border-t border-[#f6f5c6]/20">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar; 