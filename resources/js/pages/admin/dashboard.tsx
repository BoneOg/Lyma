import React from 'react';
import AdminLayout from '@/components/admin/layout';

const Dashboard: React.FC = () => {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to Admin Dashboard</h2>
          <p className="text-gray-600">
            This is the main dashboard page for administrators. Here you can manage users, bookings, and view system statistics.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
