import Logo from "../../assets/images/Wine-logo.png";
import { FaSearch } from "../../assets/icons";

const Header = () => {
  return (
    <header className="sticky top-0 py-3 px-3 sm:px-5 flex items-center justify-between bg-primary/6 backdrop-blur-xl">
      <div className="logo">
        <img src={Logo} alt="wine graph" className="w-20" />
      </div>
      <div className="search-bar md:inline-block hidden ">
        <div className="search flex items-center rounded-xl">
          <input
            type="text"
            placeholder="search your favorite wine"
            className="w-sm px-3 py-2 outline-none border-2 border-primary border-r-0 rounded-l-xl focus:bg-white transition-all duration-200 font-poppins text-sm"
          />
          <button className=" px-3 py-1.5 rounded-r-xl border-2 border-primary bg-primary text-white font-medium flex-center cursor-pointer hover:bg-buttonHover hover:border-buttonHover">
            <FaSearch size={24} />
          </button>
        </div>
      </div>
      <div className="profile">
        {/* <div className="size-8 rounded-full bg-amber-800"></div> */}
      </div>
    </header>
  );
};

export default Header;
