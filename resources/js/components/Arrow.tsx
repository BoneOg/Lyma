import React from "react";

interface ArrowProps {
  color?: "olive" | "beige";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Arrow: React.FC<ArrowProps> = ({ 
  color = "olive", 
  size = "md", 
  className = "" 
}) => {
  const colorValue = color === "olive" ? "#3D401E" : "#FAF7CA";
  
  const sizeClasses = {
    sm: "w-4 h-4",      // 16px
    md: "w-6 h-6",      // 24px (1.5em equivalent)
    lg: "w-8 h-8",      // 32px
    xl: "w-10 h-10"     // 40px
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path 
        fill={colorValue} 
        d="M17.47 7.47a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0v-3.78H2a.75.75 0 0 1 0-1.5h15.47z" 
      />
    </svg>
  );
};

export default Arrow;
