import PageHeader from "../../common/PageHeader";
import SectionCard from "../../common/SectionCard.tsx";
import { FaLink } from "../../../assets/icons";
import Button from "../../common/Button.tsx";

// todo each Profile would have the Google OIDC login flow
const VisitorProfile = () => {
  return (
    <div className="w-full px-3 sm:px-0 sm:ml-8 my-4 sm:my-8">
      <PageHeader
        title="Visitor Profile"
        desc="This platform allows you to explore wine regions, producers, and varietals without creating an account."
      />
      <div className="mt-5">
        <SectionCard
          cardHeader={{ icon: FaLink, title: "Make a good connection" }}
        >
          <div className="my-3 px-4">
            <p className="text-sm text-textSecondary mb-3">
              Want to save wines, write reviews, and build a cellar?
            </p>
            <Button className="bg-textPrimary-1 hover:bg-gray-600 text-white font-medium px-4 py-2">
              <FaLink />
              <span className="text-sm">
                Sign Up to Personalize Your Experience
              </span>
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default VisitorProfile;
