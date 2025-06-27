import React from 'react';
import Layout from '@/components/layout';

const Contact: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600">Get in touch with us</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">This is the Contact</h2>
              <p className="text-gray-600 mb-6">
                Welcome to our contact page. Here you'll find ways to reach out to us.
              </p>
              <p className="text-gray-500">
                We'd love to hear from you! Whether you have questions about our menu, 
                want to make a reservation, or just want to say hello, we're here to help.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact; 