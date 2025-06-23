import React from 'react';
import AdminLayout from '@/components/admin/layout';

const Booking: React.FC = () => {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Booking Management</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Reservation Management</h2>
          <p className="text-gray-600">
            This page is for managing restaurant reservations. Here you can view, confirm, and manage all booking requests.
          </p>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Reservation List</h3>
            <p className="text-gray-600 text-sm">
              List of all reservations will be displayed here with their status and details.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Booking; 