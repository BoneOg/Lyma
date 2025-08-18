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
        title="Fine Dining Restaurant in General Luna, Siargao | Chef Marc"
        description="Experience exceptional fine dining at Lyma in General Luna, Siargao. Chef Marc's culinary masterpiece featuring local ingredients transformed through tradition and innovation. Reserve your table today."
        keywords="Lyma, fine dining, Siargao, General Luna, Chef Marc, restaurant, Filipino cuisine, tropical dining, luxury restaurant, island dining, reservation"
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