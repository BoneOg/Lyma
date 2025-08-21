import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import RestaurantInfoCard from '@/components/admin/RestaurantInfoCard';
import AvailableTimeSlotsCard from '@/components/admin/AvailableTimeSlotsCard';
import CalendarScheduleCard from '@/components/admin/CalendarScheduleCard';
import BookingSettings from '@/components/admin/BookingSettings';
import PartySizeCard from '@/components/admin/GuestSize';
import EmailRemindersCard from '@/components/admin/EmailRemindersCard';

const AdminSetting: React.FC = () => {
  const [systemSettings, setSystemSettings] = useState({
    maxAdvanceBookingDays: 30,
    capacity: 5,
  });

  useEffect(() => {
    // Fetch system settings
    const fetchSettings = async () => {
      try {
        const [bookingWindowResponse, capacityResponse] = await Promise.all([
          fetch('/admin/api/settings/booking-window'),
          fetch('/admin/api/settings/capacity'),
        ]);

        if (bookingWindowResponse.ok) {
          const bookingData = await bookingWindowResponse.json();
          setSystemSettings(prev => ({
            ...prev,
            maxAdvanceBookingDays: bookingData.value || 30,
          }));
        }

        if (capacityResponse.ok) {
          const capacityData = await capacityResponse.json();
          setSystemSettings(prev => ({
            ...prev,
            capacity: capacityData.value || 5,
          }));
        }
      } catch (error) {
        console.error('Error fetching system settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleSettingsUpdate = () => {
    // Refresh settings after update
    window.location.reload();
  };

  return (
    <AdminLayout>
      <div className="flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-12 py-6 sm:py-8 md:py-10 lg:py-10 xl:py-10 2xl:py-10">
        <p className="text-olive text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-7xl font-thin font-lexend text-center">SETTINGS</p>
        <div className="w-32 sm:w-40 md:w-44 lg:w-48 xl:w-50 2xl:w-50 h-[1px] bg-olive mt-4 sm:mt-5 md:mt-6 lg:mt-6 xl:mt-6 2xl:mt-6" style={{ opacity: 0.5 }} />
      </div>
      {/* Responsive Bento Layout */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-12 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-6 2xl:gap-6 auto-rows-auto min-h-[calc(100vh-240px)]">
          <RestaurantInfoCard />
          <AvailableTimeSlotsCard />
          <CalendarScheduleCard />
          <BookingSettings 
            maxAdvanceBookingDays={systemSettings.maxAdvanceBookingDays}
            capacity={systemSettings.capacity}
            onSettingsUpdate={handleSettingsUpdate}
          />
          <PartySizeCard />
          <EmailRemindersCard />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSetting;