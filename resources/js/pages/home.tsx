import React from 'react';
import Layout from '../components/layout';
import { usePage } from '@inertiajs/react';

interface Props {
  flash?: {
    error?: string;
    success?: string;
  };
  [key: string]: any;
}

const Home: React.FC = () => {
  const { flash } = usePage<Props>().props;

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          {/* Flash Messages */}
          {flash?.error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline ml-2">{flash.error}</span>
            </div>
          )}
          
          {flash?.success && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline ml-2">{flash.success}</span>
            </div>
          )}

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