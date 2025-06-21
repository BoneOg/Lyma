import React from 'react';
import { Link } from '@inertiajs/react';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left Side */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-gray-700">
              Logo
            </Link>
          </div>

          {/* Navigation Links - Center */}
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/menu" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            >
              Menu
            </Link>
            <Link 
              href="/about" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            >
              Contact
            </Link>
            <Link 
              href="/account" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            >
              Account
            </Link>
          </div>

          {/* Make a Reservation Button - Right Side */}
          <div>
            <Link 
              href="/reservations/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Make a Reservation
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;