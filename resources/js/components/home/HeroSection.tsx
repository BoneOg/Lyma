import React from 'react';
import { TextEffect } from '@/animation/text-effect';

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/assets/images/hero.webp" 
          alt="Lyma Restaurant Hero" 
          className="w-full h-full object-cover"
          style={{
            objectPosition: 'center 70%'
          }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="ml-[100px] text-white -mt-30">
          <TextEffect per='word' preset='slide' delay={0.2} speedReveal={0.5} as="h1" className="text-5xl md:text-7xl font-lexend font-extralight text-beige mb-4 leading-tight">
            FIVE PILLARS. ONE VISION.
          </TextEffect>
          <div className="mb-8">
            <TextEffect per='word' preset='slide' delay={0.1} speedReveal={0.5} as="p" className="text-lg md:text-xl font-lexend font-extralight text-white/70 mb-2">
              A culinary journey through tradition and innovation
            </TextEffect>
          </div>
        </div>
      </div>

      {/* SIARGAO - Bottom Left */}
      <div className="absolute bottom-0 left-0 z-10 ml-[100px] mb-16">
        <TextEffect per='word' preset='slide' delay={1.0} as="h2" className="text-md md:text-md font-lexend font-extralight text-beige">
          SIARGAO
        </TextEffect>
      </div>
    </section>
  );
};

export default HeroSection;
