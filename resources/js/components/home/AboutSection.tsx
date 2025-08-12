import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="w-full bg-olive text-beige">
      <div className="mx-[100px] py-20 md:py-28">
        {/* Left + Right columns */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24 items-stretch">
          {/* Left column: heading + media/text row */}
          <div className="flex flex-col h-full">
            {/* Heading */}
            <h2 className="font-lexend tracking-wide uppercase leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold">
              <span className="block">Meet Chef:</span>
              <span className="block">Marc Silvestre</span>
            </h2>

            {/* Row: small image + text */}
            <div className="flex flex-col gap-8 sm:gap-10 md:flex-row md:items-start mt-auto">
              {/* Left small image */}
              <div className="shrink-0">
                <img
                  src="/assets/images/about1.webp"
                  alt="Assorted olives and ingredients"
                  className="h-44 w-full max-w-[18rem] object-cover md:h-52 md:w-72"
                  loading="lazy"
                />
              </div>

              {/* Copy */}
              <div className="max-w-xl font-lexend text-beige/90">
                <p className="text-base leading-7 sm:text-lg md:text-xl md:leading-8">
                  Rooted in Filipino heritage and elevated by Western technique, it
                  redefines island dining through a harmonious fusion of tradition
                  and modernity.
                </p>
                <a
                  href="/about"
                  className="mt-6 inline-flex items-center gap-2 font-lexend text-sm sm:text-base md:text-lg font-medium tracking-wide hover:text-beige"
                >
                  About Us
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
              className="h-[420px] w-full object-cover sm:h-[520px] md:h-[640px] lg:h-[720px]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;