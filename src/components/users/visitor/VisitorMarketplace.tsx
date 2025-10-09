import { useState } from "react";
import PageHeader from "../../common/PageHeader";
import Map from "../../../assets/images/map.png";
import { FaSearch, MdKeyboardArrowDown } from "../../../assets/icons";
import {RetailerCard} from "../../RetailerCard.tsx";
import { mockRetailer } from "../../../types/Retailer";

// todo again perhaps call Marketplace
const VisitorMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // Filter retailers based on search term and location
  const filteredRetailers = mockRetailer.filter(
    (retailer) =>
      (retailer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (retailer.location?.city &&
          retailer.location.city
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (retailer.location?.state &&
          retailer.location.state
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))) &&
      (selectedLocation === "" ||
        (retailer.location?.city &&
          retailer.location.city === selectedLocation) ||
        (retailer.location?.state &&
          retailer.location.state === selectedLocation))
  );

  // Get unique locations from retailers
  const locations = mockRetailer
    .map((retailer) => retailer.location?.city || "")
    .filter((city, index, self) => city && self.indexOf(city) === index);

  return (
    <div className="w-full px-3 sm:px-0 sm:ml-8 my-4 sm:my-8">
      <PageHeader
        title="Wine Finder"
        desc="Find local wine retailers in your area. Discover shops that carry your favorite wines."
      />
      <div className="main-content flex flex-col my-6">
        <div className="search self-end border border-gray-300 flex items-center rounded-lg bg-gray-100/70 w-1/3 font-roboto mb-4">
          <input
            type="text"
            placeholder="Search retailer by name or location..."
            className="px-3 py-2 outline-none text-sm text-textPrimary-1 focus:bg-gray-50 rounded-l-lg w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="border-l px-2 border-gray-300">
            <FaSearch className="text-gray-700 cursor-pointer" />
          </button>
        </div>
        <div className="map w-full md:h-88 lg:h-96 overflow-hidden border-2 border-gray-100 rounded-xl p-0.5 shadow">
          <img src={Map} alt="" className="w-full h-full rounded-xl" />
        </div>
        <div className="filter flex items-center justify-between my-8 mt-12">
          <div className="">
            <h1 className="text-2xl text-textPrimary-1 font-medium">
              Wine Retailers
            </h1>
          </div>
          <div className="relative w-56 font-poppins">
            <select
              className="appearance-none text-sm w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 pr-8 text-gray-700 focus:border-gray-400 focus:outline-none cursor-pointer"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All Location</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>

            {/* Custom Arrow */}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-500">
              <MdKeyboardArrowDown size={20} />
            </span>
          </div>
        </div>
        <div className="retailers grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRetailers.map((retailer) => (
            <RetailerCard key={retailer.id} {...retailer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisitorMarketplace;
