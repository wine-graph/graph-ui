import { useState, type ReactNode } from "react";

import { Header } from "./RetailerCellar";
import { mockProducers, type Producer } from "../../../types/Producer";
import ProducerCard from "../../utility/ProducerCard";
import { FaPlus, FaMinus } from "../../../assets/icons";

export const RetailerMarketplace = () => {
  const [activeLink, setActiveLink] = useState("Discover Producer");
  const [favoriteProducers, setFavoriteProducers] = useState<Producer[]>([]);

  const handleAddToFavorite = (id: string) => {
    const producer = mockProducers.find((p) => p.id === id);
    if (producer) {
      setFavoriteProducers((prev) => [...prev, producer]);
    }
  };
  const handleRemoveToFavorite = (id: string) => {
    const fav = favoriteProducers.filter((p) => p.id !== id);
    setFavoriteProducers(fav);
  };

  const tabs = [
    "Discover Producer",
    "Favorite Producers",
    "Featured Wines",
    "New Offers",
  ];

  // Map tab names to components
  const tabComponents: Record<string, ReactNode> = {
    "Discover Producer": (
      <DiscoverProducer
        favoriteProducers={favoriteProducers}
        handleAddToFavorite={handleAddToFavorite}
      />
    ),
    "Favorite Producers": (
      <Favorite
        favoriteProducers={favoriteProducers}
        handleRemoveToFavorite={handleRemoveToFavorite}
      />
    ),
    "Featured Wines": <FeaturedWines />,
    "New Offers": <NewOffers />,
  };
  return (
    <div className="w-full px-3 sm:px-0 sm:ml-8 my-4 sm:my-8">
      <Header
        title="Marketplace"
        desc="Source wines, connect with producers, and manage your interests."
      />
      <div className="separator" />
      <div className="my-5">
        <div className="header bg-background pt-4 rounded-t-md">
          <ul className="flex items-center px-2 gap-x-3 text-xs sm:text-sm text-textPrimary-1 font-medium">
            {tabs.map((tab) => (
              <li
                key={tab}
                onClick={() => setActiveLink(tab)}
                className={`px-2 sm:px-4 py-1 sm:py-2 cursor-pointer transition-all duration-150
                ${
                  activeLink === tab
                    ? "bg-[#f8f1ec] rounded-t-md pb-2 sm:pb-3 -mb-1"
                    : "hover:bg-[#f8f1ec]/40 rounded-md mb-1"
                }`}
              >
                {tab}
              </li>
            ))}
          </ul>
          <div className="bg-[#f8f1ec] h-1 w-full"></div>
        </div>
        <div className="mt-4">{tabComponents[activeLink]}</div>
      </div>
    </div>
  );
};

function DiscoverProducer({
  handleAddToFavorite,
}: {
  favoriteProducers: Producer[];
  handleAddToFavorite: (id: string) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {mockProducers.map((producer) => (
        <ProducerCard
          key={producer.id}
          producer={producer}
          actionOnProducer={handleAddToFavorite}
          button={{
            icon: FaPlus,
            iconClass: "text-primary-1",
            title: "Add to Favorite",
            className:
              "border-primary px-3 py-2 text-sm md:text-base hover:bg-[#ffede1] hover:border-[#ffede1]",
          }}
        />
      ))}
    </div>
  );
}

function Favorite({
  favoriteProducers,
  handleRemoveToFavorite,
}: {
  favoriteProducers: Producer[];
  handleRemoveToFavorite: (id: string) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {favoriteProducers.length === 0 ? (
        <p>No favorite producer</p>
      ) : (
        favoriteProducers.map((prod) => (
          <ProducerCard
            key={prod.id}
            producer={prod}
            actionOnProducer={handleRemoveToFavorite}
            button={{
              icon: FaMinus,
              iconClass: "text-error group-hover:text-white",
              title: "Remove from Favorite",
              className:
                "group border-error px-3 py-2 text-sm md:text-base hover:bg-error hover:border-error",
            }}
          />
        ))
      )}
    </div>
  );
}

function FeaturedWines() {
  return <div>Featured wines coming soon!</div>;
}

const NewOffers: React.FC = () => {
  return <div>Offers are coming soon!</div>;
};
