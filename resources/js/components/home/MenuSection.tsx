import React from "react";

const MenuSection: React.FC = () => {
  return (
    <section className="w-full bg-olive font-lexend overflow-hidden pt-16 sm:pt-20 md:pt-24 lg:pt-28 xl:pt-32 2xl:pt-[100px] pb-12 sm:pb-16 md:pb-20 lg:pb-24 xl:pb-28 2xl:pb-[80px] relative">
      <div className="relative w-full z-10">
        <svg
          viewBox="0 0 1540 250"
          preserveAspectRatio="none"
          className="block w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] 2xl:h-[1000px] scale-[1.2] origin-center"
          aria-hidden="true"
        >
          {/* Base beige fill below the arch */}
          <path
            d="M0,400 L0,200 A770,200 0 0 1 1540,200 L1540,400 Z"
            className="text-beige"
            fill="currentColor"
          />
        </svg>

        {/* Saying centered at top inside the arch */}
        <div className="absolute inset-0 flex flex-col items-center pt-12 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-28 2xl:pt-[220px]">
          <h2 className="text-olive text-center tracking-[0.2em] uppercase text-sm sm:text-2xl md:text-2xl lg:text-3xl xl:text-5xl 2xl:text-6xl font-light px-4">
            SEAMLESS FUSION OF
            <br />
            TRADITION AND MODERNITY
          </h2>

          {/* 3 images, full width row with small gaps and no side margins */}
          <div className="mt-6 sm:mt-8 md:mt-8 lg:mt-16 xl:mt-14 2xl:mt-[100px] w-full px-0 sm:px-0 md:px-0 lg:px-0 xl:px-0 2xl:px-0">
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-[64px]">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-full h-24 sm:h-40 md:h-48 lg:h-56 xl:h-64 2xl:h-[360px] overflow-hidden">
                  <img
                    src="/assets/images/about1.webp"
                    alt="Menu placeholder"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Description and Menu link */}
          <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-6 xl:mt-8 2xl:mt-[64px] max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[500px] 2xl:max-w-[720px] text-center px-4">
            <p className="text-olive text-[8px] sm:text-xs md:text-xs lg:text-sm xl:text-xl 2xl:text-2xl leading-4 sm:leading-6 md:leading-6 lg:leading-7 xl:leading-7 2xl:leading-8 mb-0">
              Rooted in Filipino heritage and elevated by Western technique, it redefines island dining
              through a harmonious fusion of tradition and modernity.
            </p>
            <a href="/menu" className="inline-block mt-3 sm:mt-3 md:mt-3 lg:mt-3 xl:mt-3 2xl:mt-4 text-olive hover:text-olive/80 text-[10px] sm:text-sm md:text-xs lg:text-sm xl:text-lg 2xl:text-xl">
              Menu →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
