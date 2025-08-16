import React from 'react';
import Layout from '@/components/layout';

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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h1>
            <p className="text-lg text-gray-600">Discover our delicious offerings</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">This is the Menu</h2>
              <p className="text-gray-600 mb-6">
                Welcome to our menu page. Here you'll find all our delicious dishes and beverages.
              </p>
              <p className="text-gray-500">
                Our menu features carefully crafted dishes made with the finest ingredients, 
                prepared by our talented chefs to provide you with an exceptional dining experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Menu; 