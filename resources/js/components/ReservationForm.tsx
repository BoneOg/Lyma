import React from 'react';

interface ReservationFormProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSpecialRequestsChange: (value: string) => void;
  formatSelectedDateTime: () => string;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  firstName,
  lastName,
  email,
  phone,
  specialRequests,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,
  onSpecialRequestsChange,
  formatSelectedDateTime
}) => {
  const handleNameInput = (value: string, setter: (value: string) => void) => {
    // Only allow letters and spaces
    const nameRegex = /^[a-zA-Z\s]*$/
    if (nameRegex.test(value)) {
      setter(value)
    }
  }

  const handleEmailInput = (value: string) => {
    onEmailChange(value)
  }

  const handlePhoneInput = (value: string) => {
    // Only allow numbers, spaces, hyphens, and plus signs, limit to 15 characters
    const phoneRegex = /^[\d\s\-\+]*$/
    if (phoneRegex.test(value) && value.length <= 15) {
      onPhoneChange(value)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-base font-extralight font-lexend mb-3">When</label>
        <div className="border-b border-white pb-2 text-lg font-extralight font-lexend">
          {formatSelectedDateTime()}
        </div>
      </div>
      
      {/* First Name and Last Name */}
      <div className="flex space-x-6">
        <div className="flex-1">
          <label className="block text-base font-extralight font-lexend mb-2">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => handleNameInput(e.target.value, onFirstNameChange)}
            className="w-full bg-transparent border-b border-white text-white pb-2 outline-none text-base font-extralight font-lexend"
            placeholder="First name"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-base font-extralight font-lexend mb-2">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => handleNameInput(e.target.value, onLastNameChange)}
            className="w-full bg-transparent border-b border-white text-white pb-2 outline-none text-base font-extralight font-lexend"
            placeholder="Last name"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-base font-extralight font-lexend mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => handleEmailInput(e.target.value)}
          className="w-full bg-transparent border-b border-white text-white pb-2 outline-none text-base font-extralight font-lexend"
          placeholder="Enter your email"
          required
        />
      </div>
      
      {/* Phone Number and Special Requests */}
      <div className="flex space-x-6">
        <div className="flex-1">
          <label className="block text-base font-extralight font-lexend mb-2">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => handlePhoneInput(e.target.value)}
            className="w-full bg-transparent border-b border-white text-white pb-2 outline-none text-base font-extralight font-lexend"
            placeholder="+1 234 567 8901"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-base font-extralight font-lexend mb-2">Special Requests</label>
          <input
            type="text"
            value={specialRequests}
            onChange={(e) => onSpecialRequestsChange(e.target.value)}
            className="w-full bg-transparent border-b border-white text-white pb-2 outline-none text-base font-extralight font-lexend"
            placeholder="ex. Food Allergies"
          />
        </div>
      </div>
    </div>
  );
};

export default ReservationForm; 