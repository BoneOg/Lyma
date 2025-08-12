import React from "react";

const MenuSection: React.FC = () => {
  return (
    <section className="w-full bg-olive font-lexend overflow-hidden pt-[100px] pb-[80px]">
      <div className="relative w-full">
        <svg
          viewBox="0 0 1540 250"
          preserveAspectRatio="none"
          className="block w-full h-[1000px] scale-[1.2] origin-center"
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
        <div className="absolute inset-0 flex flex-col items-center pt-[120px]">
          <h2 className="text-olive text-center tracking-[0.2em] uppercase text-5xl font-light">
            SEAMLESS FUSION OF
            <br />
            TRADITION AND MODERNITY
          </h2>

          {/* 3 images, full width row with small gaps and no side margins */}
          <div className="mt-[200px] w-full">
            <div className="grid grid-cols-3 gap-[64px]">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-full h-[360px] overflow-hidden">
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
          <div className="mt-[64px] max-w-[720px] text-center px-4">
            <p className="text-olive text-2xl leading-8 mb-0">
              Rooted in Filipino heritage and elevated by Western technique, it redefines island dining
              through a harmonious fusion of tradition and modernity.
            </p>
            <a href="/menu" className="inline-block mt-4  text-olive hover:text-olive/80">
              Menu →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
