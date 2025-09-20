import React from "react";
import Arrow from "../Arrow";

const MenuSection: React.FC = () => {
  return (
    <section className="w-full bg-olive font-lexend overflow-hidden pt-16 sm:pt-20 md:pt-24 lg:pt-28 xl:pt-32 2xl:pt-[100px] pb-10 relative">
      <div className="relative w-full z-10">
        <svg
          viewBox="0 0 1540 350"
          preserveAspectRatio="none"
          className="block w-full h-[480px] sm:h-[520px] md:h-[580px] lg:h-[700px] xl:h-[800px] 2xl:h-[1100px] scale-[1.2] origin-center"
          aria-hidden="true"
        >
          {/* Base beige fill below the arch - extended height for mobile content */}
          <path
            d="M0,500 L0,200 A770,200 0 0 1 1540,200 L1540,500 Z"
            className="text-beige"
            fill="currentColor"
          />
        </svg>

        {/* Content inside the arch */}
        <div className="absolute inset-0 flex flex-col items-center pt-8 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-20 2xl:pt-50 px-2 sm:px-4">
          {/* Refined title - mobile split, desktop single line */}
          <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <h2 className="font-lexend text-olive text-center tracking-[0.15rem] sm:tracking-[0.2rem] lg:tracking-[0.25rem] uppercase font-light">
              {/* Mobile: Split lines */}
              <span className="lg:hidden">
                <span className="block text-lg sm:text-xl md:text-2xl relative">
                  A Journey
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-px bg-olive/30 hidden sm:block"></span>
                </span>
                <span className="block text-lg sm:text-xl md:text-2xl mt-2 sm:mt-4">
                  Through Flavors
                </span>
              </span>
              {/* Desktop: Single line with larger size */}
              <span className="hidden lg:block text-4xl xl:text-5xl 2xl:text-6xl">
                A Journey Through Flavors
              </span>
            </h2>
          </div>

          {/* 3 images extending to screen edges on all breakpoints */}
          <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-12 xl:mt-14 2xl:mt-[100px] w-screen -mx-2 sm:-mx-4 lg:-mx-8 xl:-mx-16 2xl:-mx-24">
            <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-[64px] px-0">
              {[
                { src: "/assets/images/menu1.webp", alt: "Food dish 1", position: "object-left" }, 
                { src: "/assets/images/menu2.webp", alt: "Food dish 2", position: "object-center" },  
                { src: "/assets/images/menu3.webp", alt: "Food dish 3", position: "object-center" }, 
              ].map((image, i) => (
                <div key={i} className="w-full h-32 sm:h-48 md:h-64 lg:h-80 xl:h-[20rem] 2xl:h-[24rem] overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={`w-full h-full object-cover ${image.position}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Refined description with chef section styling */}
          <div className="mt-3 sm:mt-4 md:mt-6 lg:mt-8 xl:mt-10 max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto text-center px-2 sm:px-4 pb-4 sm:pb-6">
            <div className="space-y-3 sm:space-y-4 md:space-y-5 mb-4 sm:mb-6 md:mb-8">
              <p className="font-lexend text-olive font-light text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
                At Lyma Siargao, our à la carte menu showcases international fine dining in General Luna while honoring local Filipino ingredients.
              </p>
              
              <div className="w-8 h-px bg-olive/20 mx-auto hidden sm:block"></div>
              
              <p className="font-lexend text-olive font-light text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
                From seafood crudos to creative vegan options, every dish reflects sustainability, craftsmanship, and innovation.
              </p>
            </div>
            
            {/* Elegant CTA matching standardized style */}
            <div className="relative">
              <a
                href="/menu"
                className="inline-flex items-center gap-2 font-lexend font-semibold tracking-[0.25em] text-olive uppercase text-[9px] sm:text-xs md:text-sm lg:text-base"
              >
                Experience the Flavors
                <Arrow color="olive" size="sm" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;