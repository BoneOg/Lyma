import React from 'react';
import Layout from '@/components/layout';
import MenuSection from '@/components/home/MenuSection';
import SEO from '@/components/SEO';

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
        title="Fine Dining Menu | Lyma Restaurant Siargao"
        description="Discover our exceptional fine dining menu featuring Chef Marc's culinary creations. Fresh local ingredients, innovative techniques, and unforgettable flavors in Siargao. Experience where tropical dreams meet culinary excellence."
        keywords="Lyma menu, fine dining menu, Siargao restaurant menu, Chef Marc, Filipino cuisine, tropical dining, luxury restaurant menu, local ingredients, innovative techniques, culinary excellence, Siargao Island"
        image="/assets/images/food1.webp"
        type="restaurant.menu"
        url="https://www.lymasiargao.com/menu"
      />
      <Layout footerData={footerData}>
        <MenuSection />
      </Layout>
    </>
  );
};

export default Menu; 