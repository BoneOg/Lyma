import React, { useState, useEffect } from 'react';
import { Calendar, Table } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

interface BookingSettingsProps {
  maxAdvanceBookingDays: number;
  capacity: number;
  onSettingsUpdate?: () => void;
}

const BookingSettings: React.FC<BookingSettingsProps> = ({ 
  maxAdvanceBookingDays, 
  capacity, 
  onSettingsUpdate 
}) => {
  const { showNotification } = useNotification();
  const [bookingWindow, setBookingWindow] = useState(maxAdvanceBookingDays.toString());
  const [availableTables, setAvailableTables] = useState(capacity.toString());
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setBookingWindow(maxAdvanceBookingDays.toString());
    setAvailableTables(capacity.toString());
  }, [maxAdvanceBookingDays, capacity]);

  const handleBookingWindowChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setBookingWindow(numericValue);
  };

  const handleAvailableTablesChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setAvailableTables(numericValue);
  };

  const saveBookingWindow = async () => {
    const value = parseInt(bookingWindow);
    if (isNaN(value) || value < 1) {
      showNotification('Booking window must be at least 1 day', 'error');
      setBookingWindow(maxAdvanceBookingDays.toString());
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/admin/api/settings/booking-window', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ max_advance_booking_days: value }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showNotification('Booking window updated successfully!', 'success');
        if (onSettingsUpdate) {
          onSettingsUpdate();
        }
      } else {
        showNotification(data.message || 'Failed to update booking window', 'error');
        setBookingWindow(maxAdvanceBookingDays.toString());
      }
    } catch (error) {
      console.error('Error updating booking window:', error);
      showNotification('Failed to update booking window', 'error');
      setBookingWindow(maxAdvanceBookingDays.toString());
    } finally {
      setIsSaving(false);
    }
  };

  const saveAvailableTables = async () => {
    const value = parseInt(availableTables);
    if (isNaN(value) || value < 1) {
      showNotification('Available tables must be at least 1', 'error');
      setAvailableTables(capacity.toString());
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/admin/api/settings/capacity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ capacity: value }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showNotification('Available tables updated successfully!', 'success');
        if (onSettingsUpdate) {
          onSettingsUpdate();
        }
      } else {
        showNotification(data.message || 'Failed to update available tables', 'error');
        setAvailableTables(capacity.toString());
      }
    } catch (error) {
      console.error('Error updating available tables:', error);
      showNotification('Failed to update available tables', 'error');
      setAvailableTables(capacity.toString());
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="col-span-1 row-span-1 bg-white text-olive rounded p-6 shadow-sm border-gray-300 border">
      <div className="flex items-center mb-3">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-gray-100/50 text-olive mr-3">
          <Calendar size={20} />
        </span>
        <h3 className="text-base font-semibold font-lexend tracking-tighter">Booking Settings</h3>
      </div>
      
      <div className="space-y-2">
        <div>
          <label className="block text-sm font-lexend font-medium mb-1">Booking Window</label>
          <input
            type="text"
            value={bookingWindow}
            onChange={(e) => handleBookingWindowChange(e.target.value)}
            onBlur={saveBookingWindow}
            className="w-full px-3 py-2 border border-gray-400 rounded bg-gray-50 text-olive font-lexend font-light focus:outline-none text-sm"
            placeholder="Enter days"
            disabled={isSaving}
          />
        </div>

        <div>
          <label className="block text-sm font-lexend font-medium mb-1">Available Tables</label>
          <input
            type="text"
            value={availableTables}
            onChange={(e) => handleAvailableTablesChange(e.target.value)}
            onBlur={saveAvailableTables}
            className="w-full px-3 py-2 border border-gray-400 rounded bg-gray-50 text-olive font-lexend font-light focus:outline-none text-sm"
            placeholder="Enter number"
            disabled={isSaving}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingSettings; 