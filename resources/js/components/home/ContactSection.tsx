import React from "react";
import Arrow from "../Arrow";
import { Phone, Instagram } from "lucide-react";

const ContactSection: React.FC = () => {
  return (
    <section className="w-full bg-olive text-beige relative overflow-hidden">
      {/* Subtle Divider - Top */}
      <div className="w-full h-px"></div>
      
      <div className="mx-4 sm:mx-[30px] md:mx-[30px] lg:mx-[30px] xl:mx-[100px] py-16 sm:py-20 md:py-24 lg:py-28 xl:py-18 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          
           {/* Main Heading with underline */}
           <h2 className="font-lexend text-beige tracking-[0.15em] uppercase text-3xl sm:text-2xl md:text-5xl font-medium mb-14 relative inline-block">
             Contact Us
             <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-32 lg:w-54 h-px bg-beige"></div>
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
