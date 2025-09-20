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
          title="About Lyma Restaurant | Five Values, One Vision - Sustainable Fine Dining in Siargao"
          description="Discover Lyma Restaurant's five values and one vision: where French techniques, Spanish influences, Asian creativity, and Filipino ingredients unite in sustainable fine dining. Recognized as one of Siargao's best restaurants, we offer elevated yet welcoming dining experiences for families, intimate dinners, and celebrations in General Luna."
          keywords="About Lyma, Chef Marc, Lyma restaurant story, five values one vision, French techniques, Spanish influences, Asian creativity, Filipino ingredients, sustainable fine dining, Siargao best restaurants, General Luna dining, restaurant philosophy, culinary vision, international fine dining, local ingredients, innovative techniques, culinary journey, Siargao Island, elevated dining experience, welcoming restaurant"
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