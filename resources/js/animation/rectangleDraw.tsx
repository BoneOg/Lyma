import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface RectangleDrawProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  borderWidth?: string;
  duration?: number;
  delay?: number;
}

const RectangleDraw: React.FC<RectangleDrawProps> = ({
  children,
  className = "",
  borderColor = "beige",
  borderWidth = "h-px",
  duration = 0.2,
  delay = 0.1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    // Initial measurement
    updateDimensions();

    // Wait for fonts to load
    if (document.fonts) {
      document.fonts.ready.then(updateDimensions);
    }

    // Use ResizeObserver for dynamic updates
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Fallback timeout for font loading
    const timeout = setTimeout(updateDimensions, 100);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timeout);
    };
  }, [children]);

  return (
    <motion.div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {/* Top border - draws from left to right */}
      <motion.div
        className={`absolute top-0 left-0 ${borderWidth}`}
        style={{ 
          backgroundColor: borderColor,
          height: borderWidth === 'h-px' ? '1px' : borderWidth
        }}
        animate={{
          width: isHovered ? dimensions.width : 0
        }}
        transition={{
          duration,
          ease: "easeInOut",
          delay: isHovered ? delay : delay + duration * 3
        }}
      />
      
      {/* Right border - draws from top to bottom */}
      <motion.div
        className={`absolute top-0 right-0 w-px`}
        style={{ 
          backgroundColor: borderColor,
          width: '1px'
        }}
        animate={{
          height: isHovered ? dimensions.height : 0
        }}
        transition={{
          duration,
          ease: "easeInOut",
          delay: isHovered ? delay + duration : delay + duration * 2
        }}
      />
      
      {/* Bottom border - draws from right to left */}
      <motion.div
        className={`absolute bottom-0 ${borderWidth}`}
        style={{ 
          backgroundColor: borderColor,
          height: borderWidth === 'h-px' ? '1px' : borderWidth,
          right: 0,
          transformOrigin: 'right'
        }}
        animate={{
          width: isHovered ? dimensions.width : 0
        }}
        transition={{
          duration,
          ease: "easeInOut",
          delay: isHovered ? delay + duration * 2 : delay + duration
        }}
      />
      
      {/* Left border - draws from bottom to top */}
      <motion.div
        className={`absolute left-0 w-px`}
        style={{ 
          backgroundColor: borderColor,
          width: '1px',
          bottom: 0,
          transformOrigin: 'bottom'
        }}
        animate={{
          height: isHovered ? dimensions.height : 0
        }}
        transition={{
          duration,
          ease: "easeInOut",
          delay: isHovered ? delay + duration * 3 : delay
        }}
      />
    </motion.div>
  );
};

export default RectangleDraw;