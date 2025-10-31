import PageHeader from "../components/common/PageHeader.tsx";
import {RetailerMarketplace} from "../users/retailer/RetailerMarketplace.tsx";

export const MarketplacePage = () => {

  return (
    <div className="w-full px-3 sm:px-0 sm:ml-8 my-4 sm:my-8">
      <PageHeader
        title="Wine Locator"
        desc="Find local wine retailers in your area. Discover shops that carry your favorite wines."
      />
      <RetailerMarketplace/>
    </div>
  );
}