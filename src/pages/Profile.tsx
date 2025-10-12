import PageHeader from "../components/common/PageHeader.tsx";
import SectionCard from "../components/common/SectionCard.tsx";
import { FaLink } from "../assets/icons.ts";
import Button from "../components/common/Button.tsx";
import { NavLink } from "react-router-dom";
import SquareAuth from "../components/users/retailer/SquareAuth.tsx";
import { useAppSelector } from "../store/hooks.ts";

/**
 * Profile page for all user types
 * //todo @param userType
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
          <SectionCard
            cardHeader={{ icon: FaLink, title: "Connect through Google" }}
          >
            <div className="my-3 px-4">
              <p className="text-sm text-textSecondary mb-3">
                Want to use this platform?
              </p>
              <NavLink to="/login">
                <Button className="bg-textPrimary-1 hover:bg-gray-600 text-white font-medium px-4 py-2 my-5">
                  <FaLink />
                  <span className="text-sm">
                    Sign Up to Personalize Your Experience
                  </span>
                </Button>
              </NavLink>
            </div>
          </SectionCard>
        ) : (
          <SquareAuth />
        )}
      </div>
    </div>
  );
};
