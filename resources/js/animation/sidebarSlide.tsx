import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarSlideProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const SidebarSlide: React.FC<SidebarSlideProps> = ({ isOpen, children }) => {
  const sidebarVariants = {
    closed: {
      x: "-100%",
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    open: {
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const navItemVariants = {
    closed: {
      opacity: 0,
      y: 20,
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full z-40 bg-beige"
          variants={sidebarVariants}
          initial="closed"
          animate="open"
          exit="closed"
        >
          <motion.div className="flex items-center justify-center h-full">
            <motion.nav>
              <motion.ul className="space-y-8 text-center">
                {React.Children.map(children, (child, index) => (
                  <motion.li
                    key={index}
                    variants={navItemVariants}
                  >
                    {child}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SidebarSlide; 