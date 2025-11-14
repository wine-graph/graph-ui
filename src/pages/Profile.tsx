import PageHeader from "../components/common/PageHeader.tsx";
import GoogleButton from "react-google-button";
import {useAuth} from "../auth/authContext.ts";
import GoogleProfile from "../components/common/GoogleProfile.tsx";
import SquareAuth from "../users/retailer/SquareAuth.tsx";
import {startAuthentication} from "../auth/authClient.ts";
import {AuthDebug} from "../auth/AuthDebug.tsx";

export const ProfilePage = () => {
  const {isAuthenticated, user, isLoading} = useAuth();

  // Show spinner while loading
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="w-full px-3 sm:px-0 sm:ml-8 my-4 sm:my-8">
      <PageHeader
        title={isAuthenticated ? "Welcome back!" : "Register for a Profile"}
        desc={
          isAuthenticated
            ? `Hi ${user?.user.name}, welcome back to Wine Graph.`
            : "This platform allows you to manage wine data based on your role."
        }
      />
      <div className="mt-8">
        {!isAuthenticated ? (
            <GoogleButton
              type="light"
              label="Sign in with Google"
              onClick={startAuthentication}
            />
        ) : (
          <div className="mt-5 flex flex-col gap-4">
            <GoogleProfile
              name={user?.user.name ?? ""}
              email={user?.user.email ?? ""}
              picture={user?.user.picture ?? ""}
            />
            {/* todo change this after we implement role selector here */}
            {user?.user.role.value === "visitor" && (
              <SquareAuth/>
            )}
          </div>
        )}
      </div>
      {import.meta.env.DEV ? <AuthDebug/> : null}
    </div>
  );
};