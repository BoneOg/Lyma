import React from 'react';
import Layout from '@/components/layout';
import AboutSection from '@/components/home/AboutSection';

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
    <Layout footerData={footerData}>
      <AboutSection />
    </Layout>
  );
};

export default About; 