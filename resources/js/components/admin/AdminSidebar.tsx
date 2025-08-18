import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

const AdminSidebar: React.FC = () => {
  console.log('AdminSidebar: Rendering...');
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
    { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard' },
    { id: 'booking', label: 'Booking', href: '/admin/booking' },
    { id: 'settings', label: 'Settings', href: '/admin/settings' },
  ];

  const getCurrentPage = () => {
    if (url.startsWith('/admin/dashboard')) return 'dashboard';
    if (url.startsWith('/admin/booking')) return 'booking';
    if (url.startsWith('/admin/settings')) return 'settings';
    return 'settings';
  };

  const currentPage = getCurrentPage();

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-olive text-white flex flex-col shadow-xl z-20 border-r border-olive-light">
      {/* Logo */}
      <div className="p-6 border-b border-olive-light">
        <Link href="/admin/dashboard" className="block overflow-hidden">
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
                : "text-white hover:bg-[#5a5d2a] hover:text-[#f6f5c6]"
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
              {/* Booking Icon */}
              {item.id === 'booking' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M2 12c0-3.771 0-5.657 1.172-6.828S6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.212S2 17.771 2 14z" />
                    <path stroke-linecap="round" d="M7 4V2.5M17 4V2.5M2.5 9h19" />
                  </g>
                </svg>
              )}
              {/* Setting Icon */}
              {item.id === 'settings' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                  <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                    <path d="M12 8.25a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5M9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0" />
                    <path d="M11.975 1.25c-.445 0-.816 0-1.12.02a2.8 2.8 0 0 0-.907.19a2.75 2.75 0 0 0-1.489 1.488c-.145.35-.184.72-.2 1.122a.87.87 0 0 1-.415.731a.87.87 0 0 1-.841-.005c-.356-.188-.696-.339-1.072-.389a2.75 2.75 0 0 0-2.033.545a2.8 2.8 0 0 0-.617.691c-.17.254-.356.575-.578.96l-.025.044c-.223.385-.408.706-.542.98c-.14.286-.25.568-.29.88a2.75 2.75 0 0 0 .544 2.033c.231.301.532.52.872.734a.87.87 0 0 1 .426.726a.87.87 0 0 1-.426.726c-.34.214-.64.433-.872.734a2.75 2.75 0 0 0-.545 2.033c.041.312.15.594.29.88c.135.274.32.595.543.98l.025.044c.222.385.408.706.578.96c.177.263.367.5.617.69a2.75 2.75 0 0 0 2.033.546c.376-.05.716-.2 1.072-.389a.87.87 0 0 1 .84-.005a.86.86 0 0 1 .417.731c.015.402.054.772.2 1.122a2.75 2.75 0 0 0 1.488 1.489c.29.12.59.167.907.188c.304.021.675.021 1.12.021h.05c.445 0 .816 0 1.12-.02c.318-.022.617-.069.907-.19a2.75 2.75 0 0 0 1.489-1.488c.145-.35.184-.72.2-1.122a.87.87 0 0 1 .415-.732a.87.87 0 0 1 .841.006c.356.188.696.339 1.072.388a2.75 2.75 0 0 0 2.033-.544c.25-.192.44-.428.617-.691c.17-.254.356-.575.578-.96l.025-.044c.223-.385.408-.706.542-.98c.14-.286.25-.569.29-.88a2.75 2.75 0 0 0-.544-2.033c-.231-.301-.532-.52-.872-.734a.87.87 0 0 1-.426-.726c0-.278.152-.554.426-.726c.34-.214.64-.433.872-.734a2.75 2.75 0 0 0 .545-2.033a2.8 2.8 0 0 0-.29-.88a18 18 0 0 0-.543-.98l-.025-.044a18 18 0 0 0-.578-.96a2.8 2.8 0 0 0-.617-.69a2.75 2.75 0 0 0-2.033-.546c-.376.05-.716.2-1.072.389a.87.87 0 0 1-.84.005a.87.87 0 0 1-.417-.731c-.015-.402-.054-.772-.2-1.122a2.75 2.75 0 0 0-1.488-1.489c-.29-.12-.59-.167-.907-.188c-.304-.021-.675-.021-1.12-.021zm-1.453 1.595c.077-.032.194-.061.435-.078c.247-.017.567-.017 1.043-.017s.796 0 1.043.017c.241.017.358.046.435.078c.307.127.55.37.677.677c.04.096.073.247.086.604c.03.792.439 1.555 1.165 1.974s1.591.392 2.292.022c.316-.167.463-.214.567-.227a1.25 1.25 0 0 1 .924.247c.066.051.15.138.285.338c.139.206.299.483.537.895s.397.69.506.912c.107.217.14.333.15.416a1.25 1.25 0 0 1-.247.924c-.064.083-.178.187-.48.377c-.672.422-1.128 1.158-1.128 1.996s.456 1.574 1.128 1.996c.302.19.416.294.48.377c.202.263.29.595.247.924c-.01.083-.044.2-.15.416c-.109.223-.268.5-.506.912s-.399.689-.537.895c-.135.2-.219.287-.285.338a1.25 1.25 0 0 1-.924.247c-.104-.013-.25-.06-.567-.227c-.7-.37-1.566-.398-2.292.021s-1.135 1.183-1.165 1.975c-.013.357-.046.508-.086.604a1.25 1.25 0 0 1-.677.677c-.077.032-.194.061-.435.078c-.247.017-.567.017-1.043.017s-.796 0-1.043-.017c-.241-.017-.358-.046-.435-.078a1.25 1.25 0 0 1-.677-.677c-.04-.096-.073-.247-.086-.604c-.03-.792-.439-1.555-1.165-1.974s-1.591-.392-2.292-.022c-.316.167-.463.214-.567.227a1.25 1.25 0 0 1-.924-.247c-.066-.051-.15-.138-.285-.338a17 17 0 0 1-.537-.895c-.238-.412-.397-.69-.506-.912c-.107-.217-.14-.333-.15-.416a1.25 1.25 0 0 1 .247-.924c.064-.083.178-.187.48-.377c.672-.422 1.128-1.158 1.128-1.996s-.456-1.574-1.128-1.996c-.302-.19-.416-.294-.48-.377a1.25 1.25 0 0 1-.247-.924c.01-.083.044-.2.15-.416c.109-.223.268-.5.506-.912s.399-.689.537-.895c.135-.2.219-.287.285-.338a1.25 1.25 0 0 1 .924-.247c.104.013.25.06.567.227c.7.37 1.566.398 2.292-.022c.726-.419 1.135-1.182 1.165-1.974c.013-.357.046-.508.086-.604c.127-.307.37-.55.677-.677" />
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

export default AdminSidebar; 