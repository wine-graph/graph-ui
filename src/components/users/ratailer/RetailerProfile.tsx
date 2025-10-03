import SectionCard from "../../home/SectionCard";
import { FaConnectdevelop, FaLink } from "../../../assets/icons";
import Button from "../../utility/Button";
import PageHeader from "../../common/PageHeader";

export const RetailerProfile = () => {
  const handleSquareConnect = () => {
    // Kick off Square OAuth data-adapter will own the OAuth flow
    // https://data-adapter.fly.dev/oauth/authorize
    // https://localhost:8085/oauth/authorize
    window.location.href = "https://data-adapter.fly.dev/oauth/authorize";
  };

  return (
    <div className="w-full px-3 sm:px-0 sm:ml-8 my-4 sm:my-8">
      <PageHeader
        title="Retailer Profile"
        desc="Configure your shop settings and manage integration with Square."
      />

      <div className="mt-5">
        <SectionCard
          cardHeader={{ icon: FaConnectdevelop, title: "Square Integration" }}
        >
          <div className="my-3 px-4">
            <p className="text-sm text-textSecondary mb-3">
              Connect your Square account to sync inventory and sales.
            </p>
            <Button
              onClick={handleSquareConnect}
              className="bg-primary hover:bg-buttonHover text-white font-medium px-3 py-2"
            >
              <FaLink />
              <span className="text-sm">Connect with Square</span>
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};
