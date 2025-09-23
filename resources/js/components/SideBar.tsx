import React from "react";
import SidebarSlide from "@/animation/sidebarSlide";

interface SideBarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { name: "HOME", route: "/" },
  { name: "RESERVATION", route: "/reservation" },
  { name: "ABOUT US", route: "/about" },
  { name: "CHEF", route: "/chef" },
  { name: "Menu", route: "/menu" },
  { name: "GALLERY", route: "/gallery" },
  { name: "JOURNAL", route: "/journal" },
];

const SideBar: React.FC<SideBarProps> = ({ open, onClose }) => {
  return (
    <SidebarSlide isOpen={open}>
      {navItems.map((item) => (
        <a
          key={item.name}
          href={item.route}
          className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-5xl font-light font-lexend transition-all duration-300 hover:scale-110 inline-block"
          style={{ color: '#3c4119' }}
          onClick={onClose}
        >
          {item.name}
        </a>
      ))}
    </SidebarSlide>
  );
};

export default SideBar;