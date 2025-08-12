import React from 'react';
import Navbar from './navbar';
import Footer from './footer';

interface LayoutProps {
  children: React.ReactNode;
  footerData?: {
    restaurant_address: string;
    restaurant_email: string;
    restaurant_phone: string;
    restaurant_name: string;
  };
}

const Layout: React.FC<LayoutProps> = ({ children, footerData }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer footerData={footerData} />
    </div>
  );
};

export default Layout;
