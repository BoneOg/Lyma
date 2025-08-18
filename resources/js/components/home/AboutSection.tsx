import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="w-full bg-olive text-beige relative overflow-hidden">
      {/* Balanced minimalist background - visible yet subtle */}
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

      <div className="mx-4 sm:mx-[30px] md:mx-[30px] lg:mx-[30px] xl:mx-[100px] py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 relative z-10">
        {/* Mobile/Tablet Layout (sm and md) - Single column with image below name */}
        <div className="lg:hidden">
          {/* Heading */}
          <div className="mb-6 sm:mb-8 md:mb-10">
            <p className="font-lexend tracking-[0.2rem] mb-4 sm:mb-6 -ml-1 uppercase leading-tight text-[10px] sm:text-sm font-light text-beige/60 m-0 p-0">
              Meet Chef
            </p>
            <p className="font-lexend tracking-[0.2rem] uppercase text-[23px] sm:text-3xl md:text-4xl font-extralight -ml-1 sm:-ml-2 md:-ml-3">
              Marc Silvestre
            </p>
          </div>

          {/* Chef Image - Below name for sm and md */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            <img
              src="/assets/images/about_chef.webp"
              alt="Chef Marc Silvestre holding a rack of ribs in the kitchen"
              className="h-[280px] w-full object-cover sm:h-[320px] md:h-[400px]"
              loading="lazy"
            />
          </div>

          {/* Copy */}
          <div className="max-w-xl sm:max-w-xl md:max-w-3xl lg:max-w-xl xl:max-w-2xl font-lexend text-beige">
            <p className="font-extralight text-sm leading-6 sm:text-base sm:leading-7 md:text-lg md:leading-8">
            With over 14 years of international experience, Chef Marc brings his passion and vision to Siargao. At Lyma, he expresses his craft as a balance of tradition and innovation, turning the island into his canvas for creativity and storytelling.
            </p>
            <a
              href="/about"
              className="mt-4 sm:mt-6 uppercase inline-flex items-center gap-2 font-lexend text-xs sm:text-sm md:text-base font-regular tracking-widest hover:text-beige"
            >
              Discover Marc’s Story 
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        {/* Desktop Layout (lg and up) - Two column layout */}
        <div className="hidden lg:grid grid-cols-[1.2fr_0.8fr] xl:grid-cols-[1.4fr_0.6fr] 2xl:grid-cols-[1.5fr_0.5fr] gap-16 xl:gap-24 items-stretch">
          {/* Left column: heading + media/text row */}
          <div className="flex flex-col h-full">
            {/* Heading */}
            <div className="mb-8">
              <p className="font-lexend tracking-[0.2rem] mb-6 uppercase leading-tight text-sm font-light text-beige/60 m-0 p-0">
                Meet Chef
              </p>
              <p className="font-lexend tracking-[0.2rem] uppercase text-6xl xl:text-7xl 2xl:text-8xl font-extralight -ml-1.5 xl:-ml-2">
                Marc Silvestre
              </p>
            </div>

            {/* Row: small image at bottom left + text on the right */}
            <div className="flex flex-row gap-10 items-end mt-auto">
              {/* Left small image - positioned at bottom */}
              <div className="shrink-0">
                <img
                  src="/assets/images/about1.webp"
                  alt="Assorted olives and ingredients"
                  className="h-48 w-full xl:h-68 xl:-ml-2 object-cover"
                  loading="lazy"
                />
              </div>

              {/* Copy - positioned to the right of the image */}
              <div className=" font-lexend text-beige ">
                <p className="font-extralight text-xl leading-5 lg:text-xs xl:text-lg 2xl:text-xl 2xl:leading-8 xl:leading-7 2xl:-mt-60">
                With over 14 years of international experience, Chef Marc brings his passion and vision to Siargao. At Lyma, he expresses his craft as a balance of tradition and innovation, turning the island into his canvas for creativity and storytelling.
                </p>
                <a
                  href="/about"
                  className="mt-6 2xl:mt-18 uppercase inline-flex items-center gap-2 font-lexend text-lg lg:text-sm xl:text-lg 2xl:text-2xl font-regular tracking-widest hover:text-beige"
                >
                  Discover Marc’s Story 
                  <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right column: hero image */}
          <div className="w-full">
            <img
              src="/assets/images/about_chef.webp"
              alt="Chef Marc Silvestre holding a rack of ribs in the kitchen"
              className="h-[480px] w-full object-cover xl:h-[560px] 2xl:h-[640px]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;