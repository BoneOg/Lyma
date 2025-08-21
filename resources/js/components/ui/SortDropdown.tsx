import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: SortOption[];
  className?: string;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange, options, className }) => (
  <div className={`flex items-center gap-2 sm:gap-2 md:gap-3 lg:gap-3 xl:gap-3 2xl:gap-3 h-10 border-primary-light border bg-primary-light text-olive font-lexend font-light px-2 py-1 rounded-none transition-all duration-300 hover:scale-[1.02] focus-within:ring-1 focus-within:ring-olive outline-none focus-within:outline-none min-w-0 ${className || ''}`}>
    {/* Filter Icon - Made more prominent and visible */}
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 xl:h-5 xl:w-5 2xl:h-5 2xl:w-5 text-olive flex-shrink-0 mr-2 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A2 2 0 0013 14.586V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-3.414a2 2 0 00-.586-1.414L2 6.707A1 1 0 012 6V4z" />
    </svg>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="shadcn-select-trigger flex-1 bg-transparent border-none outline-none shadow-none px-0 py-0 focus:outline-none focus:ring-0 focus:ring-transparent focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-[10px] sm:text-xs md:text-[10px] lg:text-sm xl:text-sm 2xl:text-sm min-w-0">
        <SelectValue className="truncate" />
      </SelectTrigger>
      <SelectContent className="!bg-primary-light shadow-card border-primary-light border shadow-lg transition-all py-2 text-[#3f411a]">
        {options.map(opt => (
          <SelectItem key={opt.value} value={opt.value} className="text-xs sm:text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-sm text-[#3f411a] hover:bg-beige-light outline-none font-lexend font-light">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default SortDropdown; 