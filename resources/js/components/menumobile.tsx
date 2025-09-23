import React from 'react';

const MenuMobile: React.FC = () => (
  <>
    {/* Mobile Vertical Layout */}
    <div className="lg:hidden space-y-6 md:space-y-8">
      {/* Logo */}
      <div className="flex justify-center mb-6 md:mb-8">
        <img 
          src="/assets/logo/lymabeige.webp" 
          alt="Lyma by Chef Marc"
          className="h-20 sm:h-24 w-auto"
        />
      </div>

      {/* Snacks */}
      <div>
        <h3 className="font-lexend font-medium text-lg sm:text-xl text-beige mb-4 sm:mb-6 tracking-wide">SNACKS</h3>
        <div className="space-y-4 sm:space-y-5">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige">WAGYU BOMBON</h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                24h slow cooked Kitayama locally raised Wagyu in a crispy dough, 7 days fermented black garlic mayo, lokal herbs
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">390</span>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige">TORCHED TUNA TARTAR</h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                Potato rösti, avocado mousse, chimichurri torched tuna tartar
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">440</span>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige flex items-center gap-1">
                FLATBREAD FRITA <span className="text-xs"><span className="text-[#6B7A5E]">V</span> <span className="text-[#D4847C]">P</span></span>
              </h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                24h fermented dough, tomato confit, feta cream, mushrooms, basil, lokal herbs
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">410</span>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige flex items-center gap-1">
                MUSHROOM PATÉ <span className="text-xs"><span className="text-[#C5A572]">VG</span> <span className="text-[#D4847C]">P</span></span>
              </h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                Roasted mushroom, garlic confit, brandy, sourdough bread and smoked butter
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">410</span>
          </div>
        </div>
      </div>

      {/* Crudos */}
      <div>
        <h3 className="font-lexend font-medium text-lg sm:text-xl text-beige mb-4 sm:mb-6 tracking-wide">CRUDOS</h3>
        <div className="space-y-4 sm:space-y-5">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige flex items-center gap-1">
                TUNA CRUDO <span className="text-xs text-[#D4847C]">P</span>
              </h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                Yellowfin, avocado, lime, fermented ponzu sauce, preserved lemon, garlic chips, chives oil, dill, gotu kola
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">650</span>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige flex items-center gap-1">
                PRAWN AGUACHILE <span className="text-xs text-[#D4847C]">P</span>
              </h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                Wild prawns, lime aguachile, burnt corn, sweet red chili, red onion, cucumber
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">620</span>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige flex items-center gap-1">
                CATCH OF THE DAY CEVICHE <span className="text-xs text-[#D4847C]">P</span>
              </h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                Coconut leche de tigre, kamote, crispy corn, cilantro, yellow sweet chili, lemon, chips
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">550</span>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige flex items-center gap-1">
                WAGYU TARTAR <span className="text-xs text-[#D4847C]">P</span>
              </h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                Kitayama locally raised Wagyu, beetroots, keffir, juniper berries, wild garlic, lokal herbs
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">630</span>
          </div>
        </div>
      </div>

      {/* Appetizers */}
      <div>
        <h3 className="font-lexend font-medium text-lg sm:text-xl text-beige mb-4 sm:mb-6 tracking-wide">APPETIZERS</h3>
        <div className="space-y-4 sm:space-y-5">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige flex items-center gap-1">
                EGG & ONION <span className="text-xs text-[#6B7A5E]">V</span>
              </h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                65C egg, truffle potato cream, caramelized onion puré, crispy potatoes, pimentón de la vera
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">440</span>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige flex items-center gap-1">
                LYMA BURRATA <span className="text-xs text-[#D4847C]">P</span>
              </h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                Buffalo burrata, moringa green pesto, tomato confit, parma ham, tomato jam, basil coulis
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">730</span>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige">CRAB CANNELLONI</h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                Island grown mud crab filling, crab fat "aligué", egg pasta rich bisque sauce
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">590</span>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige">MUSSELS ESCABECHE</h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                Coconut escabeche, lemon grass, ginger, chili oil, lime gel, lokal herbs
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">470</span>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige">SEARED SCALLOPS</h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                Cooked in burnt butter, lemon, garlic, parsley, kamote
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">670</span>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige">ONION SOUP</h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                French onion soup, gruyère, walnut oil, cheesy toast
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">450</span>
          </div>
        </div>
      </div>

      {/* Fideuà Section - Mobile */}
      <div className="border border-beige border-opacity-30 p-3 sm:p-4">
        <h3 className="font-lexend font-medium text-lg sm:text-xl text-beige mb-4 sm:mb-6 tracking-wide text-center">FIDEUÀ</h3>
        <div className="space-y-4 sm:space-y-5">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige">SEAFOOD FIDEUÀ</h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                Classic Fideuà topped with prawns, squid and catch of the day
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">810</span>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige">MEAT FIDEUÀ</h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                Classic Fideuà topped with pork botifarrа sausage
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">780</span>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige">VEGAN FIDEUÀ</h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                Classic Fideuà topped with lokal lab roasted vegetables
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">720</span>
          </div>
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <div className="font-lexend font-medium text-sm sm:text-base text-beige tracking-wide">COMING SOON</div>
          <div className="font-lexend italic text-sm sm:text-base text-beige opacity-80 mt-2">To share</div>
        </div>
      </div>

      {/* Philosophy Box */}
      <div className="border border-beige border-opacity-30 p-3 sm:p-4 text-center mb-6 md:mb-8">
        <p className="font-lexend font-light text-sm text-beige leading-relaxed">
          Our menu showcases the richness of Filipino ingredients, thoughtfully reimagined with creativity, craftsmanship, and deep respect for their origins.
        </p>
      </div>

      {/* Main Course */}
      <div>
        <h3 className="font-lexend font-medium text-lg sm:text-xl text-beige mb-4 sm:mb-6 tracking-wide">MAIN COURSE</h3>
        <div className="space-y-4 sm:space-y-5">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige flex items-center gap-1">
                SPINACH RAVIOLI <span className="text-xs text-[#6B7A5E]">V</span>
              </h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                Spinach kale filling, buffalo cream, egg pasta, burnt butter, mushroom morels sauce
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">550</span>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige">CATCH OF THE DAY</h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                Fishermans catch, served with wild garlic meuniére, capers, mojo verde, fondant potatoes, siargao seaweed, crispy leeks
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">630</span>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige">GRILLED OCTOPUS</h4>
              <p className="font-lexend font-light text sm text-beige opacity-80 leading-relaxed">
                Slow cooked and grilled octopus, ink emulsion, chili oil, migas, cured egg, citric velouté
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">640</span>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige">SLOW COOKED BEEF CHEEKS</h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                36h slow cooked beef cheeks, red wine juice, potato, buttered beans
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">790</span>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige">BEEF STRIPLOIN</h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                Grilled, served with aromatized Mindoro rice, glazed onions, beef jus
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">1800</span>
          </div>
        </div>
      </div>

      {/* Desserts */}
      <div>
        <h3 className="font-lexend font-medium text-lg sm:text-xl text-beige mb-4 sm:mb-6 tracking-wide">DESSERTS</h3>
        <div className="space-y-4 sm:space-y-5">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige flex items-center gap-1">
                SIARGAO COCONUTS <span className="text-xs"><span className="text-[#6B7A5E]">V</span> <span className="text-[#D4847C]">P</span></span>
              </h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                Coconut, coconut, coconut toasted, sable, espuma, meringue, vinegar, latik
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">330</span>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige flex items-center gap-1">
                BURNT BASQUE CHEESECAKE <span className="text-xs text-[#6B7A5E]">V</span>
              </h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                Creamy carabao cream cheese, semi-cured cheese, with a caramelized top
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">350</span>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1 pr-3 sm:pr-4">
              <h4 className="font-lexend font-medium text-sm sm:text-base text-beige flex items-center gap-1">
                MANGO & CHOCOLATE <span className="text-xs"><span className="text-[#6B7A5E]">V</span> <span className="text-[#D4847C]">P</span></span>
              </h4>
              <p className="font-lexend font-light text-sm text-beige opacity-80 leading-relaxed">
                Chocolate caramel crémeux, grilled mango, malagas hot chocolate, mango gel, cacao crisp
              </p>
            </div>
            <span className="font-lexend font-light text-sm sm:text-base text-beige">370</span>
          </div>
        </div>

        <div className="text-center mt-6 sm:mt-8 space-y-2">
          <div className="flex justify-center space-x-4 text-xs font-lexend text-beige">
            <span><strong className="text-[#C5A572]">VG</strong> VEGAN</span>
            <span><strong className="text-[#6B7A5E]">V</strong> VEGETARIAN</span>
            <span><strong className="text-[#D4847C]">P</strong> PROBIOTIC</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-beige opacity-70 font-lexend font-light text-center mt-8 mb-6">
        For any allergies or dietary restrictions, including vegan options, please inform our team—modifications are available upon request.
      </div>

      <div className="text-center text-sm text-beige opacity-70 font-lexend font-light mt-8 mb-12">
        ALL PRICES ARE INCLUSIVE OF 12% VAT<br />
        & SUBJECT TO 5% SERVICE CHARGE.
      </div>
    </div>

    {/* Premium After-Menu Section */}
    <div className="max-w-6xl mx-auto mt-12 sm:mt-16 md:mt-20 space-y-12 md:space-y-16">
      {/* Divider */}
      <div className="flex items-center justify-center">
        <div className="h-px bg-beige opacity-30 flex-1"></div>
        <div className="px-6 sm:px-8">
          <div className="w-2 h-2 sm:w-3 sm:h-3 border border-beige opacity-60 rotate-45"></div>
        </div>
        <div className="h-px bg-beige opacity-30 flex-1"></div>
      </div>

      {/* Philosophy Section */}
      <div className="text-center space-y-8 md:space-y-12">
        <div className="space-y-4 md:space-y-6">
          <h3 className="font-lexend font-light text-xl sm:text-2xl xl:text-2xl 2xl:text-2xl text-beige tracking-wider">
            CULINARY PHILOSOPHY
          </h3>
          <p className="font-lexend font-light text-base sm:text-lg xl:text-lg 2xl:text-lg text-beige opacity-90 max-w-3xl mx-auto leading-relaxed">
            At Lyma Siargao, our à la carte menu showcases international fine dining in General Luna while honoring the richness of local Filipino ingredients.
          </p>
        </div>
      </div>

      {/* Technique & Heritage */}
      <div className="grid md:grid-cols-2 gap-12 sm:gap-14 md:gap-16 items-center">
        <div className="text-center">
          <div className="inline-block border border-beige border-opacity-30 p-6 sm:p-8">
            <h4 className="font-lexend font-medium text-base sm:text-lg xl:text-lg 2xl:text-lg text-beige tracking-wide mb-3 sm:mb-4">
              TECHNIQUE & CRAFT
            </h4>
            <p className="font-lexend font-light text-sm sm:text-base xl:text-base 2xl:text-base text-beige opacity-90 leading-relaxed">
              Every dish balances creativity, craftsmanship, and respect for nature, blending Basque–French techniques, Spanish traditions, and Asian cuisine inspirations.
            </p>
          </div>
        </div>
        <div className="text-center">
          <div className="inline-block border border-beige border-opacity-30 p-6 sm:p-8">
            <h4 className="font-lexend font-medium text-base sm:text-lg xl:text-lg 2xl:text-lg text-beige tracking-wide mb-3 sm:mb-4">
              SEASONAL ARTISTRY
            </h4>
            <p className="font-lexend font-light text-sm sm:text-base xl:text-base 2xl:text-base text-beige opacity-90 leading-relaxed">
              We take pride in seasonal creations, fermentation-forward specialties, and curated dishes highlighting sustainability and innovation.
            </p>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="w-12 sm:w-16 h-px bg-beige opacity-60 mx-auto"></div>
          <h5 className="font-lexend font-medium text-sm sm:text-base xl:text-base 2xl:text-base text-beige tracking-wide">
            INCLUSIVE DINING
          </h5>
          <p className="font-lexend font-light text-xs sm:text-sm xl:text-sm 2xl:text-sm text-beige opacity-80 leading-relaxed">
            Committed to offering vegan, vegetarian, and gluten-free options as core to our philosophy.
          </p>
        </div>
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="w-12 sm:w-16 h-px bg-beige opacity-60 mx-auto"></div>
          <h5 className="font-lexend font-medium text-sm sm:text-base xl:text-base 2xl:text-base text-beige tracking-wide">
            ALL-DAY EXPERIENCE
          </h5>
          <p className="font-lexend font-light text-xs sm:text-sm xl:text-sm 2xl:text-sm text-beige opacity-80 leading-relaxed">
            From breakfast and brunch to intimate dinners, locally inspired flavors throughout the day.
          </p>
        </div>
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="w-12 sm:w-16 h-px bg-beige opacity-60 mx-auto"></div>
          <h5 className="font-lexend font-medium text-sm sm:text-base xl:text-base 2xl:text-base text-beige tracking-wide">
            SHARED MOMENTS
          </h5>
          <p className="font-lexend font-light text-xs sm:text-sm xl:text-sm 2xl:text-sm text-beige opacity-80 leading-relaxed">
            Whether intimate dinners or family gatherings, our menu brings people together through food.
          </p>
        </div>
      </div>

      {/* Final Statement */}
      <div className="text-center space-y-6 sm:space-y-8">
        <div className="inline-block">
          <div className="w-6 sm:w-8 h-px bg-beige opacity-60 mx-auto mb-4 sm:mb-6"></div>
          <p className="font-lexend font-light text-lg sm:text-xl xl:text-xl 2xl:text-xl text-beige italic max-w-4xl mx-auto leading-relaxed">
            Discover why Lyma is celebrated as one of the best restaurants in General Luna, Siargao, where French cuisine, Spanish heritage, Asian creativity, and Filipino ingredients meet to create unforgettable moments.
          </p>
          <div className="w-6 sm:w-8 h-px bg-beige opacity-60 mx-auto mt-4 sm:mt-6"></div>
        </div>
      </div>
    </div>
  </>
);

export default MenuMobile;


