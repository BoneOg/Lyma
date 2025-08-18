import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import SideBar from './SideBar';
import MenuToggle from '@/animation/menuToggle';

const Navbar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const iconColor = sidebarOpen ? '#3D401E' : '#FAF7CA';
  const reservationTextClass = sidebarOpen ? 'text-[#3D401E]' : 'text-beige';
  const logoSrc = sidebarOpen ? '/assets/logo/lymaolive.webp' : '/assets/logo/lymaonly_beige.webp';
  const underlineColor = sidebarOpen ? '#3D401E' : 'beige';
  return (
    <>
      <SideBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent py-2 font-lexend border-gray-200">
        <div className="mx-4 sm:mx-4 md:mx-[30px]  lg:mx-[30px] xl:mx-[100px]">
          <div className="flex justify-between items-center h-16 relative">
            {/* Mobile Layout: Logo on Left, Burger on Right */}
            <div className="md:hidden flex items-center">
              <Link href="/" className="hover:scale-110 transition-transform duration-300 ease-in-out">
                <img
                  src={logoSrc}
                  alt="Lyma by Chef Marc"
                  className="h-8 w-auto object-contain object-center"
                  style={{
                    objectPosition: 'center',
                    objectFit: 'contain',
                    transform: 'scale(1.0)',
                    transformOrigin: 'center',
                    position: 'relative',
                    top: '8px'
                  }}
                />
              </Link>
            </div>

            {/* Desktop Layout: Burger on Left */}
            <div className="hidden md:flex items-center" style={{ marginTop: '16px' }}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <MenuToggle
                  isOpen={sidebarOpen}
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  color={iconColor}
                />
              </motion.div>
            </div>

            {/* Logo - Center (Desktop Only) */}
            <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <Link href="/" className="w-full h-full flex items-center justify-center hover:scale-110 transition-transform duration-300 ease-in-out">
                <img
                  src={logoSrc}
                  alt="Lyma by Chef Marc"
                  className="h-12 w-auto object-contain object-center"
                  style={{
                    objectPosition: 'center',
                    objectFit: 'contain',
                    transform: 'scale(1.2)',
                    transformOrigin: 'center',
                    position: 'relative',
                    top: '16px'
                  }}
                />
              </Link>
            </div>

            {/* Mobile Layout: Burger Menu on Right */}
            <div className="md:hidden flex items-center" style={{ marginTop: '16px' }}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="scale-x-[-1]"
              >
                <MenuToggle
                  isOpen={sidebarOpen}
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  color={iconColor}
                />
              </motion.div>
            </div>

            {/* Reservation Button - Right Side (Tablet & Desktop) */}
            <div className="hidden sm:flex items-center justify-end" style={{ marginTop: '16px' }}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="/reservation"
                  className={`flex items-center gap-1 sm:gap-1 md:gap-2 font-lexend font-extralight tracking-widest transition-colors duration-300 z-10 ${reservationTextClass}`}
                >
                  <span className="text-xs sm:text-xs md:text-sm xl:text-base">RESERVATION</span>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" className="sm:w-[1.2em] sm:h-[1.2em] md:w-[1.5em] md:h-[1.5em]" viewBox="0 0 24 24">
                      <path fill={iconColor} d="M17.47 7.47a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0v-3.78H2a.75.75 0 0 1 0-1.5h15.47z" />
                    </svg>
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;