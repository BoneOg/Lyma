import React from 'react';
import PatternBackground from '@/components/PatternBackground';
import Arrow from '../Arrow';

const ChefSection: React.FC = () => {
  return (
    <section className="w-full bg-olive text-beige relative overflow-hidden">
      <PatternBackground />

      <div className="px-0 py-0 sm:py-16 md:py-20 lg:py-24 xl:py-28 relative z-10">
        {/* Mobile/Tablet Layout (sm and md) - Background images with overlay */}
        <div className="lg:hidden relative min-h-[500px] sm:min-h-[600px] md:min-h-[650px]">
          {/* Background Images - Behind content */}
          <div className="absolute inset-0 z-0">
            {/* Left Image - Higher position, oversized to extend beyond screen */}
            <div className="absolute left-0 top-4 sm:top-8 md:top-12 w-48 sm:w-72 md:w-96 h-72 sm:h-[400px] md:h-[500px] -translate-x-12 sm:-translate-x-20 md:-translate-x-24">
              <img
                src="/assets/images/chef2.webp"
                alt=""
                className="w-full h-full object-cover opacity-40"
                loading="lazy"
              />
              {/* Dark overlay for image shadow */}
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
            
            {/* Right Image - Lower position, oversized to extend beyond screen */}
            <div className="absolute right-0 bottom-4 sm:bottom-8 md:bottom-12 w-48 sm:w-72 md:w-96 h-72 sm:h-[400px] md:h-[500px] translate-x-12 sm:translate-x-20 md:translate-x-24">
              <img
                src="/assets/images/chef1.webp"
                alt=""
                className="w-full h-full object-cover opacity-40"
                loading="lazy"
              />
              {/* Dark overlay for image shadow */}
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          </div>

          {/* Content - Above background */}
          <div className="relative z-20 px-4 sm:px-6 md:px-8 flex items-center justify-center min-h-[500px] sm:min-h-[600px] md:min-h-[650px]">
            <div className="text-center max-w-xs sm:max-w-sm md:max-w-lg">
              {/* Heading with refined styling */}
              <div className="mb-8 sm:mb-10 md:mb-12">
                <p className="font-lexend tracking-[0.3rem] mb-3 sm:mb-4 uppercase text-[9px] sm:text-xs font-light text-beige/50">
                  Meet Chef
                </p>
                <h1 className="font-lexend tracking-[0.15rem] uppercase text-xl sm:text-2xl md:text-3xl font-light mt-6 sm:mt-8">
                  Marc Silvestre
                </h1>
              </div>

              {/* Refined body text with better spacing */}
              <div className="space-y-4 sm:space-y-5 md:space-y-6 mb-8 sm:mb-10 md:mb-12">
                <p className="font-lexend font-light text-xs sm:text-sm md:text-base leading-relaxed text-beige/90">
                  Born in L'Escala, Catalonia, Spain, Chef Marc Silvestre Carbó brings the flavors of Spanish cuisine and European finesse to the Philippines.
                </p>
                
                <p className="font-lexend font-light text-xs sm:text-sm md:text-base leading-relaxed text-beige/90">
                  Since moving to Siargao in 2017, Marc has become known as one of the leading international chefs, weaving together French finesse, Spanish tradition, and Filipino ingredients to create dishes that tell the story of Siargao.
                </p>
              </div>

              {/* Elegant CTA */}
              <div className="relative">
                <a
                  href="/about"
                  className="inline-flex items-center gap-2 font-lexend font-semibold tracking-[0.25em] text-beige uppercase text-xs sm:text-sm md:text-base"
                >
                  Chef Marc's Story
                  <Arrow color="beige" size="md" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout (lg and up) - Full width with centered content and side images */}
        <div className="hidden lg:block relative min-h-[500px] xl:min-h-[700px] 2xl:min-h-[800px]">
          {/* Left Image - Higher position */}
          <div className="absolute left-0 top-0 flex items-start">
            <img
              src="/assets/images/chef2.webp"
              alt="Chef Marc working in kitchen"
              className="max-w-[150px] lg:max-w-[250px] xl:max-w-[400px] 2xl:max-w-[400px] aspect-[9/16] object-cover -translate-y-4 xl:-translate-y-12 2xl:-translate-y-16 -translate-x-[20%] xl:-translate-x-[25%] 2xl:-translate-x-[25%]"
              loading="lazy"
            />
          </div>

          {/* Right Image - Lower position */}
          <div className="absolute right-0 bottom-0 flex items-end justify-end">
            <img
              src="/assets/images/chef1.webp"
              alt="Chef Marc Silvestre portrait"
              className="max-w-[150px] lg:max-w-[250px] xl:max-w-[400px] 2xl:max-w-[400px] aspect-[9/16] object-cover translate-y-4 xl:translate-y-12 2xl:translate-y-16 translate-x-[20%] xl:translate-x-[25%] 2xl:translate-x-[25%]"
              loading="lazy"
            />
          </div>

          {/* Center Content - Full width with max constraint */}
          <div className="flex items-center justify-center min-h-[500px] xl:min-h-[700px] 2xl:min-h-[700px] px-8 xl:px-16 2xl:px-24">
            <div className="text-center font-lexend text-beige max-w-3xl xl:max-w-5xl 2xl:max-w-6xl">
              {/* Heading */}
              <div className="mb-6 xl:mb-10 2xl:mb-12">
                <p className="font-lexend tracking-[0.2em] mb-3 xl:mb-6 uppercase leading-tight text-lg lg:text-4xl xl:text-5xl font-light text-beige/60">
                  Meet Chef:
                </p>
                <p className="font-lexend tracking-[0.2em] uppercase text-lg lg:text-4xl xl:text-5xl font-light">
                  Marc Silvestre
                </p>
              </div>

              {/* Body Text */}
              <div className="mb-6 xl:mb-10 2xl:mb-12">
                <p className="font-lexend font-extralight text-sm lg:text-base xl:text-xl leading-6 lg:leading-7 xl:leading-9 max-w-xl xl:max-w-3xl 2xl:max-w-3xl mx-auto">
                  Born in L'Escala, Catalonia, Spain, Chef Marc Silvestre Carbó brings the flavors of Spanish cuisine and the finesse of European fine dining to the Philippines. 
                  <br /><br />  
                  Since moving to Siargao in 2017, Marc has become known as one of the leading international chefs in the Philippines, weaving together French finesse, Spanish tradition, Asian creativity, and the richness of Filipino ingredients to create dishes that tell the story of Siargao.
                </p>
              </div>

              {/* CTA Button */}
              <div>
                <a
                  href="/about"
                  className="inline-flex items-center gap-2 font-lexend font-semibold tracking-[0.2em] text-beige uppercase text-xs lg:text-sm xl:text-base 2xl:text-lg"
                >
                  Chef Marc's Story 
                  <Arrow color="beige" size="md" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChefSection;