import React from 'react';
import Layout from '../components/layout';
import HeroSection from '../components/home/HeroSection';
import { usePage } from '@inertiajs/react';
import AboutSection from '../components/home/AboutSection';
import MenuSection from '../components/home/MenuSection';
import GallerySection from '../components/home/GallerySection';
import JournalSection from '../components/home/JournalSection';
import ContactSection from '../components/home/ContactSection';
import SEO from '../components/SEO';
import ChefSection from '@/components/home/ChefSection';

interface Props {
  flash?: {
    error?: string;
    success?: string;
  };
  footerData?: {
    restaurant_address: string;
    restaurant_email: string;
    restaurant_phone: string;
    restaurant_name: string;
  };
  [key: string]: any;
}

const Home: React.FC = () => {
  const { flash, footerData } = usePage<Props>().props;

  return (
    <>
      <SEO 
        title="Lyma By Chef Marc | Where Sustainability Meets Culinary Excellence - Siargao Island Fine Dining"
        description="Nestled in the pristine shores of Siargao Island, Lyma By Chef Marc represents the essence of sustainable fine dining. Where French techniques, Spanish influences, Asian creativity, and Filipino ingredients unite in a journey through flavors that honors sustainability at the heart of every dish. Five values, one vision - crafting international fine dining with local soul. Reserve your table today for an unforgettable dining experience in General Luna."
        keywords="LYMA, Lyma By Chef Marc, Siargao, Siargao Philippines, Siargao Island, General Luna, sustainability, sustainable dining, French techniques, Spanish influences, Asian creativity, Filipino ingredients, journey through flavors, five values one vision, international fine dining, craftsmanship, innovation, seafood crudos, vegan options, à la carte menu, best dinner spot, best dinner place, best dinner, best food for dinner, best dinner restaurant, fine dining, luxury dining, upscale dining, romantic dinner, date night restaurant, best restaurant in Siargao, top restaurant Siargao, aesthetic restaurant, instagrammable restaurant, hidden gem restaurant, local favorite, chef's table, tasting menu, degustation, farm to table, organic dining, wine pairing, craft cocktails, mixology, tropical fine dining, island dining, luxury restaurant, world-class dining, Chef Marc, local ingredients, innovative techniques, culinary journey, pristine shores, unforgettable experience, culinary excellence"
        image="/assets/images/hero.webp"
        type="restaurant.restaurant"
        url="https://www.lymasiargao.com"
      />
      <Layout footerData={footerData}>
        <HeroSection />
        <AboutSection />
        <ChefSection />
        <MenuSection />
        <GallerySection />
        <JournalSection />
        <ContactSection />
      </Layout>
    </>
  );
};

export default Home;