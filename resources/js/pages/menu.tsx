import React from 'react';
import Layout from '@/components/layout';
import SEO from '@/components/SEO';
import PatternBackground from '../components/PatternBackground';
import MenuMobile from '@/components/menumobile';

interface MenuPageProps {
  footerData?: {
    restaurant_address: string;
    restaurant_email: string;
    restaurant_phone: string;
    restaurant_name: string;
  };
}

const Menu: React.FC<MenuPageProps> = ({ footerData }) => {
  return (
    <>
      <SEO
        title="A Journey Through Flavors | Lyma Restaurant Menu - Siargao Fine Dining"
        description="Experience our à la carte menu showcasing international fine dining in General Luna while honoring local Filipino ingredients. From seafood crudos to creative vegan options, every dish reflects sustainability, craftsmanship, and innovation. A journey through flavors that celebrates French techniques, Spanish influences, and Asian creativity."
        keywords="Lyma menu, journey through flavors, à la carte menu, international fine dining, seafood crudos, vegan options, sustainable dining, craftsmanship, innovation, French techniques, Spanish influences, Asian creativity, Filipino ingredients, General Luna menu, Siargao restaurant menu, Chef Marc, luxury restaurant menu, local ingredients, culinary excellence, Siargao Island"
        image="/assets/images/food1.webp"
        type="restaurant.menu"
        url="https://www.lymasiargao.com/menu"
      />
      <Layout footerData={footerData}>
        <div className="bg-olive min-h-screen relative overflow-hidden">
          <PatternBackground />
          
          <div className="relative pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-14 md:pb-16 px-4 sm:px-5 md:px-6">
            <div className="max-w-7xl mx-auto">
              {/* Hero Section */}
              <div className="text-center mb-12 sm:mb-16 md:mb-20">
                <h1 className="font-lexend font-thin text-4xl sm:text-5xl md:text-6xl xl:text-6xl 2xl:text-8xl text-beige mb-4 sm:mb-5 md:mb-6 tracking-wider">
                  MENU
                </h1>
                <div className="w-16 sm:w-20 md:w-24 h-px bg-beige mx-auto opacity-60"></div>
              </div>

              {/* Menu Content - Desktop Horizontal Layout */}
              {/* Desktop */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-3 gap-8 md:gap-10 xl:gap-12 mb-12 sm:mb-14 md:mb-16">
                  {/* Left Column - Logo + Snacks + Crudos */}
                  <div className="space-y-6 md:space-y-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-8 md:mb-10 xl:mb-12">
                      <img 
                        src="/assets/logo/lymabeige.webp" 
                        alt="Lyma by Chef Marc"
                        className="h-24 md:h-28 xl:h-32 w-auto"
                      />
                    </div>

                    {/* Snacks */}
                    <div>
                      <h3 className="font-lexend font-medium text-base md:text-lg xl:text-lg 2xl:text-lg text-beige mb-4 md:mb-5 xl:mb-6 tracking-wide">SNACKS</h3>
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3 md:pr-4">
                            <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">WAGYU BOMBON</h4>
                            <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                              24h slow cooked Kitayama locally raised Wagyu in a crispy dough, 7 days fermented black garlic mayo, lokal herbs
                            </p>
                          </div>
                          <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">390</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3 md:pr-4">
                            <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">TORCHED TUNA TARTAR</h4>
                            <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                              Potato rösti, avocado mousse, chimichurri torched tuna tartar
                            </p>
                          </div>
                          <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">440</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3 md:pr-4">
                            <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige flex items-center gap-1">
                              FLATBREAD FRITA <span className="text-xs"><span className="text-[#6B7A5E]">V</span> <span className="text-[#D4847C]">P</span></span>
                            </h4>
                            <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                              24h fermented dough, tomato confit, feta cream, mushrooms, basil, lokal herbs
                            </p>
                          </div>
                          <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">410</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3 md:pr-4">
                            <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige flex items-center gap-1">
                              MUSHROOM PATÉ <span className="text-xs"><span className="text-[#C5A572]">VG</span> <span className="text-[#D4847C]">P</span></span>
                            </h4>
                            <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                              Roasted mushroom, garlic confit, brandy, sourdough bread and smoked butter
                            </p>
                          </div>
                          <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">410</span>
                        </div>
                      </div>
                    </div>

                    {/* Crudos */}
                    <div>
                      <h3 className="font-lexend font-medium text-base md:text-lg xl:text-lg 2xl:text-lg text-beige mb-4 md:mb-5 xl:mb-6 tracking-wide">CRUDOS</h3>
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3 md:pr-4">
                            <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige flex items-center gap-1">
                              TUNA CRUDO <span className="text-xs text-[#D4847C]">P</span>
                            </h4>
                            <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                              Yellowfin, avocado, lime, fermented ponzu sauce, preserved lemon, garlic chips, chives oil, dill, gotu kola
                            </p>
                          </div>
                          <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">650</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3 md:pr-4">
                            <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige flex items-center gap-1">
                              PRAWN AGUACHILE <span className="text-xs text-[#D4847C]">P</span>
                            </h4>
                            <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                              Wild prawns, lime aguachile, burnt corn, sweet red chili, red onion, cucumber
                            </p>
                          </div>
                          <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">620</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3 md:pr-4">
                            <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige flex items-center gap-1">
                              CATCH OF THE DAY CEVICHE <span className="text-xs text-[#D4847C]">P</span>
                            </h4>
                            <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                              Coconut leche de tigre, kamote, crispy corn, cilantro, yellow sweet chili, lemon, chips
                            </p>
                          </div>
                          <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">550</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3 md:pr-4">
                            <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige flex items-center gap-1">
                              WAGYU TARTAR <span className="text-xs text-[#D4847C]">P</span>
                            </h4>
                            <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                              Kitayama locally raised Wagyu, beetroots, keffir, juniper berries, wild garlic, lokal herbs
                            </p>
                          </div>
                          <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">630</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs xl:text-xs 2xl:text-xs text-beige opacity-70 font-lexend font-light text-center mt-6 md:mt-8">
                      For any allergies or dietary restrictions, including vegan options, please inform our team—modifications are available upon request.
                    </div>
                  </div>

                  {/* Middle Column - Appetizers + Fideuà */}
                  <div className="space-y-6 md:space-y-8">
                    <h3 className="font-lexend font-medium text-base md:text-lg xl:text-lg 2xl:text-lg text-beige mb-4 md:mb-5 xl:mb-6 tracking-wide">APPETIZERS</h3>
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-3 md:pr-4">
                          <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige flex items-center gap-1">
                            EGG & ONION <span className="text-xs text-[#6B7A5E]">V</span>
                          </h4>
                          <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                            65C egg, truffle potato cream, caramelized onion puré, crispy potatoes, pimentón de la vera
                          </p>
                        </div>
                        <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">440</span>
                      </div>

                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-3 md:pr-4">
                          <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige flex items-center gap-1">
                            LYMA BURRATA <span className="text-xs text-[#D4847C]">P</span>
                          </h4>
                          <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                            Buffalo burrata, moringa green pesto, tomato confit, parma ham, tomato jam, basil coulis
                          </p>
                        </div>
                        <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">730</span>
                      </div>

                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-3 md:pr-4">
                          <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">CRAB CANNELLONI</h4>
                          <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                            Island grown mud crab filling, crab fat "aligué", egg pasta rich bisque sauce
                          </p>
                        </div>
                        <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">590</span>
                      </div>

                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-3 md:pr-4">
                          <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">MUSSELS ESCABECHE</h4>
                          <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                            Coconut escabeche, lemon grass, ginger, chili oil, lime gel, lokal herbs
                          </p>
                        </div>
                        <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">470</span>
                      </div>

                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-3 md:pr-4">
                          <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">SEARED SCALLOPS</h4>
                          <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                            Cooked in burnt butter, lemon, garlic, parsley, kamote
                          </p>
                        </div>
                        <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">670</span>
                      </div>

                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-3 md:pr-4">
                          <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">ONION SOUP</h4>
                          <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                            French onion soup, gruyère, walnut oil, cheesy toast
                          </p>
                        </div>
                        <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">450</span>
                      </div>
                    </div>

                    {/* Fideuà Section */}
                    <div className="border border-beige border-opacity-30 p-4 md:p-5 xl:p-6 mt-8 md:mt-10 xl:mt-12">
                      <h3 className="font-lexend font-medium text-base md:text-lg xl:text-lg 2xl:text-lg text-beige mb-4 md:mb-5 xl:mb-6 tracking-wide text-center">FIDEUÀ</h3>
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3 md:pr-4">
                            <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">SEAFOOD FIDEUÀ</h4>
                            <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                              Classic Fideuà topped with prawns, squid and catch of the day
                            </p>
                          </div>
                          <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">810</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3 md:pr-4">
                            <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">MEAT FIDEUÀ</h4>
                            <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                              Classic Fideuà topped with pork botifarrа sausage
                            </p>
                          </div>
                          <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">780</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3 md:pr-4">
                            <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">VEGAN FIDEUÀ</h4>
                            <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                              Classic Fideuà topped with lokal lab roasted vegetables
                            </p>
                          </div>
                          <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">720</span>
                        </div>
                      </div>

                      <div className="text-center mt-6 md:mt-8">
                        <div className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige tracking-wide">COMING SOON</div>
                        <div className="font-lexend italic text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige opacity-80 mt-2">To share</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Philosophy + Main Course + Desserts */}
                  <div className="space-y-6 md:space-y-8">
                    {/* Philosophy Box */}
                    <div className="border border-beige border-opacity-30 p-4 md:p-5 xl:p-6 text-center">
                      <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige leading-relaxed">
                        Our menu showcases the richness of Filipino ingredients, thoughtfully reimagined with creativity, craftsmanship, and deep respect for their origins.
                      </p>
                    </div>

                    {/* Main Course */}
                    <div>
                      <h3 className="font-lexend font-medium text-base md:text-lg xl:text-lg 2xl:text-lg text-beige mb-4 md:mb-5 xl:mb-6 tracking-wide">MAIN COURSE</h3>
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3 md:pr-4">
                            <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige flex items-center gap-1">
                              SPINACH RAVIOLI <span className="text-xs text-[#6B7A5E]">V</span>
                            </h4>
                            <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                              Spinach kale filling, buffalo cream, egg pasta, burnt butter, mushroom morels sauce
                            </p>
                          </div>
                          <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">550</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3 md:pr-4">
                            <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">CATCH OF THE DAY</h4>
                            <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                              Fishermans catch, served with wild garlic meuniére, capers, mojo verde, fondant potatoes, siargao seaweed, crispy leeks
                            </p>
                          </div>
                          <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">630</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3 md:pr-4">
                            <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">GRILLED OCTOPUS</h4>
                            <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                              Slow cooked and grilled octopus, ink emulsion, chili oil, migas, cured egg, citric velouté
                            </p>
                          </div>
                          <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">640</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3 md:pr-4">
                            <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">SLOW COOKED BEEF CHEEKS</h4>
                            <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                              36h slow cooked beef cheeks, red wine juice, potato, buttered beans
                            </p>
                          </div>
                          <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">790</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3 md:pr-4">
                            <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">BEEF STRIPLOIN</h4>
                            <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                              Grilled, served with aromatized Mindoro rice, glazed onions, beef jus
                            </p>
                          </div>
                          <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">1800</span>
                        </div>
                      </div>
                    </div>

                    {/* Desserts */}
                    <div>
                      <h3 className="font-lexend font-medium text-base md:text-lg xl:text-lg 2xl:text-lg text-beige mb-4 md:mb-5 xl:mb-6 tracking-wide">DESSERTS</h3>
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3 md:pr-4">
                            <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige flex items-center gap-1">
                              SIARGAO COCONUTS <span className="text-xs"><span className="text-[#6B7A5E]">V</span> <span className="text-[#D4847C]">P</span></span>
                            </h4>
                            <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                              Coconut, coconut, coconut toasted, sable, espuma, meringue, vinegar, latik
                            </p>
                          </div>
                          <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">330</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3 md:pr-4">
                            <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige flex items-center gap-1">
                              BURNT BASQUE CHEESECAKE <span className="text-xs text-[#6B7A5E]">V</span>
                            </h4>
                            <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                              Creamy carabao cream cheese, semi-cured cheese, with a caramelized top
                            </p>
                          </div>
                          <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">350</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3 md:pr-4">
                            <h4 className="font-lexend font-medium text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige flex items-center gap-1">
                              MANGO & CHOCOLATE <span className="text-xs"><span className="text-[#6B7A5E]">V</span> <span className="text-[#D4847C]">P</span></span>
                            </h4>
                            <p className="font-lexend font-light text-xs xl:text-xs 2xl:text-xs text-beige opacity-80 leading-relaxed">
                              Chocolate caramel crémeux, grilled mango, malagas hot chocolate, mango gel, cacao crisp
                            </p>
                          </div>
                          <span className="font-lexend font-light text-xs md:text-sm xl:text-sm 2xl:text-sm text-beige">370</span>
                        </div>
                      </div>

                      <div className="text-center mt-6 md:mt-8 space-y-2">
                        <div className="flex justify-center space-x-4 text-xs font-lexend text-beige">
                          <span><strong className="text-[#C5A572]">VG</strong> VEGAN</span>
                          <span><strong className="text-[#6B7A5E]">V</strong> VEGETARIAN</span>
                          <span><strong className="text-[#D4847C]">P</strong> PROBIOTIC</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center text-xs xl:text-xs 2xl:text-xs text-beige opacity-70 font-lexend font-light mt-8 md:mt-10 xl:mt-12 mb-12 sm:mb-14 md:mb-16">
                  ALL PRICES ARE INCLUSIVE OF 12% VAT<br />
                  & SUBJECT TO 5% SERVICE CHARGE.
                </div>
              </div>
              {/* Mobile */}
              <MenuMobile />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Menu;
                      