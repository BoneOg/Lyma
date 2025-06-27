import React from 'react';
import { Link } from '@inertiajs/react';
import Underline from '@/animation/underline';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-olive py-2 font-lexend shadow-sm border-b border-gray-200">
      <div className="mx-[100px]">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo - Left Side */}
          <div className="flex-shrink-0 z-10">
            <Link href="/" className="text-xl font-semibold text-[#f6f5c6] hover:text-gray-700">
              Logo
            </Link>
          </div>

          {/* Navigation Links - Center (Absolutely Positioned) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-8">
            <div className="px-3 py-2">
              <Underline>
                <Link 
                  href="/menu" 
                  className="text-white hover:text-[#f6f5c6]/80 text-sm font-extralight transition-colors"
                >
                  Menu
                </Link>
              </Underline>
            </div>

            <div className="px-3 py-2">
              <Underline>
                <Link 
                  href="/about" 
                  className="text-white hover:text-[#f6f5c6]/80 text-sm font-extralight transition-colors"
                >
                  About
                </Link>
              </Underline>
            </div>

            <div className="px-3 py-2">
              <Underline>
                <Link 
                  href="/contact" 
                  className="text-white hover:text-[#f6f5c6]/80 text-sm font-extralight transition-colors"
                >
                  Contact
                </Link>
              </Underline>
            </div>
          </div>

          {/* Make a Reservation Button - Right Side */}
          <div className="flex-shrink-0 z-10">
            <Link 
              href="/reservation"
              className="bg-transparent text-white hover:text-[var(--color-olive)] hover:bg-[var(--color-beige)] px-6 py-4 border border-[#f6f5c6] text-sm font-extralight transition-colors"
            >
              MAKE A RESERVATION
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;