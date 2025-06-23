import React from 'react';
import AdminLayout from '@/components/admin/layout';

const Users: React.FC = () => {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Users Management</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">User Management</h2>
          <p className="text-gray-600">
            This page is for managing system users. Here you can view, create, edit, and delete user accounts.
          </p>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">User List</h3>
            <p className="text-gray-600 text-sm">
              List of all registered users will be displayed here.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Users; 