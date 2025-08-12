import React from "react";
import { motion } from "framer-motion";

interface MenuToggleProps {
  isOpen: boolean;
  onClick: () => void;
  color: string;
}

const MenuToggle: React.FC<MenuToggleProps> = ({ isOpen, onClick, color }) => {
  return (
    <motion.button
      className="flex items-center justify-center w-12 h-12 z-10 hover:scale-120 transition-transform duration-300 ease-in-out"
      onClick={onClick}
      aria-label="Toggle menu"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative w-6 h-6">
        <motion.div
          className="absolute top-0 left-0 w-6 h-0.5 bg-current"
          style={{ backgroundColor: color }}
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 8 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute top-2 left-0 w-4 h-0.5 bg-current"
          style={{ backgroundColor: color }}
          animate={{
            opacity: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute top-4 left-0 w-6 h-0.5 bg-current"
          style={{ backgroundColor: color }}
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -8 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.button>
  );
};

export default MenuToggle; 