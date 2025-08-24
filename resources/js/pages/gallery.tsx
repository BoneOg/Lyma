import React from 'react';
import Layout from '@/components/layout';
import GallerySection from '@/components/home/GallerySection';
import SEO from '@/components/SEO';

interface GalleryPageProps {
  footerData?: {
    restaurant_address: string;
    restaurant_email: string;
    restaurant_phone: string;
    restaurant_name: string;
  };
}

const Gallery: React.FC<GalleryPageProps> = ({ footerData }) => {
  return (
    <>
      <SEO 
        title="Gallery | Lyma Restaurant Siargao - Visual Feast of Fine Dining"
        description="Explore our gallery showcasing the beautiful ambiance, exquisite dishes, and memorable moments at Lyma Restaurant in General Luna, Siargao. Where tropical dreams meet culinary excellence in every frame."
        keywords="Lyma gallery, restaurant photos, Siargao dining photos, fine dining gallery, restaurant ambiance, food photography, Siargao restaurant images, tropical fine dining, culinary excellence, visual experience"
        image="/assets/images/gallery1.webp"
        type="restaurant.gallery"
        url="https://www.lymasiargao.com/gallery"
      />
      <Layout footerData={footerData}>
        <GallerySection />
      </Layout>
    </>
  );
};

export default Gallery;
