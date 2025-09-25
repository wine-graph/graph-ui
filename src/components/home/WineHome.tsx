import SectionCard from "./SectionCard";
import WineCard from "../utility/WineCard";
import type { userHomeComp } from "./Home";

import { FaRegStar, IoAnalytics, BsStars } from "../../assets/icons";

import { mockWines } from "../../types/Wine";
import { mockProducers } from "../../types/Producer";

// Helper to create deterministic pseudo-metrics from an id string
function pseudoMetric(id: string, salt: number): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i) + salt) >>> 0;
  }
  // keep in a human-friendly range
  return (hash % 97) + 3; // 3..99
}

const WineHome: React.FC<userHomeComp> = ({ userComponent }) => {
  const winesWithMetrics = mockWines.map((w) => ({
    wine: w,
    reviews: pseudoMetric(w.id, 7),
    tastings: pseudoMetric(w.id, 19),
    offerScore:
      (w.pricePerBottle
        ? Math.max(1, 100 - Math.round(w.pricePerBottle))
        : 50) +
      (pseudoMetric(w.id, 3) % 10),
  }));

  // Helper to create most reviewed wines data
  const mostReviewed = winesWithMetrics
    .slice(0, 6)
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 6)
    .map((x) => x.wine);

  // Helper to create trending offers data
  const trendingOffers = winesWithMetrics
    .slice()
    .sort((a, b) => b.offerScore - a.offerScore)
    .slice(0, 8)
    .map((x) => x.wine);

  const newProducers = mockProducers.slice(2, 5);
  const newWines = mockWines.slice(2, 6);

  return (
    <div className="w-full flex justify-center flex-col gap-5 my-16">
      <div className="flex flex-col md:flex-row gap-5">
        {/* Most Reviewed Wines Section */}
        <SectionCard
          cardHeader={{ icon: FaRegStar, title: "Most Reviewed Wines" }}
          className="flex-2/5"
        >
          <div className="w-full grid sm:grid-cols-2 xl:grid-cols-3  gap-4 p-4">
            {mostReviewed.map((wine, index) => (
              <WineCard key={index} {...wine} />
            ))}
          </div>
        </SectionCard>
        {userComponent}
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        {/* Trending offer Section */}
        <SectionCard
          cardHeader={{ icon: IoAnalytics, title: "Trending Retailer Offers" }}
          className="flex-2/5"
        >
          <div className="px-3 py-2  rounded-b-lg bg-tableRow/20">
            <ul className="divide-y divide-border-light">
              {trendingOffers.map((wine) => (
                <li
                  key={wine.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-1 text-textPrimary px-2 py-3 text-sm "
                >
                  <span>
                    {wine.name} ({wine.vintage})
                  </span>
                  <span className="w-fit bg-textPrimary-1 text-white font-medium px-2 py-0.5 rounded-lg text-xs">
                    {wine.producer}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </SectionCard>

        {/* New Producer and wine Section */}
        <SectionCard
          cardHeader={{ icon: BsStars, title: "New Producers & Wines" }}
          className="flex-1"
        >
          <div className="px-3 py-2  rounded-b-lg bg-tableRow/20">
            <div className="new-producer mb-2">
              <ul className="divide-y divide-border-light">
                {newProducers.map((producer) => (
                  <li
                    key={producer.id}
                    className="flex items-center text-textPrimary justify-between p-2 text-xs"
                  >
                    <span>{producer.name}</span>

                    {producer.introOffer && (
                      <span className="text-textPrimary-1 font-medium">
                        Intro
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="new-wines">
              <p className="text-xs font-medium text-textPrimary-1 border-b border-gray-300 pb-0.5 mb-2">
                Recently added wines
              </p>
              <ul className="divide-y divide-border-light">
                {newWines.map((wine) => (
                  <li
                    key={wine.id}
                    className="flex items-center text-textPrimary justify-between p-2 text-xs"
                  >
                    <span>{wine.name}</span>
                    <span className="text-textPrimary-1 font-medium text-nowrap capitalize">
                      {wine.varietal}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default WineHome;
