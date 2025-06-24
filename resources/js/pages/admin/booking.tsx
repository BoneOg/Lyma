import React from 'react';
import AdminLayout from '@/components/admin/layout';

const Booking: React.FC = () => {
  return (
    <AdminLayout>
      <div className="w-full mx-auto">
        <div className="bg-white p-6 shadow">
          <p className="text-black text-2xl font-bold px-2 font-lexend">Booking</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Booking; 