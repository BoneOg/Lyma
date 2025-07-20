import React, { useState } from 'react';
import { Utensils, Mail, Phone, MapPin, Check } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { useNotification } from '../../contexts/NotificationContext';

interface RestaurantSettings {
  restaurant_name: string;
  restaurant_email: string;
  restaurant_phone: string;
  restaurant_address: string;
}

function formatPhoneUniversal(phone: string) {
  const phoneNumber = parsePhoneNumberFromString(phone);
  if (phoneNumber) {
    return phoneNumber.formatInternational();
  }
  return new AsYouType().input(phone);
}

const RestaurantInfoCard: React.FC = () => {
  const pageProps = usePage().props as any;
  const settings: RestaurantSettings = pageProps.settings || {
    restaurant_name: '',
    restaurant_email: '',
    restaurant_phone: '',
    restaurant_address: '',
  };
  const [restaurantName, setRestaurantName] = useState(settings.restaurant_name);
  const [restaurantEmail, setRestaurantEmail] = useState(settings.restaurant_email);
  const [restaurantAddress, setRestaurantAddress] = useState(settings.restaurant_address);
  const [restaurantPhone, setRestaurantPhone] = useState(settings.restaurant_phone);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const { showNotification } = useNotification ? useNotification() : { showNotification: () => {} };
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setPhoneError(null);
    setEmailError(null);
    // Validate phone number
    const phoneNumber = parsePhoneNumberFromString(restaurantPhone);
    if (!phoneNumber || !phoneNumber.isValid()) {
      setPhoneError('Invalid phone number');
      setSaving(false);
      return;
    }
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(restaurantEmail)) {
      setEmailError('Invalid email address');
      setSaving(false);
      return;
    }
    try {
      // Save restaurant name if changed
      if (restaurantName !== settings.restaurant_name) {
        await fetch('/admin/api/settings/restaurant-name', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
          body: JSON.stringify({ restaurant_name: restaurantName }),
        });
      }
      // Save restaurant phone if changed
      if (restaurantPhone !== settings.restaurant_phone) {
        await fetch('/admin/api/settings/restaurant-phone', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
          body: JSON.stringify({ restaurant_phone: phoneNumber.number }), // E.164 format
        });
      }
      // Save restaurant email if changed
      if (restaurantEmail !== settings.restaurant_email) {
        const res = await fetch('/admin/api/settings/restaurant-email', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
          body: JSON.stringify({ restaurant_email: restaurantEmail }),
        });
        if (!res.ok) {
          setEmailError('Failed to update email.');
          showNotification && showNotification('Failed to update email.', 'error');
        }
      }
      // Save restaurant address if changed
      if (restaurantAddress !== settings.restaurant_address) {
        const res = await fetch('/admin/api/settings/restaurant-address', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
          body: JSON.stringify({ restaurant_address: restaurantAddress }),
        });
        if (!res.ok) {
          showNotification && showNotification('Failed to update address.', 'error');
        }
      }
      setSuccess(true);
      showNotification && showNotification('Restaurant information updated successfully!', 'success');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  return (
    <div className="col-span-2 row-span-2 bg-white text-olive rounded p-6 shadow-sm border-gray-300 border flex flex-col">
      <div className="flex items-center mb-4">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-gray-100/50 text-olive mr-3">
          <Utensils size={20} />
        </span>
        <h3 className="text-lg font-semibold font-lexend tracking-tighter">Restaurant Information</h3>
      </div>
      <div className="space-y-3 flex-1">
        <div>
          <label className="block text-sm font-lexend font-medium mb-1">Restaurant Name</label>
          <input
            type="text"
            value={restaurantName}
            onChange={e => setRestaurantName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-400 rounded bg-gray-50 text-olive font-lexend font-light tracking-tighter focus:outline-none text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-lexend font-medium mb-1 flex items-center gap-1">
              <Mail size={14} /> Email
            </label>
            <input
              type="text"
              value={restaurantEmail}
              onChange={e => setRestaurantEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded bg-gray-50 text-olive font-lexend font-light tracking-tighter focus:outline-none text-sm"
            />
            {emailError && <div className="text-red-500 text-xs mt-1 font-lexend">{emailError}</div>}
          </div>
          <div>
            <label className="text-sm font-lexend font-medium mb-1 flex items-center gap-1">
              <Phone size={14} /> Phone
            </label>
            <input
              type="tel"
              value={formatPhoneUniversal(restaurantPhone)}
              onChange={e => setRestaurantPhone(e.target.value.replace(/\s/g, ''))}
              className={`w-full px-3 py-2 border ${phoneError ? 'border-red-400' : 'border-gray-400'} rounded bg-gray-50 text-olive font-lexend font-light tracking-tighter focus:outline-none text-sm`}
            />
            {phoneError && <div className="text-red-500 text-xs mt-1 font-lexend">{phoneError}</div>}
          </div>
        </div>
        <div>
          <label className="text-sm font-lexend font-medium mb-1 flex items-center gap-1">
            <MapPin size={14} /> Address
          </label>
          <input
            type="text"
            value={restaurantAddress}
            onChange={e => setRestaurantAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-400 rounded bg-gray-50 text-olive font-lexend font-light tracking-tighter focus:outline-none text-sm"
          />
        </div>
      </div>
      <button
        type="button"
        className={`w-full flex items-center text-sm justify-center gap-2 p-2 border rounded focus:outline-none transition-colors duration-150 mt-2 border-gray-300 font-lexend font-light
          ${saving || (
            restaurantName === settings.restaurant_name &&
            restaurantPhone === settings.restaurant_phone &&
            restaurantEmail === settings.restaurant_email &&
            restaurantAddress === settings.restaurant_address
          )
            ? 'bg-gray-200 text-gray-400 opacity-60 cursor-not-allowed'
            : 'bg-gray-50 text-olive hover:bg-gray-200 hover:text-white cursor-pointer'}
        `}
        onClick={handleSave}
        disabled={saving || (
          restaurantName === settings.restaurant_name &&
          restaurantPhone === settings.restaurant_phone &&
          restaurantEmail === settings.restaurant_email &&
          restaurantAddress === settings.restaurant_address
        )}
      >
        <Check size={14} /> {saving ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  );
};

export default RestaurantInfoCard; 