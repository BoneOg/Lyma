import React, { useState, useEffect } from 'react';
import { Bell, Mail } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const EmailRemindersCard: React.FC = () => {
  const [reminderHours, setReminderHours] = useState(2);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingReminders, setIsSendingReminders] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchReminderSetting();
  }, []);

  const fetchReminderSetting = async () => {
    try {
      console.log('Fetching reminder setting...');
      const response = await fetch('/admin/api/settings/reminder-hours');
      console.log('Fetch response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched reminder data:', data);
        setReminderHours(parseInt(data.value) || 2);
      } else {
        console.error('Failed to fetch reminder setting:', response.status);
      }
    } catch (error) {
      console.error('Error fetching reminder setting:', error);
    }
  };

  const handleReminderChange = async (value: string) => {
    const hours = parseInt(value);
    console.log('Reminder change requested:', { value, hours, isValid: !isNaN(hours) && hours >= 1 && hours <= 24 });
    
    if (!isNaN(hours) && hours >= 1 && hours <= 24) {
      setReminderHours(hours);
      await saveReminderHours(hours);
    } else {
      console.error('Invalid hours value:', hours);
    }
  };

  const saveReminderHours = async (hours: number) => {
    if (isSaving) return;
    setIsSaving(true);
    
    console.log('Saving reminder hours:', hours);
    
    try {
      const response = await fetch('/admin/api/settings/reminder-hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ value: hours }),
      });

      const data = await response.json();
      console.log('Save response:', { status: response.status, data });
      
      if (response.ok && data.success) {
        showNotification('Reminder timing updated successfully!', 'success');
      } else {
        showNotification(data.message || 'Failed to update reminder timing', 'error');
      }
    } catch (error) {
      console.error('Error saving reminder hours:', error);
      showNotification('Failed to update reminder timing', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const sendRemindersNow = async () => {
    if (isSendingReminders) return;
    setIsSendingReminders(true);
    
    try {
      const response = await fetch('/admin/api/email-reminders/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showNotification('Reminders sent successfully!', 'success');
      } else {
        showNotification(data.message || 'Failed to send reminders', 'error');
      }
    } catch (error) {
      console.error('Error sending reminders:', error);
      showNotification('Failed to send reminders', 'error');
    } finally {
      setIsSendingReminders(false);
    }
  };

  return (
    <div className="col-span-1 row-span-1 bg-white text-olive rounded p-6 shadow-sm border-gray-300 border">
      <div className="flex items-center mb-3">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-gray-100/50 text-olive mr-3">
          <Bell size={20} />
        </span>
        <h3 className="text-base font-semibold font-lexend tracking-tighter">Email Reminder</h3>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-lexend font-medium mb-1">Reminder</label>
          <select 
            value={reminderHours}
            onChange={(e) => handleReminderChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-400 rounded bg-gray-50 text-olive font-lexend font-light focus:outline-none text-sm"
            disabled={isSaving}
          >
            <option value={1}>1 hour before</option>
            <option value={2}>2 hours before</option>
            <option value={4}>4 hours before</option>
            <option value={6}>6 hours before</option>
            <option value={12}>12 hours before</option>
            <option value={24}>24 hours before</option>
          </select>
        </div>
        
        <div className="pt-2">
          <button
            onClick={sendRemindersNow}
            disabled={isSendingReminders}
            className={`w-full flex items-center text-sm justify-center gap-2 p-2 border rounded focus:outline-none transition-colors duration-150 border-gray-300 font-lexend font-light
              ${isSendingReminders
                ? 'bg-gray-200 text-gray-400 opacity-60 cursor-not-allowed'
                : 'bg-gray-50 text-olive hover:bg-gray-200 hover:text-white cursor-pointer'}
            `}
          >
            <Mail size={14} /> {isSendingReminders ? 'Sending...' : 'Send Reminders Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailRemindersCard; 