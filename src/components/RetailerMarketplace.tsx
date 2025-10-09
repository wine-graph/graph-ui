import {RetailerCard} from "./RetailerCard.tsx";
import {mockRetailer} from "../types/Retailer.ts";

/**
 * Retailer Marketplace component used for most user types
 * //todo @param userType
 */
export const RetailerMarketplace = () => {
    return (
        <div>
            {/* //todo use leaflet map*/}
            <div className="retailers grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {mockRetailer.map((retailer) => (
                    <RetailerCard key={retailer.id} {...retailer} />
                ))}
            </div>
        </div>
    )
}