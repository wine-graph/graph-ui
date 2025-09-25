import SectionCard from "../../home/SectionCard";
import {
  FaRegCompass,
  FaMapMarkedAlt,
  FaSeedling,
  FaUserSecret,
} from "../../../assets/icons";
import Button from "../../utility/Button";
import { NavLink } from "react-router-dom";

const VisitorDiscover = () => {
  const actionButtons = [
    {
      icon: FaMapMarkedAlt,
      title: "Browse by Region",
      navLink: "/explore?q=regions",
    },
    {
      icon: FaSeedling,
      title: "Browse by Varietal",
      navLink: "/explore?q=varietals",
    },
    {
      icon: FaUserSecret,
      title: "Browse by Producer",
      navLink: "/explore?q=producers",
    },
  ];

  return (
    <SectionCard
      cardHeader={{
        icon: FaRegCompass,
        title: "Discover",
      }}
      className="flex-1"
    >
      <div className="px-3 flex flex-col gap-3 p-3">
        {actionButtons.map((btn, index) => (
          <Button
            key={index}
            className="flex-center py-2 border-gray-600 text-textPrimary-1 hover:bg-gray-600 hover:text-white"
          >
            <NavLink
              to={btn.navLink}
              className="flex-center lg:gap-3 gap-2 md:text-sm lg:text-base"
            >
              <btn.icon />
              <span>{btn.title}</span>
            </NavLink>
          </Button>
        ))}
      </div>
    </SectionCard>
  );
};

export default VisitorDiscover;
