import React from 'react';
import StaffSidebar from './StaffSidebar';

interface StaffLayoutProps {
  children: React.ReactNode;
}

const StaffLayout: React.FC<StaffLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-beige-light relative">
      {/* Fixed/Floating Sidebar */}
      <div className="fixed top-0 left-0 h-full z-10">
        <StaffSidebar />
      </div>
      
      {/* Main Content with left margin to account for sidebar */}
      <div className="ml-64">
        {children}
      </div>
    </div>
  );
};

export default StaffLayout; 