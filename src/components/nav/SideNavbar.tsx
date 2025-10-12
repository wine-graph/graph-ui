import { useState } from "react";
import {
  FaHome,
  FaBoxOpen,
  FaShoppingCart,
  FaUser,
  FaGlobe,
  FaWineBottle,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/features/authSlice";

const SideNavbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
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

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <div
      className={`hidden sm:inline-block fixed min-h-screen left-0 bg-primary/6 overflow-hidden transition-all duration-200 z-40 backdrop-blur-xl
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
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="hidden sm:flex absolute bottom-20 w-full items-center gap-x-5 px-5 py-3 cursor-pointer transition-all duration-200 hover:bg-primary/10 text-textPrimary"
        >
          <span>
            <FaSignOutAlt size={22} />
          </span>
          <span
            className={`whitespace-nowrap transition-all duration-200 ${
              isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            }`}
          >
            Log out
          </span>
        </button>
      )}
    </div>
  );
};

export default SideNavbar;
