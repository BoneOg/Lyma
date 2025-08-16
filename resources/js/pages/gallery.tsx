import React from 'react';
import Layout from '@/components/layout';
import GallerySection from '@/components/home/GallerySection';

interface GalleryPageProps {
  footerData?: {
    restaurant_address: string;
    restaurant_email: string;
    restaurant_phone: string;
    restaurant_name: string;
  };
}

const GalleryPage: React.FC<GalleryPageProps> = ({ footerData }) => {
  return (
    <Layout footerData={footerData}>
      <div className="pt-20">
        <GallerySection />
      </div>
    </Layout>
  );
};

export default GalleryPage;
