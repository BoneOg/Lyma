import React from 'react';
import { Link } from '@inertiajs/react';

interface FooterProps {
  footerData?: {
    restaurant_address: string;
    restaurant_email: string;
    restaurant_phone: string;
    restaurant_name: string;
  };
}

const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT US', href: '/about' },
  { label: 'MENU', href: '/menu' },
  { label: 'GALLERY', href: '/gallery' },
  { label: 'RESERVATION', href: '/reservation' },
];

const Footer: React.FC<FooterProps> = ({ footerData }) => {
  // Use footerData if available, otherwise use fallback values
  const address = footerData?.restaurant_address || 'Purok 5 Tourism Rd, General Luna, Surigao del Norte';
  const email = footerData?.restaurant_email || 'lyma@gmail.com';
  const phone = footerData?.restaurant_phone || '+639543846071';
  const restaurantName = footerData?.restaurant_name || 'Lyma';

  return (
    <footer className="bg-[#FAF7CA] text-[#3D401E] relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-6 py-8 sm:py-10 lg:py-12">
        {/* Elegant Header with Brand */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-8 mt-2">
          <div className="inline-flex items-center justify-center">
            <div className="w-32 sm:w-48 lg:w-64 h-[2px] bg-gradient-to-r from-transparent to-[#3D401E]/30"></div>
            <div className="mx-4 sm:mx-6 lg:mx-8">
              <img 
                src="/assets/images/footer.webp" 
                alt="Lyma" 
                className="h-12 sm:h-14 lg:h-16 w-auto object-contain drop-shadow-sm"
              />
            </div>
            <div className="w-32 sm:w-48 lg:w-64 h-[2px] bg-gradient-to-l from-transparent to-[#3D401E]/30"></div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-6 sm:mb-8 lg:mb-8">
          
          {/* Restaurant Story */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-6">
            <h3 className="text-xl sm:text-2xl lg:text-2xl font-lexend font-light text-[#3D401E] mb-4 sm:mb-6 lg:mb-6 relative">
              Our Story
              <div className="absolute -bottom-2 left-0 w-8 sm:w-10 lg:w-12 h-px bg-[#3D401E]/30"></div>
            </h3>
            <p className="text-[#3D401E]/80 font-lexend font-light leading-relaxed text-sm sm:text-base lg:text-base max-w-lg">
              Nestled in the pristine shores of Siargao Island, {restaurantName} represents the essence of tropical fine dining. 
              Every dish tells a story of local ingredients transformed through innovative techniques, 
              creating an unforgettable culinary journey.
            </p>
            
            {/* Contact Info with Icons */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-6 pt-3 sm:pt-4 lg:pt-4">
              <div className="flex items-center space-x-2 sm:space-x-3 text-[#3D401E]/80">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 text-[#3D401E]/60" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <p className="font-lexend font-light text-sm sm:text-base lg:text-base">{address}</p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-[#3D401E]/80">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 text-[#3D401E]/60" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <p className="font-lexend font-light text-sm sm:text-base lg:text-base">{email}</p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-[#3D401E]/80">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 text-[#3D401E]/60" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <p className="font-lexend font-light text-sm sm:text-base lg:text-base">{phone}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg sm:text-xl lg:text-xl font-lexend font-light text-[#3D401E] mb-4 sm:mb-6 lg:mb-6 relative">
              Explore
              <div className="absolute -bottom-2 left-0 w-6 sm:w-7 lg:w-8 h-px bg-[#3D401E]/30"></div>
            </h4>
            <ul className="space-y-3 sm:space-y-4 lg:space-y-4">
              {NAV_LINKS.map(link => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-[#3D401E]/70 hover:text-[#3D401E] transition-all duration-300 font-lexend font-light tracking-wide uppercase text-xs sm:text-sm lg:text-sm hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours & Reservations */}
          <div>
            <h4 className="text-lg sm:text-xl lg:text-xl font-lexend font-light text-[#3D401E] mb-6 sm:mb-8 lg:mb-8 relative">
            Your Table Awaits
              <div className="absolute -bottom-2 left-0 w-6 sm:w-7 lg:w-8 h-px bg-[#3D401E]/30"></div>
            </h4>
            <div className="space-y-3 sm:space-y-4 lg:space-y-4 text-[#3D401E]/80 font-lexend font-light">
              <div className="pb-2 sm:pb-3 lg:pb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs sm:text-sm lg:text-sm uppercase tracking-wide">Mon - Sun</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-8 lg:mt-8 p-3 sm:p-4 lg:p-4 bg-[#3D401E]/5 border border-[#3D401E]/10">
              <p className="text-[#3D401E]/80 font-lexend font-light text-xs sm:text-sm lg:text-sm mb-2 sm:mb-3 lg:mb-3">
                Reservations recommended for dinner service
              </p>
              <Link 
                href="/reservation" 
                className="inline-block bg-[#3D401E] text-[#FAF7CA] px-3 sm:px-4 lg:px-4 py-2 rounded font-lexend font-regular text-xs sm:text-sm lg:text-sm hover:bg-[#3D401E]/90 transition-colors duration-300 uppercase tracking-wide"
              >
                Reserve Now
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-[#3D401E]/20 pt-6 sm:pt-8 lg:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p className="text-[#3D401E]/60 font-lexend font-light text-xs sm:text-sm lg:text-sm">
              &copy; {new Date().getFullYear()} {restaurantName}. All rights reserved. Crafted with passion in Siargao.
            </p>
            <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-4 mt-3 sm:mt-4 lg:mt-0 text-xs sm:text-sm lg:text-sm text-[#3D401E]/60">
            <a href="#" className="text-[#3D401E]/60 hover:text-[#3D401E] transition-all duration-300 transform hover:scale-110">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-6 lg:w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/lymasiargao" className="text-[#3D401E]/60 hover:text-[#3D401E] transition-all duration-300 transform hover:scale-110">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-6 lg:w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.049 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;