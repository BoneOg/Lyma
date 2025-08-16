import React from 'react';
import Layout from '../components/layout';
import HeroSection from '../components/home/HeroSection';
import { usePage } from '@inertiajs/react';
import AboutSection from '../components/home/AboutSection';
import MenuSection from '../components/home/MenuSection';
import GallerySection from '../components/home/GallerySection';

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
    <Layout footerData={footerData}>
      <HeroSection />
      <AboutSection />
      <MenuSection />
      <GallerySection />
    </Layout>
  );
};

export default Home;