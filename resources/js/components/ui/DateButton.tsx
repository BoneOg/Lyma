import React from 'react';

interface DateButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
}

const DateButton: React.FC<DateButtonProps> = ({ onClick, label, className }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 h-10 border-primary-light border bg-primary-light text-olive font-lexend font-light px-2 py-1 transition-all duration-300 hover:scale-[1.09] focus:ring-1 focus:ring-olive focus:outline-none ${className || ''}`}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-olive mr-1 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
    {label}
  </button>
);

export default DateButton; 