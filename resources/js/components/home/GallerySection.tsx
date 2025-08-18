import React from "react";

const GallerySection: React.FC = () => {
  return (
    <section className="w-full bg-olive text-beige relative overflow-hidden">
      {/* Subtle background icons - visible yet subtle */}
      <div className="pointer-events-none select-none absolute inset-0 z-0" aria-hidden="true">
        {/* Primary focal element - Carabao (left side, main anchor) */}
        <img
          src="/assets/images/carabao_beige.webp"
          alt=""
          className="absolute top-1/2 -translate-y-1/2 left-6 lg:left-12 w-32 lg:w-52 rotate-[-10deg]"
          style={{ opacity: 0.08 }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />

        {/* Secondary accent - Fish (upper right) */}
        <img
          src="/assets/images/fish_beige.webp"
          alt=""
          className="absolute top-[35%] right-4 lg:right-8 w-26 lg:w-64 rotate-[5deg] translate-x-32"
          style={{ opacity: 0.07 }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />

        {/* Ground element - Grapes (bottom left) */}
        <img
          src="/assets/images/grapes_beige.webp"
          alt=""
          className="absolute bottom-0 left-2 lg:left-6 w-22 lg:w-36 rotate-[-1deg] -translate-x-4"
          style={{ opacity: 0.06 }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />

        {/* Delicate accents - strategically placed */}
        <img
          src="/assets/images/shell_beige.webp"
          alt=""
          className="hidden lg:block absolute top-12 left-[28%] w-14 rotate-[6deg]"
          style={{ opacity: 0.05 }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />

        <img
          src="/assets/images/lime_beige.webp"
          alt=""
          className="hidden md:block absolute bottom-[15%] right- lg:right-75 w-12 lg:w-24 rotate-[10deg]"
          style={{ opacity: 0.07 }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />

        {/* Complementary elements - spaced for balance */}
        <img
          src="/assets/images/jar_beige.webp"
          alt=""
          className="hidden lg:block absolute top-[8%] right-[20%] w-14 xl:w-18 rotate-[-5deg]"
          style={{ opacity: 0.045 }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />

        <img
          src="/assets/images/bamboo_beige.webp"
          alt=""
          className="hidden xl:block absolute right-[25%] top-99 translate-x-12 w-22 rotate-[2deg]"
          style={{ opacity: 0.045 }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />

        <img
          src="/assets/images/coconut_beige.webp"
          alt=""
          className="hidden lg:block absolute bottom-[2%] right-[40%] w-14 lg:w-18 rotate-[3deg]"
          style={{ opacity: 0.04 }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />

        {/* Whisper elements - filling gaps without crowding */}
        <img
          src="/assets/images/scallop_beige.webp"
          alt=""
          className="hidden md:block absolute bottom-[25%] left-[15%] w-11 lg:w-20 rotate-[-7deg]"
          style={{ opacity: 0.035 }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />

        <img
          src="/assets/images/leaf_beige.webp"
          alt=""
          className="hidden xl:block absolute top-20 right-[40%] w-18 -rotate-2"
          style={{ opacity: 0.035 }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />

        <img
          src="/assets/images/sugarcane_beige.webp"
          alt=""
          className="hidden md:block absolute top-40 left-0 w-14 lg:w-26 -rotate-5 translate-x-50"
          style={{ opacity: 0.04 }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />

        {/* Brand watermark - subtle but visible */}
        <img
          src="/assets/logo/lymaonly_beige.webp"
          alt=""
          className="absolute bottom-5 right-0 w-36 lg:w-52 rotate-[-6deg] translate-x-3 translate-y-3"
          style={{ opacity: 0.035 }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      {/* Mobile Layout: sm and md breakpoints */}
      <div className="block lg:hidden px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 relative z-10">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <p className="font-lexend tracking-[0.1rem] sm:tracking-[0.15rem] md:tracking-[0.2rem] mb-4 sm:mb-6 uppercase leading-tight text-xs sm:text-sm md:text-sm font-light text-beige">
            A GLIMPSE INTO
          </p>
          <p className="font-lexend tracking-[0.1rem] sm:tracking-[0.15rem] md:tracking-[0.2rem] uppercase text-2xl sm:text-3xl md:text-4xl font-extralight">
            LYMA'S WORLD
          </p>
        </div>

        {/* 3 Images Stacked Vertically */}
        <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
          {/* Image 1 */}
          <div className="w-48 sm:w-56 md:w-64 h-48 sm:h-56 md:h-64 overflow-hidden rounded-none shadow-lg">
            <img
              src="/assets/images/gallery1.webp"
              alt="Gallery image 1"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          {/* Image 2 */}
          <div className="w-48 sm:w-56 md:w-64 h-48 sm:h-56 md:h-64 overflow-hidden rounded-none shadow-lg">
            <img
              src="/assets/images/gallery2.webp"
              alt="Gallery image 2"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          {/* Image 3 */}
          <div className="w-48 sm:w-56 md:w-64 h-48 sm:h-56 md:h-64 overflow-hidden rounded-none shadow-lg">
            <img
              src="/assets/images/gallery3.webp"
              alt="Gallery image 3"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Description */}
        <div className="text-center max-w-lg mx-auto">
          <p className="font-lexend text-sm sm:text-base md:text-lg leading-6 sm:leading-7 md:leading-8 font-light text-beige mb-6 sm:mb-8">
          Discover Lyma through moments on the plate — a showcase of flavors, textures, and details captured in every dish
          </p>
          <a
            href="/gallery"
            className="inline-flex items-center gap-2 font-lexend text-xs sm:text-sm md:text-base font-extralight tracking-widest hover:text-beige"
          >
            GALLERY 
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>

      {/* Desktop Layout: lg and up (original) */}
      <div className="hidden lg:block mx-[100px] py-20 md:py-28 relative z-10">
        {/* Left + Right columns */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24 items-stretch">
          {/* Left column: heading + description + CTA */}
          <div className="flex flex-col h-full">
            {/* Heading */}
            <div className="mt-8 ml-100">
              <p className="font-lexend lg:-ml-100 xl:-ml-25 2xl:ml-50 tracking-[0.2rem] mb-6 uppercase leading-tight text-sm font-light text-beige m-0 p-0">
                A GLIMPSE INTO
              </p>
              <p className="font-lexend lg:-ml-115 xl:-ml-55 2xl:ml-25 tracking-[0.2rem] uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight -ml-3">
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
        <div className="absolute font-lexend text-center font-light text-beige lg:left-[-60px] lg:bottom-[120px] xl:left-[200px] xl:bottom-[100px] 2xl:left-[525px] 2xl:bottom-[125px]">
          <p className="text-base lg:text-sm lg:max-w-sm lg:-mb-0 xl:text-sm xl:leading-12 lg:leading-12">
          Discover Lyma through moments on the plate — a showcase of flavors, textures, and details captured in every dish
          </p>
          <a
            href="/gallery"
            className="mt-6 inline-flex items-center gap-2 font-lexend lg:text-sm xl:text-lg font-extralight tracking-widest hover:text-beige"
          >
            GALLERY 
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;