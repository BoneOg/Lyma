import React from 'react';
import Layout from '@/components/layout';
import AboutSection from '@/components/home/ChefSection';
import SEO from '@/components/SEO';

interface AboutPageProps {
  footerData?: {
    restaurant_address: string;
    restaurant_email: string;
    restaurant_phone: string;
    restaurant_name: string;
  };
}

const About: React.FC<AboutPageProps> = ({ footerData }) => {
  return (
    <>
      <SEO 
        title="About Lyma Restaurant | Chef Marc's Culinary Vision in Siargao"
        description="Learn about Lyma Restaurant and Chef Marc's passion for fine dining in Siargao. Discover our story, philosophy, and commitment to exceptional culinary experiences. Where tropical dreams meet culinary excellence in the pristine shores of Siargao Island."
        keywords="About Lyma, Chef Marc, Lyma restaurant story, Siargao fine dining, restaurant philosophy, culinary vision, island dining experience, tropical fine dining, local ingredients, innovative techniques, culinary journey, Siargao Island, General Luna"
        image="/assets/images/about_chef.webp"
        type="restaurant.about"
        url="https://www.lymasiargao.com/about"
      />
      <Layout footerData={footerData}>
        <AboutSection />
      </Layout>
    </>
  );
};

export default About; 