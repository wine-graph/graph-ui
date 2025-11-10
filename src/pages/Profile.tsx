import PageHeader from "../components/common/PageHeader.tsx";
import GoogleButton from "react-google-button";
import {useAuth} from "../context/authContext.ts";
import GoogleProfile from "../components/common/GoogleProfile.tsx";
import SquareAuth from "../users/retailer/SquareAuth.tsx";
import {startAuthentication} from "../services/authClient";

/**
 * Profile page for all users types
 * - Google AuthN happens from here; Square AuthZ session refresh is handled inside SquareAuth.
 */
export const ProfilePage = () => {
  const {isAuthenticated, user} = useAuth();
  return (
    <div className="w-full px-3 sm:px-0 sm:ml-8 my-4 sm:my-8">
      <PageHeader
        title={isAuthenticated ? "Welcome back!" : "Register for a Profile"}
        desc={
          isAuthenticated
            ? `Hi! ${user?.user.name}, welcome back to Wine Graph.`
            : "This platform allows you to... based on users type"
        }
      />
      <div className="mt-5">
        {!isAuthenticated ? (
            <GoogleButton
              type={"light"}
              onClick={startAuthentication}
            />
          ) :
          <div className="mt-5 flex flex-col gap-4">
            <GoogleProfile name={user?.user.name ?? ""} key={user?.user.id ?? ""} email={user?.user.email ?? ""}
                           picture={user?.user.picture ?? ""}/>
            <SquareAuth/>
          </div>
        }
      </div>
    </div>
  );
};
