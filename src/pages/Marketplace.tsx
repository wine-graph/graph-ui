import PageHeader from "../components/common/PageHeader.tsx";
import {RetailerMarketplace} from "../users/retailer/RetailerMarketplace.tsx";

export const MarketplacePage = () => {

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <PageHeader
        title="Wine Locator"
        desc="Find local wine retailers in your area. Discover shops that carry your favorite wines."
      />
      <RetailerMarketplace/>
    </div>
  );
}