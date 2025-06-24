import React from 'react';
import StaffLayout from '@/components/staff/layout';

const StaffDashboard: React.FC = () => {
  return (
    <StaffLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Staff Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to Staff Dashboard</h2>
          <p className="text-gray-600">
            This is the main dashboard page for staff members. Here you can manage bookings and view reservation details.
          </p>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffDashboard;
