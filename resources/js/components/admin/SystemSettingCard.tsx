import React, { useState } from 'react';
import Notification from '@/components/Notification';

interface Settings {
  reservation_fee: number;
  max_advance_booking_days: number;
  capacity: number;
  restaurant_email: string;
  restaurant_phone: string;
}

interface SystemSettingCardProps {
  settings: Settings;
}

const SystemSettingCard: React.FC<SystemSettingCardProps> = ({ settings }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [formData, setFormData] = useState({
    reservation_fee: settings.reservation_fee,
    max_advance_booking_days: settings.max_advance_booking_days,
    capacity: settings.capacity || 5,
    restaurant_email: settings.restaurant_email,
    restaurant_phone: settings.restaurant_phone,
  });

  const handleEditToggle = () => {
    if (isEditing) {
      // If currently editing, reset form data to original values
      setFormData({
        reservation_fee: settings.reservation_fee,
        max_advance_booking_days: settings.max_advance_booking_days,
        capacity: settings.capacity || 5,
        restaurant_email: settings.restaurant_email,
        restaurant_phone: settings.restaurant_phone,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    // For number fields, only allow numbers
    if (field === 'reservation_fee' || field === 'max_advance_booking_days' || field === 'capacity') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [field]: field === 'reservation_fee' ? parseFloat(numericValue) || 0 : parseInt(numericValue) || 0 }));
    } else if (field === 'restaurant_phone') {
      // Allow numbers, spaces, hyphens, plus signs, and parentheses for phone numbers
      const phoneRegex = /^[\d\s\-\+\(\)]*$/;
      if (phoneRegex.test(value)) {
        setFormData(prev => ({ ...prev, [field]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveClick = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmationModal(false);
    
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      if (!csrfToken) {
        throw new Error('CSRF token not found');
      }

      const response = await fetch('/admin/settings/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setNotificationMessage('Settings updated successfully!');
        setNotificationType('success');
        setShowNotification(true);
        setIsEditing(false);
        
        // Update the settings in the parent component
        Object.assign(settings, formData);
      } else {
        setNotificationMessage(result.message || 'Failed to update settings');
        setNotificationType('error');
        setShowNotification(true);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      setNotificationMessage(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setNotificationType('error');
      setShowNotification(true);
    }
  };

  const handleCancelSave = () => {
    setShowConfirmationModal(false);
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  return (
    <>
      <div className="bg-white rounded-4xl shadow-lg p-8 h-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl text-[#3f411a] font-lexend font-semibold">System</h2>
          <button
            onClick={handleEditToggle}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isEditing 
                ? 'bg-[#3f411a] text-white hover:bg-[#2a2d12] active:scale-95' 
                : 'bg-[#f6f5c6] text-black hover:bg-[#e8e6b3] active:scale-95'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" d="M22 10.5V12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2h1.5" />
                <path d="m16.652 3.455l.649-.649A2.753 2.753 0 0 1 21.194 6.7l-.65.649m-3.892-3.893s.081 1.379 1.298 2.595c1.216 1.217 2.595 1.298 2.595 1.298m-3.893-3.893L10.687 9.42c-.404.404-.606.606-.78.829q-.308.395-.524.848c-.121.255-.211.526-.392 1.068L8.412 13.9m12.133-6.552l-5.965 5.965c-.404.404-.606.606-.829.78a4.6 4.6 0 0 1-.848.524c-.255.121-.526.211-1.068.392l-1.735.579m0 0l-1.123.374a.742.742 0 0 1-.939-.94l.374-1.122m1.688 1.688L8.412 13.9" />
              </g>
            </svg>
          </button>
        </div>
        
        <div className="space-y-8">
          {/* First Row */}
          <div className="space-y-8">
            <div className="space-y-3 ">
              <label className="text-sm font-extralight text-[#3f411a] font-lexend">
                Reservation Fee
              </label>
              <div className="relative ">
                <input
                  type="text"
                  value={formData.reservation_fee}
                  onChange={(e) => handleInputChange('reservation_fee', e.target.value)}
                  className={`w-full px-3 py-2 border border-[#3f411a]/20 rounded-lg focus:outline-none focus:border-[#3f411a] bg-[#fdfcf0]/30 font-lexend ${
                    !isEditing ? 'cursor-not-allowed opacity-60' : ''
                  }`}
                  disabled={!isEditing}
                  style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-extralight text-[#3f411a] font-lexend">
                Max Booking Days
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.max_advance_booking_days}
                  onChange={(e) => handleInputChange('max_advance_booking_days', e.target.value)}
                  className={`w-full px-3 py-2 border border-[#3f411a]/20 rounded-lg focus:outline-none focus:border-[#3f411a] bg-[#fdfcf0]/30 font-lexend ${
                    !isEditing ? 'cursor-not-allowed opacity-60' : ''
                  }`}
                  disabled={!isEditing}
                  style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-extralight text-[#3f411a] font-lexend">
                Available Tables
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  className={`w-full px-3 py-2 border border-[#3f411a]/20 rounded-lg focus:outline-none focus:border-[#3f411a] bg-[#fdfcf0]/30 font-lexend ${
                    !isEditing ? 'cursor-not-allowed opacity-60' : ''
                  }`}
                  disabled={!isEditing}
                  style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-extralight text-[#3f411a] font-lexend">
                Restaurant Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.restaurant_email}
                  onChange={(e) => handleInputChange('restaurant_email', e.target.value)}
                  className={`w-full px-3 py-2 border border-[#3f411a]/20 rounded-lg focus:outline-none focus:border-[#3f411a] bg-[#fdfcf0]/30 font-lexend ${
                    !isEditing ? 'cursor-not-allowed opacity-60' : ''
                  }`}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-extralight text-[#3f411a] font-lexend">
                Restaurant Phone
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.restaurant_phone}
                  onChange={(e) => handleInputChange('restaurant_phone', e.target.value)}
                  className={`w-full px-3 py-2 border border-[#3f411a]/20 rounded-lg focus:outline-none focus:border-[#3f411a] bg-[#fdfcf0]/30 font-lexend ${
                    !isEditing ? 'cursor-not-allowed opacity-60' : ''
                  }`}
                  disabled={!isEditing}
                  maxLength={13}
                />
              </div>
            </div>
          </div>

          {/* Save Button - Always visible */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveClick}
              className="bg-[#f6f5c6] hover:bg-[#e8e6b3] text-[#3f411a] px-8 py-2 rounded-lg transition-colors font-lexend cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-[#3f411a] text-white rounded-2xl p-6 shadow-lg max-w-md w-full mx-4">
            <h3 className="text-xl mb-4 font-lexend font-extralight">Confirm Changes</h3>
            <p className="text-[#f6f5c6] mb-6 font-lexend font-extralight">Are you sure you want to save these changes?</p>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancelSave}
                className="flex-1 bg-[#f6f5c6] hover:bg-[#e8e6b3]/80 text-[#3f411a] py-3 px-4 rounded-md font-extralight transition-colors font-lexend"
              >
                No
              </button>
              <button
                onClick={handleConfirmSave}
                className="flex-1 bg-[#f6f5c6] hover:bg-[#e8e6b3]/80 text-[#3f411a] py-3 px-4 rounded-md font-extralight transition-colors font-lexend"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      <Notification
        message={notificationMessage}
        type={notificationType}
        isVisible={showNotification}
        onClose={handleNotificationClose}
      />
    </>
  );
};

export default SystemSettingCard; 