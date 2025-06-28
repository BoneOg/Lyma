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
    { id: 'dashboard', label: 'Dashboard', href: '/staff/dashboard' },
  ];

  const getCurrentPage = () => {
    if (url.startsWith('/staff/dashboard')) return 'dashboard';
    return 'dashboard';
  };

  const currentPage = getCurrentPage();

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-olive text-white flex flex-col shadow-xl z-20 border-r border-olive-light">
      {/* Logo */}
      <div className="p-6 border-b border-olive-light">
        <Link href="/staff/dashboard" className="block overflow-hidden">
          <img 
            src="/assets/images/lyma.png" 
            alt="Lyma by Chef Mar" 
            className="w-full h-16 object-cover object-center"
            style={{
              objectPosition: 'center',
              objectFit: 'cover',
              transform: 'scale(3)',
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
              {/* Dashboard Icon */}
              {item.id === 'dashboard' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M2 12.204c0-2.289 0-3.433.52-4.381c.518-.949 1.467-1.537 3.364-2.715l2-1.241C9.889 2.622 10.892 2 12 2s2.11.622 4.116 1.867l2 1.241c1.897 1.178 2.846 1.766 3.365 2.715S22 9.915 22 12.203v1.522c0 3.9 0 5.851-1.172 7.063S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.212S2 17.626 2 13.725z" />
                    <path stroke-linecap="round" d="M12 15v3" />
                  </g>
                </svg>
              )}
            </span>
            <span className="transition-all duration-200 ease-in-out font-lexend">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-[#5a5d2a]">
        <button
          onClick={handleLogoutClick}
          className="flex items-center text-[#e8e6b3] hover:text-[#f6f5c6] hover:bg-[#5a5d2a] transition-all duration-200 ease-in-out rounded-md w-full font-lexend "
        >
          <span className="mr-3 transform -scale-x-100 transition-transform duration-200 ease-in-out hover:scale-110">
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
          <div className="bg-[#3f411a] text-white rounded-2xl p-6 shadow-lg max-w-md w-full mx-4">
            <h3 className="text-xl  mb-4 font-extralight font-lexend">Confirm Logout</h3>
            <p className="text-beige-dark mb-6 font-extralight font-lexend">Are you sure you want to logout?</p>
            
            <div className="flex gap-3">
              <button
                onClick={handleLogoutCancel}
                className="flex-1 bg-[#f6f5c6] hover:bg-[#e8e6b3]/80 text-[#3f411a] py-3 px-4 rounded-md font-extralight transition-colors font-lexend"
              >
                No
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 bg-[#f6f5c6] hover:bg-[#e8e6b3]/80 text-[#3f411a] py-3 px-4 rounded-md font-extralight transition-colors font-lexend"
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