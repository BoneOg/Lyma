import React from 'react';
import Layout from '../components/layout';

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hello World
          </h1>
          <p className="text-lg text-gray-600">
            Welcome to your Laravel + Inertia + React TypeScript application
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;