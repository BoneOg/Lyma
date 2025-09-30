import React from "react";
import Arrow from "../Arrow";
import { Phone, Instagram } from "lucide-react";
import PatternBackground from "../PatternBackground";

const ContactSection: React.FC = () => {
  return (
    <section className="w-full bg-olive text-beige relative overflow-hidden">
      {/* Pattern Background */}
      <div className="absolute inset-0 z-0">
        <PatternBackground 
          overrides={{
            carabao: 'absolute top-1/4 -translate-y-1/2 left-2 lg:left-4 w-32 lg:w-52 rotate-[-10deg] opacity-15',
            sugarcane: 'absolute bottom-[20%] left-[20%] w-22 lg:w-36 rotate-[-1deg] -translate-x-4 opacity-15',
            scallop: 'hidden lg:block absolute top-16 left-[20%] w-14 rotate-[6deg] opacity-15',
            fish: 'absolute top-[35%] right-2 lg:right-8 w-20 lg:w-64 rotate-[5deg] translate-x-0 lg:translate-x-32 opacity-15',
            logo: 'absolute bottom-5 right-2 lg:right-0 w-24 lg:w-52 rotate-[-6deg] translate-x-0 lg:translate-x-3 translate-y-0 lg:translate-y-3 opacity-15',
            grapes: 'absolute bottom-0 left-2 lg:left-6 w-20 lg:w-36 rotate-[-1deg] -translate-x-0 lg:-translate-x-4 opacity-15'
          }}
        />
      </div>
      
      {/* Subtle Divider - Top */}
      <div className="w-full h-px"></div>
      
      <div className="mx-4 sm:mx-[30px] md:mx-[30px] lg:mx-[30px] xl:mx-[100px] py-16 sm:py-20 md:py-24 lg:py-28 xl:py-18 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          
           {/* Main Heading with underline */}
           <h2 className="font-lexend text-beige tracking-[0.15em] uppercase text-3xl sm:text-2xl md:text-5xl font-medium mb-14 relative inline-block">
             Contact Us
           </h2>
          
          {/* Sub-Heading */}
          <h3 className="font-lexend text-beige uppercase tracking-[0.1em] text-md sm:text-base md:text-lg font-regular mb-6">
            Group Reservations & Celebrations
          </h3>
          
          {/* Body */}
          <p className="font-lexend text-beige font-extralight text-sm sm:text-base md:text-lg leading-7 sm:leading-11 md:leading-8 mb-8">
            Planning a milestone, birthday, or large group dinner in Siargao? <br /><br />
            At Lyma, we create unforgettable dining experiences tailored to your occasion.
          </p>
          
           {/* Contact Details - Styled like reservation page */}
           <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 mb-10">
             <div className="flex items-center space-x-2">
               <Phone className="w-4 h-4 text-beige" />
               <span className="text-beige font-lexend font-extralight text-sm sm:text-base">
                 +63 929 756 1379
               </span>
             </div>
             <div className="flex items-center space-x-2">
               <Instagram className="w-4 h-4 text-beige" />
               <span className="text-beige font-lexend font-extralight text-sm sm:text-base">
                 @lymasiargao
               </span>
             </div>
           </div>
          
          {/* Highlights (Condensed into one elegant line) */}
          <p className="font-lexend text-beige/80 font-light text-xs sm:text-sm md:text-base leading-7 italic mb-12">
            Tailored menus, curated wine pairings, and elegant setups for weddings, anniversaries, and private celebrations.
          </p>
          
          {/* Reservation Button */}
          <div className="flex justify-center">
            <a 
              href="/reservation" 
              className="inline-flex items-center gap-3 font-lexend font-semibold tracking-[0.25em] text-olive uppercase text-xs sm:text-base md:text-lg px-8 py-4 bg-beige hover:bg-beige/10 transition-colors"
            >
              Make a Reservation
              <Arrow color="olive" size="md" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Subtle Divider - Bottom */}
      <div className="w-full h-px bg-beige/20"></div>
    </section>
  );
};

export default ContactSection;
