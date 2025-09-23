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
        ease: "easeInOut" as const,
      },
    },
    open: {
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut" as const,
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
        ease: "easeOut" as const,
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
          <motion.div className="flex items-center justify-center h-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
            <motion.nav>
              <motion.ul className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-7 2xl:space-y-7 text-center">
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