import PageHeader from "../components/common/PageHeader.tsx";
import {RetailerMarketplace} from "../components/RetailerMarketplace.tsx";

/**
 * Marketplace page for all user types
 * //todo @param userType
 * Most user types (visitor, enthusiast, producer) will render retailer data, in various forms however
 * retailer userType will be the exception as they will render producer data
 */
export const MarketplacePage = () => {

    return (
        <div className="w-full px-3 sm:px-0 sm:ml-8 my-4 sm:my-8">
            <PageHeader
                title="Wine Locator"
                desc="Find local wine retailers in your area. Discover shops that carry your favorite wines."
            />
            {/*<div className="main-content flex flex-col my-6">*/}
            {/*    <div*/}
            {/*        className="search self-end border border-gray-300 flex items-center rounded-lg bg-gray-100/70 w-1/3 font-roboto mb-4">*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            placeholder="Search retailer by name or location..."*/}
            {/*            className="px-3 py-2 outline-none text-sm text-textPrimary-1 focus:bg-gray-50 rounded-l-lg w-full"*/}
            {/*            value={searchTerm}*/}
            {/*            onChange={(e) => setSearchTerm(e.target.value)}*/}
            {/*        />*/}
            {/*        <button className="border-l px-2 border-gray-300">*/}
            {/*            <FaSearch className="text-gray-700 cursor-pointer"/>*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <RetailerMarketplace/>
        </div>
    );
}