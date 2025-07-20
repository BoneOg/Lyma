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
      <div className="flex flex-col items-center px-12 py-10">
        <p className="text-olive text-7xl font-thin font-lexend text-center">SETTINGS</p>
        <div className="w-50 h-[1px] bg-olive mt-6" style={{ opacity: 0.5 }} />
      </div>
      {/* Full Screen Bento Layout */}
      <div className="px-12 pb-6">
        <div className="grid grid-cols-4 grid-rows-3 gap-6 h-[calc(100vh-240px)]">
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