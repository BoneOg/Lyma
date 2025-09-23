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
        // Use requestAnimationFrame to avoid forced reflows
        requestAnimationFrame(() => {
          if (textRef.current) {
            setTextWidth(textRef.current.offsetWidth);
          }
        });
      }
    };

    // Initial measurement with delay to avoid blocking initial render
    const initialTimeout = setTimeout(updateWidth, 0);

    // Wait for fonts to load
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setTimeout(updateWidth, 0);
      });
    }

    // Use ResizeObserver for dynamic updates
    const resizeObserver = new ResizeObserver((entries) => {
      // Debounce resize updates to prevent excessive reflows
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateWidth, 16); // ~60fps
    });
    
    let resizeTimeout: NodeJS.Timeout;
    
    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      clearTimeout(initialTimeout);
      clearTimeout(resizeTimeout);
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