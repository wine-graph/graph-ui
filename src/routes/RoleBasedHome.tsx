import {HomePage} from "../pages/Home";
import {useAuth} from "../context/useAuth";

const RoleBasedHome = () => {
  const {user} = useAuth();
  const roles = user?.roles ?? [];

  // Extend this mapping as new roles are added
  if (roles.includes("retailer")) {
    return <HomePage userType={"retailer"}/>;
  }

  // Default visitor landing page
  return <HomePage userType={"visitor"}/>;
};

export default RoleBasedHome;
