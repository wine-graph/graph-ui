import {useMemo, useState} from "react";
import {NavLink} from "react-router-dom";
import {useAuth} from "../context/authContext.ts";
import {type NavLinkDef, resolveNavLinks, toPath} from "./roleNavConfig.ts";
import {useRetailer} from "../context/retailerContext.ts";

const SideNavbar = () => {
  const {isAuthenticated, user} = useAuth();
  const {retailerId} = useRetailer();
  const [isOpen, setIsOpen] = useState(false);

  const links: NavLinkDef[] = useMemo(
    () => resolveNavLinks(isAuthenticated, user, retailerId),
    [isAuthenticated, user, retailerId]
  );

  return (
    <div
      className={`hidden sm:inline-block fixed min-h-screen left-0 bg-primary/6 overflow-hidden transition-all duration-200 z-40 backdrop-blur-xl ${
        isOpen ? "w-52" : "w-16"
      }`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <ul className="w-full flex flex-col gap-y-4 pt-3 text-primary">
        {links.map((nav, index) => (
          <NavLink
            to={toPath(nav)}
            key={index}
            className={({isActive}) =>
              `group w-full flex items-center gap-x-5 px-5 py-3 cursor-pointer transition-all duration-200 ${
                isActive ? "bg-primary text-white" : "hover:bg-primary/10"
              }`
            }
          >
            <span>
              <nav.icon size={22}/>
            </span>
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
