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
  lineColor = "#f6f5c6",
  lineHeight = "h-0.5",
  duration = 0.3
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.offsetWidth);
    }
  }, []);

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
        className={`absolute bottom-0 ${lineHeight}`}
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