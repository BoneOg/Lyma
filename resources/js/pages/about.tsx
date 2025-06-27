import React from 'react';
import Layout from '@/components/layout';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
            <p className="text-lg text-gray-600">Learn more about our story</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">This is the About</h2>
              <p className="text-gray-600 mb-6">
                Welcome to our about page. Here you'll learn more about our restaurant and our journey.
              </p>
              <p className="text-gray-500">
                We are passionate about creating memorable dining experiences for our guests. 
                Our commitment to quality, service, and hospitality has been the foundation of our success.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About; 