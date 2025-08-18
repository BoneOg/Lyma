import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

const StaffSidebar: React.FC = () => {
  const { url } = usePage();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    router.post('/logout');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const menuItems = [
    { id: 'booking', label: 'Booking', href: '/staff/booking' },
  ];

  const getCurrentPage = () => {
    if (url.startsWith('/staff/booking')) return 'booking';
    return 'booking';
  };

  const currentPage = getCurrentPage();

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-olive text-white flex flex-col shadow-xl z-20 border-r border-olive-light">
      {/* Logo */}
      <div className="p-6 border-b border-olive-light">
        <Link href="/staff/booking" className="block overflow-hidden">
          <img 
            src="/assets/logo/lymabeige.webp" 
            alt="Lyma by Chef Marc" 
            className="w-full h-16 object-contain object-center"
            style={{
              objectPosition: 'center',
              objectFit: 'contain',
              transform: 'scale(1)',
              transformOrigin: 'center'
            }}
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pb-6">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`w-full flex items-center px-6 py-5 text-left font-lexend font-extralight transition-all duration-200 ease-in-out ${
              currentPage === item.id
                ? "bg-[#5a5d2a] text-[#f6f5c6]"
                : "text-[#e8e6b3] hover:bg-[#5a5d2a] hover:text-[#f6f5c6]"
            }`}
          >
            <span className="mr-3 transition-transform duration-200 ease-in-out group-hover:scale-110">
              {/* Booking Icon */}
              {item.id === 'booking' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M2 12c0-3.771 0-5.657 1.172-6.828S6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.212S2 17.771 2 14z" />
                    <path stroke-linecap="round" d="M7 4V2.5M17 4V2.5M2.5 9h19" />
                  </g>
                </svg>
              )}
            </span>
            <span className="transition-all duration-200 ease-in-out font-lexend">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-[#5a5d2a]">
        <button
          onClick={handleLogoutClick}
          className="relative flex items-center text-white hover:text-[#f6f5c6] hover:bg-[#5a5d2a] justify-center transition-all duration-200 ease-in-out rounded w-full font-lexend py-5"
        >
          <span className="absolute left-6 transform -scale-x-100 transition-transform duration-200 ease-in-out hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.496 21H6.5c-1.105 0-2-1.151-2-2.571V5.57c0-1.419.895-2.57 2-2.57h7M16 15.5l3.5-3.5L16 8.5m-6.5 3.496h10" />
            </svg>
          </span>
          <span className="transition-all duration-200 ease-in-out font-lexend font-extralight">Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-background text-olive rounded p-6 shadow-lg max-w-md w-full mx-4">
            <h3 className="text-xl mb-4 font-lexend font-semibold tracking-tighter">Confirm Logout</h3>
            <p className="text-olive mb-6 font-lexend font-light tracking-tight">Are you sure you want to logout?</p>
            
            <div className="flex gap-3">
              <button
                onClick={handleLogoutCancel}
                className="flex-1 bg-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.8)] text-white border-none py-3 px-4 rounded font-regular transition-colors font-lexend cursor-pointer"
              >
                No
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 bg-olive hover:bg-olive-light text-white border-none py-3 px-4 rounded font-regular transition-colors font-lexend cursor-pointer"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffSidebar; 