import React from "react";
import PatternBackground from '@/components/PatternBackground';
import Arrow from '../Arrow';

const GallerySection: React.FC = () => {
  return (
    <section className="w-full bg-olive text-beige relative overflow-hidden">
      <PatternBackground />

      {/* Mobile Layout: Stacked overlapping images */}
      <div className="block lg:hidden px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 relative z-10">
        
        {/* Added spacing to compensate for removed heading section */}
        <div className="mb-8 sm:mb-10 md:mb-12"></div>

        {/* Stacked Images with Overlapping Layout */}
        <div className="relative w-full h-[400px] sm:h-[480px] md:h-[540px] mb-8 sm:mb-10 md:mb-12 flex justify-center">
          
          {/* A GLIMPSE INTO and LYMA'S WORLD text positioned to the left of first image */}
          <div className="absolute top-6 left-4 sm:left-12 md:left-16 z-40">
            <p className="font-lexend text-center tracking-[0.1rem] sm:tracking-[0.15rem] md:tracking-[0.2rem] uppercase text-[8px] sm:text-sm font-light text-beige mb-2">
              A GLIMPSE INTO
            </p>
            <p className="font-lexend tracking-[0.1rem] sm:tracking-[0.15rem] md:tracking-[0.2rem] uppercase text-3xl sm:text-3xl md:text-4xl font-extralight leading-tight text-beige">
              LYMA'S<br />WORLD
            </p>
          </div>
          {/* Image 1 (Top Right) */}
          <div className="absolute top-0 right-3 sm:right-12 md:right-16 w-44 sm:w-40 md:w-48 h-44 sm:h-40 md:h-48 overflow-hidden shadow-lg z-30">
            <img
              src="/assets/images/gallery1.webp"
              alt="Gallery image 1"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          {/* Image 2 (Middle Left) */}
          <div className="absolute top-[40%] sm:top-20 md:top-24 left-3 sm:left-12 md:left-16 w-44 sm:w-40 md:w-48 h-44 sm:h-40 md:h-48 overflow-hidden shadow-lg z-20">
            <img
              src="/assets/images/gallery2.webp"
              alt="Gallery image 2"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          {/* Image 3 (Bottom Right) */}
          <div className="absolute top-[80%] right-3 sm:right-16 md:right-20 w-44 sm:w-40 md:w-48 h-44 sm:h-40 md:h-48 overflow-hidden shadow-lg z-10">
            <img
              src="/assets/images/gallery3.webp"
              alt="Gallery image 3"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Mobile-only description and CTA positioned to the left of 3rd image */}
          <div className="absolute top-[90%] text-center left-3 sm:left-12 md:left-16 z-40 max-w-[150px] sm:max-w-[250px]">
            <p className="font-lexend text-[10px]  leading-4 sm:leading-4 font-extralight text-beige mb-3 sm:mb-4">
              Discover Lyma through moments on the plate — a showcase of flavors, textures, and details captured in every dish
            </p>
            <a
              href="/gallery"
              className="inline-flex items-center gap-1 -mr-2 font-lexend font-semibold tracking-[0.25em] text-beige uppercase text-[10px]"
            >
              GALLERY 
              <Arrow color="beige" size="sm" />
            </a>
          </div>
        </div>

        {/* Added bottom spacing to compensate for moved description and CTA */}
        <div className="mb-28 sm:mb-28 md:mb-28"></div>
      </div>

      {/* Desktop Layout: lg and up (original) */}
      <div className="hidden lg:block mx-[100px] py-20 md:py-28 relative z-10">
        {/* Left + Right columns */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24 items-stretch">
          {/* Left column: heading + description + CTA */}
          <div className="flex flex-col h-full">
            {/* Heading */}
            <div className="mt-8 xl:ml-55 2xl:ml-55 text-center">
              <p className="font-lexend tracking-[0.2rem] mb-6 uppercase leading-tight text-sm font-light text-beige m-0 p-0">
                A GLIMPSE INTO
              </p>
              <p className="font-lexend tracking-[0.2rem] uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight">
                LYMA'S WORLD
              </p>
            </div>
          </div>

          {/* Right column: food image collage */}
          <div className="w-full flex justify-center items-center">
            <div className="relative w-[400px] h-[500px] lg:w-[480px] lg:h-[1000px]">
              {/* Image 1 (Top Center) - Gallery image 1 */}
              <div className="absolute top-0 left-1/4 transform -translate-x-1/2 w-100 h-100 overflow-hidden rounded-none shadow-lg z-30">
                <img
                  src="/assets/images/gallery1.webp"
                  alt="Gallery image 1"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              {/* Image 2 (Middle Left) - Gallery image 2 */}
              <div className="absolute top-80 right-115 w-100 h-100 overflow-hidden rounded-none shadow-lg z-20">
                <img
                  src="/assets/images/gallery2.webp"
                  alt="Gallery image 2"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              {/* Image 3 (Bottom Right) - Gallery image 3 */}
              <div className="absolute bottom-0 left-1/4 transform -translate-x-1/2 w-100 h-100 overflow-hidden rounded-none shadow-lg z-10">
                <img
                  src="/assets/images/gallery3.webp"
                  alt="Gallery image 3"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description - Now positioned absolutely to break free from grid constraints */}
        <div className="absolute font-lexend text-center font-light text-beige xl:ml-65 2xl:ml-65 lg:bottom-[120px] xl:bottom-[150px] 2xl:bottom-[125px]">
          <p className="text-base lg:text-sm lg:max-w-sm lg:-mb-0 xl:text-sm xl:leading-12 lg:leading-12">
          Discover Lyma through moments on the plate — a showcase of flavors, textures, and details captured in every dish
          </p>
          <a
            href="/gallery"
            className="mt-6 inline-flex items-center gap-2 font-lexend font-semibold tracking-[0.25em] text-beige uppercase lg:text-sm xl:text-lg"
          >
            GALLERY 
            <Arrow color="beige" size="md" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;