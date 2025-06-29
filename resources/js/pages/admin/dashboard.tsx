import React from 'react';
import AdminLayout from '@/components/admin/layout';
import { ChartAreaInteractive } from '@/components/ChartAreaInteractive';
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
        
        {/* Chart Section */}
        <div className="px-12">
          <ChartAreaInteractive />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
