import React from "react";
import SidebarSlide from "@/animation/sidebarSlide";

interface SideBarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  "HOME",
  "RESERVATION",
  "ABOUT US",
  "MENU",
  "GALLERY",
  "JOURNAL",
  "CONTACT",
];

const SideBar: React.FC<SideBarProps> = ({ open, onClose }) => {
  return (
    <SidebarSlide isOpen={open}>
      {navItems.map((item) => (
        <a
          key={item}
          href={
            item === "HOME"
              ? "/"
              : `#${item.replace(/ /g, "-").toLowerCase()}-section`
          }
          className="text-6xl font-light font-lexend transition-all duration-300 hover:scale-110 inline-block"
          style={{ color: '#3c4119' }}
          onClick={onClose}
        >
          {item}
        </a>
      ))}
    </SidebarSlide>
  );
};

export default SideBar;