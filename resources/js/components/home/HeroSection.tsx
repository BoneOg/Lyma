import React from 'react';
import { TextEffect } from '@/animation/text-effect';
import Arrow from '../Arrow';

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/assets/images/hero.webp" 
          alt="Lyma Restaurant Hero - Fine Dining in General Luna, Siargao" 
          className="w-full h-full object-cover object-[30%_center] sm:object-center md:object-center lg:object-cover"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-[#3c4119]/30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="w-full text-white text-center">
          {/* Main H1 with Lyma brand name */}
          <h1 className="sr-only">Lyma - Fine Dining Restaurant in General Luna, Siargao</h1>
          
          <TextEffect per='word' preset='slide' delay={0.2} speedReveal={0.5} as="h2" className="text-3xl sm:text-2xl md:text-5xl lg:text-5xl xl:text-8xl 2xl:text-8xl font-lexend font-thin text-beige mb-4 leading-tight tracking-[0.20rem] lg:tracking-[0.75rem] xl:tracking-[1rem] uppercase">
            SUSTAINABILITY
          </TextEffect>
          <div className="mb-8">
            <TextEffect per='word' preset='slide' delay={0.1} speedReveal={0.5} as="p" className="text-[10px] sm:text-base md:text-sm lg:text-sm xl:text-lg 2xl:text-lg font-lexend font-light text-white/80 tracking-[0.20rem] lg:tracking-[0.25rem] xl:tracking-[0.50rem] mb-2">
              AT THE HEART OF EVERY FLAVOR
            </TextEffect>
          </div>
          
          {/* RESERVE NOW Button */}
          <div className="flex justify-center">
              <a 
                href="/reservation" 
                className="inline-flex items-center gap-3 font-lexend font-extralight tracking-[0.25em] text-beige uppercase text-[10px] sm:text-base md:text-lg px-4 py-2 xl:px-8 xl:py-4 transition-colors"
              >
                Reserve Now
                <Arrow color="beige" size="sm" className="xl:!w-6 xl:!h-6"/>
              </a>
          </div>
        </div>
      </div>

      {/* Bottom-left label removed per request */}
    </section>
  );
};

export default HeroSection;
