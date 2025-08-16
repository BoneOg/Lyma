import React from "react";

const MenuSection: React.FC = () => {
  return (
    <section className="w-full bg-olive font-lexend overflow-hidden pt-[100px] pb-[80px] relative">
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

      <div className="relative w-full z-10">
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
        <div className="absolute inset-0 flex flex-col items-center pt-[220px]">
          <h2 className="text-olive text-center tracking-[0.2em] uppercase text-5xl font-light">
            SEAMLESS FUSION OF
            <br />
            TRADITION AND MODERNITY
          </h2>

          {/* 3 images, full width row with small gaps and no side margins */}
          <div className="mt-[100px] w-full">
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
