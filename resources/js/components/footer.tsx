import React from 'react';
import { Link } from '@inertiajs/react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-beige text-[#3f411a]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Footer Logo Section */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center w-full max-w-2xl">
            <div className="flex-1 h-px bg-[#3f411a]/30"></div>
            <div className="mx-8">
              <img 
                src="/assets/images/footer.png" 
                alt="Lyma" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <div className="flex-1 h-px bg-[#3f411a]/30"></div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Restaurant Info */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-lexend font-light text-[#3f411a] mb-6">Lyma</h3>
            <p className="text-[#3f411a]/80 font-lexend font-extralight leading-relaxed mb-6 max-w-md">
              Experience culinary excellence in an intimate setting where every detail is crafted with precision and passion.
            </p>
            <div className="space-y-3 text-[#3f411a]/80 font-lexend font-extralight">
              <p>Purok 5 Tourism Rd, General Luna, Surigao del Norte</p>
              <p>lyma@gmail.com</p>
              <p>+639543846071</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-lexend font-light text-[#3f411a] mb-6">Navigation</h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/" 
                  className="text-[#3f411a]/70 hover:text-[#3f411a] transition-colors duration-300 font-lexend font-extralight"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/menu" 
                  className="text-[#3f411a]/70 hover:text-[#3f411a] transition-colors duration-300 font-lexend font-extralight"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-[#3f411a]/70 hover:text-[#3f411a] transition-colors duration-300 font-lexend font-extralight"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-[#3f411a]/70 hover:text-[#3f411a] transition-colors duration-300 font-lexend font-extralight"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/reservation" 
                  className="text-[#3f411a]/70 hover:text-[#3f411a] transition-colors duration-300 font-lexend font-extralight"
                >
                  Make a Reservation
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-lexend font-light text-[#3f411a] mb-6">Hours</h4>
            <div className="space-y-3 text-[#3f411a]/80 font-lexend font-extralight">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>11:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday - Sunday</span>
                <span>10:00 AM - 11:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-[#3f411a]/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#3f411a]/60 font-lexend font-extralight text-sm">
              &copy; {new Date().getFullYear()} Lyma. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-[#3f411a]/60 hover:text-[#3f411a] transition-colors duration-300">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-[#3f411a]/60 hover:text-[#3f411a] transition-colors duration-300">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
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