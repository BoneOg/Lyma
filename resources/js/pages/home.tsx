import React from 'react';
import Layout from '../components/layout';
import HeroSection from '../components/home/HeroSection';
import { usePage } from '@inertiajs/react';
import AboutSection from '../components/home/AboutSection';
import MenuSection from '../components/home/MenuSection';
import GallerySection from '../components/home/GallerySection';
import SEO from '../components/SEO';

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
        title="Lyma By Chef Marc - Where Tropical Dreams Meet Culinary Excellence | Siargao Island Fine Dining"
        description="Nestled in the pristine shores of Siargao Island, Lyma By Chef Marc represents the essence of tropical fine dining. Every dish tells a story of local ingredients transformed through innovative techniques, creating an unforgettable culinary journey. Where tropical dreams meet culinary excellence with craft cocktails and premium wine cellar. Reserve your table today for an unforgettable dining experience."
        keywords="LYMA, Lyma By Chef Marc, Siargao, Siargao Philippines, Siargao Island, General Luna, best dinner spot, best dinner place, best dinner, best food for dinner, best dinner restaurant, fine dining, luxury dining, upscale dining, romantic dinner, date night restaurant, best restaurant in Siargao, top restaurant Siargao, aesthetic restaurant, instagrammable restaurant, hidden gem restaurant, local favorite, chef's table, tasting menu, degustation, farm to table, organic dining, sustainable dining, wine pairing, craft cocktails, mixology, tropical fine dining, Filipino cuisine, island dining, luxury restaurant, world-class dining, Chef Marc, local ingredients, innovative techniques, culinary journey, pristine shores, unforgettable experience, tropical dreams, culinary excellence"
        image="/assets/images/hero.webp"
        type="restaurant.restaurant"
      />
      <Layout footerData={footerData}>
        <HeroSection />
        <AboutSection />
        <MenuSection />
        <GallerySection />
      </Layout>
    </>
  );
};

export default Home;