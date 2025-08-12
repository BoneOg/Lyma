import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface UnderlineProps {
  children: React.ReactNode;
  className?: string;
  lineColor?: string;
  lineHeight?: string;
  duration?: number;
}

const Underline: React.FC<UnderlineProps> = ({
  children,
  className = "",
  lineColor = "beige",
  lineHeight = "h-px",
  duration = 0.3
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (textRef.current) {
        setTextWidth(textRef.current.offsetWidth);
      }
    };

    // Initial measurement
    updateWidth();

    // Wait for fonts to load
    if (document.fonts) {
      document.fonts.ready.then(updateWidth);
    }

    // Use ResizeObserver for dynamic updates
    const resizeObserver = new ResizeObserver(updateWidth);
    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    // Fallback timeout for font loading
    const timeout = setTimeout(updateWidth, 100);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timeout);
    };
  }, [children]);

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      whileHover="hover"
      initial="initial"
    >
      <span ref={textRef} className="inline-block">
        {children}
      </span>
      <motion.div
        className={`absolute bottom-[-4px] ${lineHeight}`}
        style={{ 
          backgroundColor: lineColor,
          left: 0,
          width: textWidth
        }}
        variants={{
          initial: { scaleX: 0, transformOrigin: "left" },
          hover: { scaleX: 1, transformOrigin: "left" }
        }}
        transition={{ duration, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

export default Underline; 