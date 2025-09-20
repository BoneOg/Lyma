import React from 'react';
import PatternBackground from '@/components/PatternBackground';
import Arrow from '../Arrow';

const AboutSection: React.FC = () => {
  const images = [
    { src: '/assets/images/about1.webp', offset: 'translate-y-6 sm:translate-y-8 md:translate-y-10' },
    { src: '/assets/images/about2.webp', offset: '-translate-y-4 sm:-translate-y-6 md:-translate-y-8' },
    { src: '/assets/images/about3.webp', offset: 'translate-y-2 sm:translate-y-4 md:translate-y-6' },
    { src: '/assets/images/about4.webp', offset: '-translate-y-3 sm:-translate-y-5 md:-translate-y-8' },
    { src: '/assets/images/about5.webp', offset: 'translate-y-8 sm:translate-y-10 md:translate-y-12' },
  ];

  const mobileImages = [
    { src: '/assets/images/about1.webp', side: 'left' },
    { src: '/assets/images/about2.webp', side: 'right' },
    { src: '/assets/images/about3.webp', side: 'left' },
    { src: '/assets/images/about4.webp', side: 'right' },
    { src: '/assets/images/about5.webp', side: 'left' },
  ];

  return (
    <section className="relative w-full bg-olive text-white overflow-hidden pb-16 py-16">
      {/* PatternBackground - lowest layer */}
      <div className="absolute inset-0 z-0">
        <PatternBackground />
      </div>
      
      {/* Desktop Background strip images (staggered up/down) - middle layer */}
      <div className="absolute inset-0 z-10 hidden md:grid grid-cols-5 gap-8 px-6 sm:px-8 md:px-[30px] lg:px-[30px] xl:px-[100px] items-center py-16 sm:py-20 md:py-24 lg:py-28">
        {images.map((item, idx) => (
          <div key={idx} className={`relative h-[420px] sm:h-[480px] md:h-[520px] lg:h-[560px] xl:h-[600px] 2xl:h-[640px] ${item.offset}`}>
            <img
              src={item.src}
              alt=""
              className="w-full h-full object-cover opacity-70"
              loading="lazy"
            />
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/70 bg-blend-multiply"></div>
          </div>
        ))}
      </div>

      {/* Mobile Background images (stacked vertically, staggered left/right) - middle layer */}
      <div className="absolute inset-0 z-10 md:hidden flex flex-col justify-center space-y-4">
        {mobileImages.map((item, idx) => (
          <div 
            key={idx} 
            className={`relative h-32 sm:h-36 w-3/5 ${
              item.side === 'left' ? 'self-start' : 'self-end'
            }`}
          >
            <img
              src={item.src}
              alt=""
              className="w-full h-full object-cover opacity-70"
              loading="lazy"
            />
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/70 bg-blend-multiply"></div>
          </div>
        ))}
      </div>

      {/* Centered copy - top layer */}
      <div className="relative z-20 flex items-center justify-center py-28 sm:py-32 md:py-36 lg:py-36">
        <div className="text-center max-w-6xl mx-6 sm:mx-8 md:mx-[30px] lg:mx-[30px] xl:mx-[100px]">
          <h2 className="font-lexend text-beige tracking-[0.25em] uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-light mb-12">
            FIVE VALUES, ONE VISION
          </h2>
          <p className="font-lexend text-beige font-extralight text-sm sm:text-base md:text-lg lg:text-xl leading-7 sm:leading-8 md:leading-8 lg:leading-9">
          Lyma Siargao brings together French techniques, Spanish influences, Asian creativity, and the richness of Filipino ingredients.
          <br /><br />
          Recognized as one of Siargao’s best restaurants, we offer an elevated yet welcoming dining experience — for families, intimate dinners, and celebrations.
          </p>
          <a href="/about" className="inline-flex items-center gap-2 mt-12 font-lexend font-semibold tracking-[0.25em] text-beige uppercase text-xs sm:text-sm md:text-base">
            Essence of Lyma 
            <Arrow color="beige" size="md" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;