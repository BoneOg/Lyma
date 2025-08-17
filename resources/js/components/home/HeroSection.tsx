import React from 'react';
import { TextEffect } from '@/animation/text-effect';
import { Link } from '@inertiajs/react';
import RectangleDraw from '@/animation/rectangleDraw';

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/assets/images/hero.webp" 
          alt="Lyma Restaurant Hero" 
          className="w-full h-full object-cover object-[85%_center] sm:object-[85%_center]  md:object-[85%_center]  lg:object-cover"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="ml-4 sm:ml-8 md:ml-[30px] lg:ml-[30px] xl:ml-[100px] text-white -mt-10 text-center md:text-left">
          <TextEffect per='word' preset='slide' delay={0.2} speedReveal={0.5} as="h1" className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-lexend font-extralight text-beige mb-4 -ml-2 leading-tight">
            FIVE PILLARS. ONE VISION.
          </TextEffect>
          <div className="mb-8">
            <TextEffect per='word' preset='slide' delay={0.1} speedReveal={0.5} as="p" className="text-xs sm:text-base md:text-sm lg:text-sm xl:text-lg 2xl:text-lg font-lexend font-extralight text-white/70 mb-2">
              A culinary journey through tradition and innovation
            </TextEffect>
          </div>
          
          {/* RESERVE NOW Button */}
          <RectangleDraw
            borderColor="beige"
            borderWidth="h-px"
            duration={0.2}
            delay={0.1}
            className="mt-10"
          >
            <Link
              href="/reservation"
              className="flex items-center gap-2 font-lexend text-md sm:text-base md:text-1xl lg:text-sm xl:text-lg 2xl:text-lg font-extralight tracking-widest text-beige transition-colors duration-300 z-10 px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6"
            >
              <TextEffect per='word' preset='slide' delay={0.1} speedReveal={0.3} as="span">
                RESERVE NOW
              </TextEffect>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                  <path fill="#FAF7CA" d="M17.47 7.47a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0v-3.78H2a.75.75 0 0 1 0-1.5h15.47z" />
                </svg>
              </span>
            </Link>
          </RectangleDraw>
        </div>
      </div>

      {/* SIARGAO - Bottom Left */}
      <div className="absolute bottom-0 left-0 z-10 ml-4 sm:ml-8 md:ml-[30px] lg:ml-[30px] xl:ml-[100px] mb-8 sm:mb-12 md:mb-16">
        <TextEffect per='word' preset='slide' delay={1.0} as="h2" className="text-sm sm:text-base md:text-md lg:text-sm 2xl:text-md font-lexend font-extralight text-beige">
          SIARGAO
        </TextEffect>
      </div>
    </section>
  );
};

export default HeroSection;
