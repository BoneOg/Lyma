import React from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  console.log('AdminLayout: Rendering with children:', children);
  
  return (
    <div className="min-h-screen bg-white relative">
      {/* Fixed/Floating Sidebar */}
      <div className="fixed top-0 left-0 h-full z-10">
        <AdminSidebar />
      </div>
      
      {/* Main Content with left margin to account for sidebar */}
      <div className="ml-64">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout; 