import PageHeader from "../components/common/PageHeader.tsx";
import SquareAuth from "../components/users/retailer/SquareAuth.tsx";
import {useAppSelector} from "../store/hooks.ts";
import GoogleButton from "react-google-button";

const sessionUrl = import.meta.env.DEV
    ? "http://localhost:8086/session/login"
    : "https://wine-retailer.fly.dev/session/login";

/**
 * Profile page for all user types
 * - Google AuthN happens from here; Square AuthZ session refresh is handled inside SquareAuth.
 */
export const ProfilePage = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="w-full px-3 sm:px-0 sm:ml-8 my-4 sm:my-8">
      <PageHeader
        title={isAuthenticated ? "Welcome back!" : "Register for a Profile"}
        desc={
          isAuthenticated
            ? `Hi! Retailer_Name, Welcome back to your profile.`
            : "This platform allows you to... based on user type"
        }
      />
      <div className="mt-5">
        {!isAuthenticated ? (
            <GoogleButton
                type={"light"}
                onClick={() => { window.location.href = sessionUrl; }}
            />
        ) : (
          <SquareAuth />
        )}
      </div>
    </div>
  );
};
