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
    <div className="sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2 sm:row-span-2 md:row-span-2 lg:row-span-2 xl:row-span-2 2xl:row-span-2 bg-white text-olive rounded p-3 sm:p-4 md:p-5 lg:p-6 xl:p-6 2xl:p-6 shadow-sm border-gray-300 border flex flex-col">
      <div className="flex items-center mb-3 sm:mb-4 md:mb-4 lg:mb-4 xl:mb-4 2xl:mb-4">
        <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-8 lg:h-8 xl:w-8 xl:h-8 2xl:w-8 2xl:h-8 rounded bg-gray-100/50 text-olive mr-2 sm:mr-3 md:mr-3 lg:mr-3 xl:mr-3 2xl:mr-3">
          <Utensils size={16} className="sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-5 xl:h-5 2xl:w-5 2xl:h-5" />
        </span>
        <h3 className="text-base sm:text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-lg font-semibold font-lexend tracking-tighter">Restaurant Information</h3>
      </div>
      <div className="space-y-2 sm:space-y-3 md:space-y-3 lg:space-y-3 xl:space-y-3 2xl:space-y-3 flex-1">
        <div>
          <label className="block text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-lexend font-medium mb-1">Restaurant Name</label>
          <input
            type="text"
            value={restaurantName}
            onChange={e => setRestaurantName(e.target.value)}
            className="w-full px-2 sm:px-3 md:px-3 lg:px-3 xl:px-3 2xl:px-3 py-1.5 sm:py-2 md:py-2 lg:py-2 xl:py-2 2xl:py-2 border border-gray-400 rounded bg-gray-50 text-olive font-lexend font-light tracking-tighter focus:outline-none text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-sm"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-3 lg:gap-3 xl:gap-3 2xl:gap-3">
          <div>
            <label className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-lexend font-medium mb-1 flex items-center gap-1">
              <Mail size={12} className="sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-3.5 lg:h-3.5 xl:w-3.5 xl:h-3.5 2xl:w-3.5 2xl:h-3.5" /> Email
            </label>
            <input
              type="text"
              value={restaurantEmail}
              onChange={e => setRestaurantEmail(e.target.value)}
              className="w-full px-2 sm:px-3 md:px-3 lg:px-3 xl:px-3 2xl:px-3 py-1.5 sm:py-2 md:py-2 lg:py-2 xl:py-2 2xl:py-2 border border-gray-400 rounded bg-gray-50 text-olive font-lexend font-light tracking-tighter focus:outline-none text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-sm"
            />
            {emailError && <div className="text-red-500 text-xs mt-1 font-lexend">{emailError}</div>}
          </div>
          <div>
            <label className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-lexend font-medium mb-1 flex items-center gap-1">
              <Phone size={12} className="sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-3.5 lg:h-3.5 xl:w-3.5 xl:h-3.5 2xl:w-3.5 2xl:h-3.5" /> Phone
            </label>
            <input
              type="tel"
              value={formatPhoneUniversal(restaurantPhone)}
              onChange={e => setRestaurantPhone(e.target.value.replace(/\s/g, ''))}
              className={`w-full px-2 sm:px-3 md:px-3 lg:px-3 xl:px-3 2xl:px-3 py-1.5 sm:py-2 md:py-2 lg:py-2 xl:py-2 2xl:py-2 border ${phoneError ? 'border-red-400' : 'border-gray-400'} rounded bg-gray-50 text-olive font-lexend font-light tracking-tighter focus:outline-none text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-sm`}
            />
            {phoneError && <div className="text-red-500 text-xs mt-1 font-lexend">{phoneError}</div>}
          </div>
        </div>
        <div>
          <label className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-lexend font-medium mb-1 flex items-center gap-1">
            <MapPin size={12} className="sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-3.5 lg:h-3.5 xl:w-3.5 xl:h-3.5 2xl:w-3.5 2xl:h-3.5" /> Address
          </label>
          <input
            type="text"
            value={restaurantAddress}
            onChange={e => setRestaurantAddress(e.target.value)}
            className="w-full px-2 sm:px-3 md:px-3 lg:px-3 xl:px-3 2xl:px-3 py-1.5 sm:py-2 md:py-2 lg:py-2 xl:py-2 2xl:py-2 border border-gray-400 rounded bg-gray-50 text-olive font-lexend font-light tracking-tighter focus:outline-none text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-sm"
          />
        </div>
      </div>
      <button
        type="button"
        className={`w-full flex items-center text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-sm justify-center gap-1 sm:gap-2 md:gap-2 lg:gap-2 xl:gap-2 2xl:gap-2 p-1.5 sm:p-2 md:p-2 lg:p-2 xl:p-2 2xl:p-2 border rounded focus:outline-none transition-colors duration-150 mt-2 border-gray-300 font-lexend font-light
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
        <Check size={12} className="sm:w-3.5 sm:h-3.5 md:w-3.5 md:h-3.5 lg:w-3.5 lg:h-3.5 xl:w-3.5 xl:h-3.5 2xl:w-3.5 2xl:h-3.5" /> {saving ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  );
};

export default RestaurantInfoCard; 