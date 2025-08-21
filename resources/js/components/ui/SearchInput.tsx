import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder, className }) => (
  <div className={`flex items-center gap-2 sm:gap-2 md:gap-3 lg:gap-3 xl:gap-3 2xl:gap-3 h-10 border-primary-light border bg-primary-light text-olive font-lexend px-2 py-1 transition-all duration-300 hover:scale-[1.02] focus-within:ring-1 focus-within:ring-olive focus-within:outline-none ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-4 lg:w-4 xl:h-4 xl:w-4 2xl:h-4 2xl:w-4 text-olive mr-1 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
    </svg>
    <input
      type="text"
      className="flex-1 bg-transparent outline-none border-none px-0 py-0 text-xs sm:text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-sm placeholder:text-xs sm:placeholder:text-xs md:placeholder:text-xs lg:placeholder:text-sm xl:placeholder:text-sm 2xl:placeholder:text-sm"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default SearchInput; 