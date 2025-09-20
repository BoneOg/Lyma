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
          title="A Glimpse Into Lyma's World | Gallery - Siargao Fine Dining Experience"
          description="Discover Lyma through moments on the plate — a showcase of flavors, textures, and details captured in every dish. A glimpse into Lyma's world where sustainability meets culinary excellence, featuring our journey through flavors and five values, one vision philosophy in General Luna, Siargao."
          keywords="Lyma gallery, glimpse into Lyma's world, restaurant photos, Siargao dining photos, fine dining gallery, food photography, flavors textures details, sustainable dining, journey through flavors, five values one vision, French techniques, Spanish influences, Asian creativity, Filipino ingredients, Siargao restaurant images, culinary excellence, visual experience, General Luna"
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
