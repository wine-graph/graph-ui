import React, { type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../../common/PageHeader";
import SectionTab from "../../common/SectionTab";
import Button from "../../utility/Button";
import { mockGrapes, mockRegions } from "../../../types/WineDomain";
import { mockProducers } from "../../../types/Producer";

const VisitorExplore = () => {
  const regions = mockRegions.map((region) => region.name);
  const varietals = mockGrapes.map((grape) => grape.name);
  const producers = mockProducers.map((producer) => producer.name);

  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  const tabs = ["Regions", "Varietals", "Producers"];

  // Map tab names to components
  const tabComponents: Record<string, ReactNode> = {
    regions: <Regions mockRegions={regions} />,
    varietals: <Varietals mockVarietals={varietals} />,
    producers: <Producers mockProducers={producers} />,
  };

  return (
    <div className="w-full px-3 sm:px-0 sm:ml-8 my-4 sm:my-8">
      <PageHeader
        title="Explore Wines"
        desc="Discover wines from around the world by region, varietal, or producer."
      />
      <SectionTab query={q} tabs={tabs} tabComponents={tabComponents} />
    </div>
  );
};

export default VisitorExplore;

// ----------------------- Tab Components ----------------------------
// Region tab
const Regions: React.FC<{ mockRegions: Array<string> }> = ({ mockRegions }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {mockRegions.map((region, index) => (
        <Card
          key={index}
          title={region}
          desc={`Explore wines from ${region}, known for...`}
        />
      ))}
    </div>
  );
};

// Varietal tab
const Varietals: React.FC<{ mockVarietals: Array<string> }> = ({
  mockVarietals,
}) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {mockVarietals.map((region, index) => (
        <Card
          key={index}
          title={region}
          desc={`Explore wines from ${region}, known for...`}
        />
      ))}
    </div>
  );
};

// Producer tab
const Producers: React.FC<{ mockProducers: Array<string> }> = ({
  mockProducers,
}) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {mockProducers.map((p, index) => (
        <Card
          key={index}
          title={p}
          desc={`Explore wines from ${p}, known for...`}
        />
      ))}
    </div>
  );
};

// Card
const Card: React.FC<{ title: string; desc: string }> = ({ title, desc }) => {
  return (
    <div className="border border-border p-3 rounded-xl flex flex-col justify-between shadow bg-gray-50">
      <header className="mb-8">
        <h1 className="text-lg font-semibold text-textPrimary-1 mb-2">
          {title}
        </h1>
        <p className="text-sm text-textSecondary">{desc}</p>
      </header>
      <Button className="w-full flex-center bg-gray-700 text-gray-50 py-2">
        <span className="text-sm">Explore Wines</span>
      </Button>
    </div>
  );
};
