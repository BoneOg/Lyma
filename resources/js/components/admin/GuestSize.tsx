import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const GuestSize: React.FC = () => {
  const [minGuestSize, setMinGuestSize] = useState(1);
  const [maxGuestSize, setMaxGuestSize] = useState(10);
  const [isSaving, setIsSaving] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchGuestSizeSettings();
  }, []);

  const fetchGuestSizeSettings = async () => {
    try {
      const [minResponse, maxResponse] = await Promise.all([
        fetch('/admin/api/settings/min-guest-size'),
        fetch('/admin/api/settings/max-guest-size')
      ]);
      
      if (minResponse.ok) {
        const minData = await minResponse.json();
        setMinGuestSize(parseInt(minData.value));
      }
      
      if (maxResponse.ok) {
        const maxData = await maxResponse.json();
        setMaxGuestSize(parseInt(maxData.value));
      }
    } catch (error) {
      console.error('Error fetching guest size settings:', error);
    }
  };

  const handleMinGuestSizeChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 10) {
      setMinGuestSize(numValue);
      // Auto-save immediately when value changes
      saveMinGuestSizeValue(numValue);
    }
  };

  const handleMaxGuestSizeChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 50) {
      setMaxGuestSize(numValue);
      // Auto-save immediately when value changes
      saveMaxGuestSizeValue(numValue);
    }
  };

  const saveMinGuestSizeValue = async (value: number) => {
    if (isSaving) return;
    setIsSaving(true);
    
    try {
      const response = await fetch('/admin/api/settings/min-guest-size', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ value: value }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showNotification('Minimum guest size updated successfully!', 'success');
      } else {
        showNotification(data.message || 'Failed to update minimum guest size', 'error');
      }
    } catch (error) {
      console.error('Error saving minimum guest size:', error);
      showNotification('Failed to update minimum guest size', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const saveMaxGuestSizeValue = async (value: number) => {
    if (isSaving) return;
    setIsSaving(true);
    
    try {
      const response = await fetch('/admin/api/settings/max-guest-size', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ value: value }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showNotification('Maximum guest size updated successfully!', 'success');
      } else {
        showNotification(data.message || 'Failed to update maximum guest size', 'error');
      }
    } catch (error) {
      console.error('Error saving maximum guest size:', error);
      showNotification('Failed to update maximum guest size', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const saveMinGuestSize = async () => {
    saveMinGuestSizeValue(minGuestSize);
  };

  const saveMaxGuestSize = async () => {
    saveMaxGuestSizeValue(maxGuestSize);
  };

  return (
    <div className="col-span-1 row-span-1 bg-white text-olive rounded p-6 shadow-sm border-gray-300 border">
      <div className="flex items-center mb-3">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-gray-100/50 text-olive mr-3">
          <Users size={20} />
        </span>
        <h3 className="text-base font-semibold font-lexend tracking-tighter">Guest Size</h3>
      </div>
      <div className="space-y-2">
        <div>
          <label className="block text-sm font-lexend font-medium mb-1">Minimum</label>
          <select 
            value={minGuestSize}
            onChange={(e) => handleMinGuestSizeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-400 rounded bg-gray-50 text-olive font-lexend font-light focus:outline-none text-sm"
            disabled={isSaving}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-lexend font-medium mb-1">Maximum</label>
          <select 
            value={maxGuestSize}
            onChange={(e) => handleMaxGuestSizeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-400 rounded bg-gray-50 text-olive font-lexend font-light focus:outline-none text-sm"
            disabled={isSaving}
          >
            {Array.from({ length: 50 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default GuestSize; 