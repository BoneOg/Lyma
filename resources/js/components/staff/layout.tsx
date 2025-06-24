import React from 'react';
import StaffSidebar from './sidebar';

interface StaffLayoutProps {
  children: React.ReactNode;
}

const StaffLayout: React.FC<StaffLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <StaffSidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StaffLayout; 