import { useState, type ReactNode } from "react";

import ProducerCard from "../../ProducerCard.tsx";
import PageHeader from "../../common/PageHeader.tsx";

import { mockProducers, type Producer } from "../../../types/Producer.ts";

import { FaPlus, FaMinus } from "react-icons/fa";
import SectionTab from "../../common/SectionTab.tsx";

// todo should this be renamed to ProducerMarketplace?
export const RetailerMarketplace = () => {
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
      <PageHeader
        title="Marketplace"
        desc="Source wines, connect with producers, and manage your interests."
      />
      <SectionTab tabs={tabs} tabComponents={tabComponents} query={null} />
    </div>
  );
};

// Producer discover
const DiscoverProducer: React.FC<{
  favoriteProducers: Producer[];
  handleAddToFavorite: (id: string) => void;
}> = ({ handleAddToFavorite }) => {
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
};

// Favorite producers
const Favorite: React.FC<{
  favoriteProducers: Producer[];
  handleRemoveToFavorite: (id: string) => void;
}> = ({ favoriteProducers, handleRemoveToFavorite }) => {
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
};

// Featured Wines
const FeaturedWines: React.FC = () => {
  return <div>Featured wines coming soon!</div>;
};

// New Offers
const NewOffers: React.FC = () => {
  return <div>Offers are coming soon!</div>;
};
