import PageHeader from "../components/common/PageHeader.tsx";
import GoogleButton from "react-google-button";
import {useAuth} from "../auth/authContext.ts";
import GoogleProfile from "../components/common/GoogleProfile.tsx";
import SquareAuth from "../users/retailer/SquareAuth.tsx";
import {startAuthentication} from "../auth/authClient.ts";

export const ProfilePage = () => {
  const {isAuthenticated, user, isLoading} = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-8 sm:my-12">
      <PageHeader
        title={isAuthenticated ? "Welcome back!" : "Register for a Profile"}
        desc={
          isAuthenticated
            ? `Hi ${user?.user.name}, welcome back to Wine Graph.`
            : "This platform allows you to manage wine data based on your role."
        }
      />

      <div className="mt-10">
        {!isAuthenticated ? (
          <div className="flex justify-center">
            <GoogleButton
              type="light"
              label="Sign in with Google"
              onClick={startAuthentication}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Google Profile */}
            <div className="order-1">
              <GoogleProfile
                name={user?.user.name ?? ""}
                email={user?.user.email ?? ""}
                picture={user?.user.picture ?? ""}
              />
            </div>

            {/* Right: Square Auth (only for visitors/retailers) */}
            <div className="order-2 lg:order-2">
              {user?.user.role.value === "visitor" && <SquareAuth/>}
            </div>
          </div>
        )}
      </div>

      {/* Future sections can go here – plenty of horizontal space now! */}
    </div>
  );
};