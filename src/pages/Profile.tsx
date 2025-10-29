import PageHeader from "../components/common/PageHeader.tsx";
import GoogleButton from "react-google-button";
import {useAuth} from "../context/authContext.ts";
import GoogleProfile from "../components/common/GoogleProfile.tsx";
import SquareAuth from "../users/retailer/SquareAuth.tsx";

const sessionUrl = import.meta.env.DEV
  ? "http://localhost:8086/session/login"
  : "https://wine-retailer.fly.dev/session/login";

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
            ? `Hi! ${user?.name}, welcome back to Wine Graph.`
            : "This platform allows you to... based on users type"
        }
      />
      <div className="mt-5">
        {!isAuthenticated ? (
            <GoogleButton
              type={"light"}
              onClick={() => {
                window.location.href = sessionUrl;
              }}
            />
          ) :
          <div className="mt-5 flex flex-col gap-4">
            <GoogleProfile name={user?.name ?? ""} id={user?.id ?? ""} email={user?.email ?? ""}
                           pictureUrl={user?.pictureUrl ?? ""}/>
            <SquareAuth/>
          </div>
        }
      </div>
    </div>
  );
};
