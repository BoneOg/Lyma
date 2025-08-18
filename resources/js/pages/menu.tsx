import React from 'react';
import Layout from '@/components/layout';
import MenuSection from '@/components/home/MenuSection';

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
    <Layout footerData={footerData}>
      <MenuSection />
    </Layout>
  );
};

export default Menu; 