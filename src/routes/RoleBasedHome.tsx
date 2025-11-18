import {HomePage} from "../pages/Home.tsx";
import {useAuth} from "../auth/authContext.ts";

const RoleBasedHome = () => {
  const {role} = useAuth();

  // Extend this mapping as new roles are added
  if (role === "retailer") {
    return <HomePage userType={"retailer"}/>;
  }

  // Default visitor landing page
  return <HomePage userType={"visitor"}/>;
};

export default RoleBasedHome;
