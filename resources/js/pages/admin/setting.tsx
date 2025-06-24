import React from 'react';
import AdminLayout from '@/components/admin/layout';
import SystemSettingCard from '@/components/admin/SystemSettingCard';
import CalendarComponent from '@/components/admin/calendar';

interface Settings {
  reservation_fee: number;
  max_advance_booking_days: number;
  restaurant_name: string;
  restaurant_email: string;
  restaurant_phone: string;
}

interface Props {
  settings: Settings;
}

const AdminSetting: React.FC<Props> = ({ settings }) => {
  return (
    <AdminLayout>
      <p className="text-olive text-4xl font-bold px-12 py-10 font-lexend ">SETTINGS</p>
      
      {/* Side by side containers */}
      <div className="px-12 grid grid-cols-2 gap-8">
        <CalendarComponent settings={settings} />
        <SystemSettingCard settings={settings} /> 
      </div>
    </AdminLayout>
  );
};

export default AdminSetting; 