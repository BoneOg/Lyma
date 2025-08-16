import React from 'react';
import Layout from '@/components/layout';
import JournalSection from '@/components/home/JournalSection';

interface JournalPageProps {
  footerData?: {
    restaurant_address: string;
    restaurant_email: string;
    restaurant_phone: string;
    restaurant_name: string;
  };
}

const JournalPage: React.FC<JournalPageProps> = ({ footerData }) => {
  return (
    <Layout footerData={footerData}>
      <div className="pt-20">
        <JournalSection />
      </div>
    </Layout>
  );
};

export default JournalPage;
