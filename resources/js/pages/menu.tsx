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
          title="A Journey Through Flavors | Lyma Restaurant Menu - Siargao Fine Dining"
          description="Experience our à la carte menu showcasing international fine dining in General Luna while honoring local Filipino ingredients. From seafood crudos to creative vegan options, every dish reflects sustainability, craftsmanship, and innovation. A journey through flavors that celebrates French techniques, Spanish influences, and Asian creativity."
          keywords="Lyma menu, journey through flavors, à la carte menu, international fine dining, seafood crudos, vegan options, sustainable dining, craftsmanship, innovation, French techniques, Spanish influences, Asian creativity, Filipino ingredients, General Luna menu, Siargao restaurant menu, Chef Marc, luxury restaurant menu, local ingredients, culinary excellence, Siargao Island"
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