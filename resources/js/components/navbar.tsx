import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Underline from '@/animation/underline';

const Navbar: React.FC = () => {
  const { url } = usePage();
  
  const isActive = (path: string) => {
    return url === path || url.startsWith(path + '/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-olive py-2 font-lexend shadow-sm border-gray-200">
      <div className="mx-[100px]">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo - Left Side */}
          <div className="flex-shrink-0 z-10 overflow-visible w-32 h-18 flex items-center justify-center relative">
            <Link href="/" className=" w-full h-full flex items-center justify-center">
              <img 
                src="/assets/logo/lymaonly_beige.webp" 
                alt="Lyma by Chef Mar" 
                className="h-12 w-auto object-contain object-center"
                style={{
                  objectPosition: 'center',
                  objectFit: 'contain',
                  transform: 'scale(1.8)',
                  transformOrigin: 'center',
                  position: 'relative',
                  top: '16px'
                }}
              />
            </Link>
          </div>

          {/* Navigation Links - Center (Absolutely Positioned) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-8">
            <div className="px-3 py-2">
              {isActive('/menu') ? (
                <div className="relative inline-block">
                  <Link 
                    href="/menu" 
                    className="text-[#f6f5c6] text-sm font-extralight transition-colors"
                  >
                    Menu
                  </Link>
                  <div className="absolute bottom-[-4px] left-0 w-full h-0.5 bg-[#f6f5c6]"></div>
                </div>
              ) : (
                <Underline>
                  <Link 
                    href="/menu" 
                    className="text-white hover:text-[#f6f5c6]/80 text-sm font-extralight transition-colors"
                  >
                    Menu
                  </Link>
                </Underline>
              )}
            </div>

            <div className="px-3 py-2">
              {isActive('/about') ? (
                <div className="relative inline-block">
                  <Link 
                    href="/about" 
                    className="text-[#f6f5c6] text-sm font-extralight transition-colors"
                  >
                    About
                  </Link>
                  <div className="absolute bottom-[-4px] left-0 w-full h-0.5 bg-[#f6f5c6]"></div>
                </div>
              ) : (
                <Underline>
                  <Link 
                    href="/about" 
                    className="text-white hover:text-[#f6f5c6]/80 text-sm font-extralight transition-colors"
                  >
                    About
                  </Link>
                </Underline>
              )}
            </div>

            <div className="px-3 py-2">
              {isActive('/contact') ? (
                <div className="relative inline-block">
                  <Link 
                    href="/contact" 
                    className="text-[#f6f5c6] text-sm font-extralight transition-colors"
                  >
                    Contact
                  </Link>
                  <div className="absolute bottom-[-4px] left-0 w-full h-0.5 bg-[#f6f5c6]"></div>
                </div>
              ) : (
                <Underline>
                  <Link 
                    href="/contact" 
                    className="text-white hover:text-[#f6f5c6]/80 text-sm font-extralight transition-colors"
                  >
                    Contact
                  </Link>
                </Underline>
              )}
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