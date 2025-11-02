import {HomePage} from "../pages/Home.tsx";
import {useAuth} from "../context/authContext.ts";

const RoleBasedHome = () => {
  const {user} = useAuth();
  const role = user?.user?.role?.value ?? "";

  // Extend this mapping as new roles are added
  if (role === "retailer") {
    return <HomePage userType={"retailer"}/>;
  }

  // Default visitor landing page
  return <HomePage userType={"visitor"}/>;
};

export default RoleBasedHome;
