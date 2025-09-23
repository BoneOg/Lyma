import React from 'react';
import Layout from '@/components/layout';
import SEO from '@/components/SEO';
import PatternBackground from '@/components/PatternBackground';
import { Hammer, Leaf, Lightbulb, Users, Heart } from 'lucide-react';

interface AboutPageProps {
  footerData?: {
    restaurant_address: string;
    restaurant_email: string;
    restaurant_phone: string;
    restaurant_name: string;
  };
}

const About: React.FC<AboutPageProps> = ({ footerData }) => {
  return (
    <>
      <SEO
        title="About Lyma Restaurant | Five Values, One Vision - Sustainable Fine Dining in Siargao"
        description="Discover Lyma Restaurant's five values and one vision: where French techniques, Spanish influences, Asian creativity, and Filipino ingredients unite in sustainable fine dining. Recognized as one of Siargao's best restaurants, we offer elevated yet welcoming dining experiences for families, intimate dinners, and celebrations in General Luna. Experience our journey through flavors."
        keywords="About Lyma, Chef Marc, Lyma restaurant story, five values one vision, French techniques, Spanish influences, Asian creativity, Filipino ingredients, sustainable fine dining, Siargao best restaurants, General Luna dining, restaurant philosophy, culinary vision, international fine dining, local ingredients, innovative techniques, culinary journey, Siargao Island, elevated dining experience, welcoming restaurant, tropical fine dining, island cuisine"
        image="/assets/images/about_chef.webp"
        type="restaurant.about"
        url="https://www.lymasiargao.com/about"
      />
      <Layout footerData={footerData}>
        <div className="bg-olive min-h-screen relative overflow-hidden">
          <PatternBackground />

          {/* Hero Section */}
          <div className="relative pt-16 sm:pt-20 md:pt-24 lg:pt-28 xl:pt-32 2xl:pt-32 pb-12 sm:pb-14 md:pb-16 lg:pb-20 xl:pb-24 2xl:pb-24 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 xl:mb-28 2xl:mb-28">
                <h1 className="font-lexend font-thin text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-8xl text-beige mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8 2xl:mb-7 tracking-wider">
                  ABOUT US
                </h1>
                <div className="w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 2xl:w-32 h-px bg-beige mx-auto opacity-60"></div>
              </div>

              {/* Welcome Section */}
              <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20 2xl:gap-20 items-center mb-20 sm:mb-24 md:mb-28 lg:mb-32 xl:mb-36 2xl:mb-32">
                <div className="relative">
                  <img 
                    src="/assets/images/aboutpage1.webp" 
                    alt="Lyma Restaurant Interior"
                    className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] xl:h-[600px] 2xl:h-[600px] object-cover rounded-sm shadow-2xl"
                  />
                  <div className="absolute -bottom-3 sm:-bottom-4 md:-bottom-5 lg:-bottom-6 xl:-bottom-7 2xl:-bottom-7 -right-3 sm:-right-4 md:-right-5 lg:-right-6 xl:-right-7 2xl:-right-7 w-20 sm:w-24 md:w-28 lg:w-32 xl:w-36 2xl:w-36 h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36 2xl:h-36 bg-beige opacity-20 rounded-sm"></div>
                </div>
                <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7 xl:space-y-8 2xl:space-y-8">
                  <h2 className="font-lexend font-medium text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-4xl text-beige mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8 2xl:mb-7">
                    Welcome to Lyma Siargao
                  </h2>
                  <p className="font-lexend font-light text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-xl text-beige leading-relaxed opacity-90">
                    A casual fine dining restaurant in General Luna that celebrates the best of island life, international flavors, and Filipino hospitality. Recognized as one of the best restaurants in Siargao, Lyma offers an elevated dining experience where every detail matters — yet remains warm, approachable, and perfect for families, intimate dinners, and group gatherings.
                  </p>
                  <p className="font-lexend font-light text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-xl text-beige leading-relaxed opacity-90">
                    Our cuisine blends French techniques, Spanish influences, and Asian cuisine inspirations with the richness of local Filipino ingredients, creating a truly international restaurant concept unique to the island.
                  </p>
                </div>
              </div>

              {/* Five Values Section */}
              <div className="mb-20 sm:mb-24 md:mb-28 lg:mb-32 xl:mb-36 2xl:mb-32">
                <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 xl:mb-28 2xl:mb-28">
                  <h2 className="font-lexend font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-5xl text-beige mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7 2xl:mb-7">
                    Five Values, One Vision
                  </h2>
                  <p className="font-lexend font-light text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-xl text-beige opacity-80 max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-5xl mx-auto leading-relaxed">
                    The name Lyma comes from "lima" — meaning five — representing our guiding values that shape everything we do.
                  </p>
                </div>

                {/* Values Grid - Fully responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-6 sm:gap-7 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-8">
                  <div className="text-center group">
                    <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-6 xl:mb-7 2xl:mb-7">
                      <div className="w-12 sm:w-14 md:w-12 lg:w-16 xl:w-18 2xl:w-18 h-12 sm:h-14 md:h-12 lg:h-16 xl:h-18 2xl:h-18 mx-auto flex items-center justify-center transition-all duration-300">
                        <Hammer size={32} className="sm:w-8 sm:h-8 md:w-8 md:h-8 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-14 2xl:h-14" color="#FAF7CA" />
                      </div>
                    </div>
                    <h3 className="font-lexend font-semibold text-base sm:text-lg md:text-xs lg:text-xl xl:text-2xl 2xl:text-xl text-beige mb-2 sm:mb-3 md:mb-3 lg:mb-4 xl:mb-5 2xl:mb-5">Craftsmanship</h3>
                    <p className="font-lexend font-light text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base 2xl:text-base text-beige opacity-80 leading-relaxed">
                      Meticulous attention to every detail in our culinary creations
                    </p>
                  </div>
                  
                  <div className="text-center group">
                    <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-6 xl:mb-7 2xl:mb-7">
                      <div className="w-12 sm:w-14 md:w-12 lg:w-16 xl:w-18 2xl:w-18 h-12 sm:h-14 md:h-12 lg:h-16 xl:h-18 2xl:h-18 mx-auto flex items-center justify-center transition-all duration-300">
                        <Leaf size={32} className="sm:w-8 sm:h-8 md:w-8 md:h-8 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-14 2xl:h-14" color="#FAF7CA" />
                      </div>
                    </div>
                    <h3 className="font-lexend font-semibold text-base sm:text-lg md:text-xs lg:text-xl xl:text-2xl 2xl:text-xl text-beige mb-2 sm:mb-3 md:mb-3 lg:mb-4 xl:mb-5 2xl:mb-5">Sustainability</h3>
                    <p className="font-lexend font-light text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base 2xl:text-base text-beige opacity-80 leading-relaxed">
                      Thoughtfully sourced ingredients supporting our environment
                    </p>
                  </div>
                  
                  <div className="text-center group">
                    <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-6 xl:mb-7 2xl:mb-7">
                      <div className="w-12 sm:w-14 md:w-12 lg:w-16 xl:w-18 2xl:w-18 h-12 sm:h-14 md:h-12 lg:h-16 xl:h-18 2xl:h-18 mx-auto flex items-center justify-center transition-all duration-300">
                        <Lightbulb size={32} className="sm:w-8 sm:h-8 md:w-8 md:h-8 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-14 2xl:h-14" color="#FAF7CA" />
                      </div>
                    </div>
                    <h3 className="font-lexend font-semibold text-base sm:text-lg md:text-xs lg:text-xl xl:text-2xl 2xl:text-xl text-beige mb-2 sm:mb-3 md:mb-3 lg:mb-4 xl:mb-5 2xl:mb-5">Creativity</h3>
                    <p className="font-lexend font-light text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base 2xl:text-base text-beige opacity-80 leading-relaxed">
                      Innovation and artistry in every dish we serve
                    </p>
                  </div>
                  
                  <div className="text-center group">
                    <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-6 xl:mb-7 2xl:mb-7">
                      <div className="w-12 sm:w-14 md:w-12 lg:w-16 xl:w-18 2xl:w-18 h-12 sm:h-14 md:h-12 lg:h-16 xl:h-18 2xl:h-18 mx-auto flex items-center justify-center transition-all duration-300">
                        <Users size={32} className="sm:w-8 sm:h-8 md:w-8 md:h-8 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-14 2xl:h-14" color="#FAF7CA" />
                      </div>
                    </div>
                    <h3 className="font-lexend font-semibold text-base sm:text-lg md:text-xs lg:text-xl xl:text-2xl 2xl:text-xl text-beige mb-2 sm:mb-3 md:mb-3 lg:mb-4 xl:mb-5 2xl:mb-5">Community</h3>
                    <p className="font-lexend font-light text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base 2xl:text-base text-beige opacity-80 leading-relaxed">
                      Supporting local farmers, fishermen, and artisans
                    </p>
                  </div>
                  
                  <div className="text-center group sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-1 2xl:col-span-1 sm:max-w-xs sm:mx-auto md:max-w-none">
                    <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-6 xl:mb-7 2xl:mb-7">
                      <div className="w-12 sm:w-14 md:w-12 lg:w-16 xl:w-18 2xl:w-18 h-12 sm:h-14 md:h-12 lg:h-16 xl:h-18 2xl:h-18 mx-auto flex items-center justify-center transition-all duration-300">
                        <Heart size={32} className="sm:w-8 sm:h-8 md:w-8 md:h-8 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-14 2xl:h-14" color="#FAF7CA" />
                      </div>
                    </div>
                    <h3 className="font-lexend font-semibold text-base sm:text-lg md:text-xs lg:text-xl xl:text-2xl 2xl:text-xl text-beige mb-2 sm:mb-3 md:mb-3 lg:mb-4 xl:mb-5 2xl:mb-5">Hospitality</h3>
                    <p className="font-lexend font-light text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base 2xl:text-base text-beige opacity-80 leading-relaxed">
                      Genuine warmth and care in every interaction we share
                    </p>
                  </div>
                </div>
              </div>

              {/* Culinary Philosophy */}
              <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20 2xl:gap-20 items-center mb-20 sm:mb-24 md:mb-28 lg:mb-32 xl:mb-36 2xl:mb-32">
                <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7 xl:space-y-8 2xl:space-y-8 order-2 lg:order-1">
                  <h2 className="font-lexend font-medium text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-5xl text-beige">
                    Our Culinary Journey
                  </h2>
                  <p className="font-lexend font-light text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-xl text-beige leading-relaxed opacity-90">
                    From seafood crudos to slow-cooked classics and fermentation-forward creations, our curated dishes are designed to surprise, delight, and tell a story with every bite. We work hand in hand with local farmers, fishermen, and artisans to bring the freshest ingredients to your table.
                  </p>
                  <p className="font-lexend font-light text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-xl text-beige leading-relaxed opacity-90">
                    A core value at Lyma is inclusivity, which is why we specialize in vegan, vegetarian, and gluten-free options that receive the same level of attention, creativity, and flavor as every other dish on our menu.
                  </p>
                </div>
                <div className="relative order-1 lg:order-2">
                  <img 
                    src="/assets/images/aboutpage3.webp" 
                    alt="Lyma Dining Experience"
                    className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] xl:h-[600px] 2xl:h-[600px] object-cover rounded-sm shadow-2xl"
                  />
                  <div className="absolute -top-3 sm:-top-4 md:-top-5 lg:-top-6 xl:-top-7 2xl:-top-7 -left-3 sm:-left-4 md:-left-5 lg:-left-6 xl:-left-7 2xl:-left-7 w-20 sm:w-24 md:w-28 lg:w-32 xl:w-36 2xl:w-36 h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36 2xl:h-36 bg-beige opacity-20 rounded-sm"></div>
                </div>
              </div>

              {/* Love Letter Section */}
              <div className="text-center max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-6xl mx-auto mb-16 sm:mb-20 md:mb-24 lg:mb-28 xl:mb-32 2xl:mb-32">
                <div className="w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 2xl:w-32 h-px bg-beige mx-auto opacity-60 mb-8 sm:mb-10 md:mb-12 lg:mb-14 xl:mb-16 2xl:mb-16"></div>
                <h2 className="font-lexend font-medium text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-5xl text-beige mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12 2xl:mb-12">
                  A Love Letter to Siargao
                </h2>
                <p className="font-lexend font-light text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-xl text-beige leading-relaxed opacity-90 mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12 2xl:mb-12">
                  At Lyma, casual fine dining in General Luna is not only about what's on the plate — it's about the entire journey: the warm welcome, the attentive service, the intimate island setting, and the passion we pour into every detail.
                </p>
                <p className="font-lexend font-light text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-xl text-beige leading-relaxed opacity-90">
                  Whether you're planning a romantic intimate dinner, a lively group dinner with friends, or a family gathering, Lyma is designed to make every occasion memorable.
                </p>
                <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-14 xl:mt-16 2xl:mt-16">
                  <p className="font-lexend font-medium text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-xl text-beige italic">
                    "Lyma is our love letter to Siargao — a place where French cuisine, Spanish tradition, Asian creativity, and Filipino ingredients come together to create one of the most unique and unforgettable international restaurants in Siargao."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default About;