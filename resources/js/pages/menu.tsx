import React from 'react';
import Layout from '@/components/layout';
import MenuSection from '@/components/home/MenuSection';
import Breadcrumbs from '@/components/Breadcrumbs';
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
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Menu', current: true }
  ];

  return (
    <>
      <SEO 
        title="Fine Dining Menu | Lyma Restaurant Siargao"
        description="Discover our exceptional fine dining menu featuring Chef Marc's culinary creations. Fresh local ingredients, innovative techniques, and unforgettable flavors in Siargao."
        keywords="Lyma menu, fine dining menu, Siargao restaurant menu, Chef Marc, Filipino cuisine, tropical dining, luxury restaurant menu"
        image="/assets/images/food1.webp"
        type="restaurant.menu"
        url="https://www.lymasiargao.com/menu"
      />
      <Layout footerData={footerData}>
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <MenuSection />
      </Layout>
    </>
  );
};

export default Menu; 