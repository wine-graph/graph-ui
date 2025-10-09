import { useState } from "react";
import {
  FaHome,
  FaBoxOpen,
  FaShoppingCart,
  FaUser,
  FaGlobe,
  FaWineBottle,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const SideNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navlinks = {
    visitor: [
      { title: "Home", icon: FaHome, route: "" },
      { title: "Discover", icon: FaGlobe, route: "/explore" },
      {
        title: "Marketplace",
        icon: FaShoppingCart,
        route: "/marketplace",
      },
      { title: "Profile", icon: FaUser, route: "/profile" },
    ],
    enthusiast: [
      { title: "Home", icon: FaHome },
      { title: "Discover", icon: FaGlobe },
      { title: "Cellar", icon: FaWineBottle },
      { title: "Marketplace", icon: FaShoppingCart },
      { title: "Profile", icon: FaUser },
    ],
    producer: [
      { title: "Home", icon: FaHome },
      { title: "Cellar", icon: FaBoxOpen },
      { title: "Marketplace", icon: FaShoppingCart },
      { title: "Profile", icon: FaUser },
    ],
    retailer: [
      { title: "Home", icon: FaHome, route: "" },
      { title: "Cellar", icon: FaBoxOpen, route: "/inventory" },
      {
        title: "Marketplace",
        icon: FaShoppingCart,
        route: "/marketplace",
      },
      { title: "Profile", icon: FaUser, route: "/profile" },
    ],
  };
  return (
    <div
      className={`hidden sm:flex fixed min-h-screen left-0 bg-primary/6 overflow-hidden transition-all duration-200 z-50 backdrop-blur-xl
        ${isOpen ? "w-52" : "w-16"}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <ul className="w-full flex flex-col gap-y-4 pt-3 text-primary">
        {navlinks.visitor.map((nav, index) => (
          <NavLink
            to={nav.route}
            key={index}
            className={({ isActive }) =>
              `group w-full flex items-center gap-x-5 px-5 py-3 cursor-pointer transition-all duration-200
               ${isActive ? "bg-primary text-white" : "hover:bg-primary/10"}`
            }
          >
            {/* Icon always visible */}
            <span>
              <nav.icon size={22} />
            </span>
            {/* Text visible only if sidebar is open */}
            <span
              className={`whitespace-nowrap transition-all duration-200 ${
                isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              }`}
            >
              {nav.title}
            </span>
          </NavLink>
        ))}
      </ul>
    </div>
  );
};

export default SideNavbar;
