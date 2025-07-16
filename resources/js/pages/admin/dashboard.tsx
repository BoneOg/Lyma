import React from 'react';
import AdminLayout from '@/components/admin/layout';

import { SectionCards } from '@/components/SectionCards';

const Dashboard: React.FC = () => {
  return (
    <AdminLayout>
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="px-12 py-10">
          <p className="text-olive text-4xl font-bold font-lexend">DASHBOARD</p>
        </div>
        
        {/* Section Cards */}
        <div className="px-12 mb-8">
          <SectionCards />
        </div>
        

      </div>
    </AdminLayout>
  );
};

export default Dashboard;
