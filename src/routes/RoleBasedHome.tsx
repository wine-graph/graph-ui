import {HomePage} from "../pages/Home.tsx";
import {useAuth} from "../context/authContext.ts";

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
