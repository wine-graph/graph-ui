import {useState} from "react";
import {NavLink} from "react-router-dom";
import Logo from "../../assets/images/Wine-logo.png";
import {FaGlobe, FaHome, FaSearch, FaShoppingCart, FaSignInAlt, FaUser,} from "../../assets/icons";
import Button from "../common/Button";
import {useAuth} from "../../context/useAuth";

const Header = () => {
  const {isAuthenticated, user} = useAuth();
  //const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navlinks = [
    {title: "Home", icon: FaHome, route: ""},
    {title: "Discover", icon: FaGlobe, route: "/explore"},
    {
      title: "Marketplace",
      icon: FaShoppingCart,
      route: "/marketplace",
    },
    {title: "Profile", icon: FaUser, route: "/profile"},
  ];

  // const handleLogout = () => {
  //   logout();
  //   setIsOpen(false);
  //   navigate("/");
  // };
  return (
    <>
      <header
        className="sticky top-0 py-3 px-3 sm:px-5 flex items-center justify-between bg-primary/6 backdrop-blur-xl">
        <div className="logo">
          <img src={Logo} alt="wine graph" className="w-20"/>
        </div>
        <div className="search-bar md:inline-block hidden ">
          <div className="search flex items-center rounded-xl">
            <input
              type="text"
              placeholder="search your favorite wine"
              className="w-sm px-3 py-2 outline-none border-2 border-primary border-r-0 rounded-l-xl focus:bg-white transition-all duration-200 font-poppins text-sm"
            />
            <button
              className=" px-3 py-1.5 rounded-r-xl border-2 border-primary bg-primary text-white font-medium flex-center cursor-pointer hover:bg-buttonHover hover:border-buttonHover">
              <FaSearch size={24}/>
            </button>
          </div>
        </div>

        {/* Profile / Auth section */}
        <div className="profile relative">
          {!isAuthenticated ? (
            <NavLink to="/profile">
              <Button className="px-4 bg-primary hover:bg-buttonHover text-white">
                <FaSignInAlt/>
                Log In
              </Button>
            </NavLink>
          ) : (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="size-8 rounded-full border-2 border-gray-400 text-textPrimary-1 flex-center font-roboto font-semibold overflow-hidden"
              aria-label="User menu"
            >
              {user?.pictureUrl ? (
                <img
                  src={user.pictureUrl}
                  alt={user.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>
                  {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </button>
          )}

          {/*{isOpen && (*/}
          {/*  <div className="absolute top-10 right-0 bg-background shadow-lg rounded-lg w-40 text-textPrimary font-roboto p-2">*/}
          {/*    <button*/}
          {/*      onClick={handleLogout}*/}
          {/*      className="flex items-center gap-x-3 w-full text-left hover:bg-primary/10 px-3 py-2 rounded-md"*/}
          {/*    >*/}
          {/*      <FaSignOutAlt />*/}
          {/*      Log out*/}
          {/*    </button>*/}
          {/*  </div>*/}
          {/*)}*/}
        </div>
      </header>

      {/* Bottom Navigation Bar */}
      <div
        className="sm:hidden flex fixed bottom-0 left-0 w-full backdrop-blur-lg bg-background/40 border-t border-gray-300 shadow-md rounded-t-4xl">
        <ul className="w-full flex items-center justify-between py-3 px-4 font-roboto">
          {navlinks.map((nav, index) => (
            <NavLink
              to={nav.route}
              key={index}
              className="flex flex-col items-center text-primary"
            >
              <nav.icon size={18}/>
              <span className=" mt-1">{nav.title}</span>
            </NavLink>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Header;
