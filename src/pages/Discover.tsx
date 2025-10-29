import React, {type ReactNode, useMemo, useState} from "react";
import {DomainCard} from "../components/DomainCard.tsx";
import {useQuery} from "@apollo/client";
import {DOMAIN_QUERY} from "../services/domainGraph.ts";
import PageHeader from "../components/common/PageHeader.tsx";
import CrumbButton from "../components/common/CrumbButton.tsx";
import {domainClient} from "../services/apolloClient.ts";
import type {Producer} from "../users/producer/producer.ts";

type Country = {
  id: string;
  name: string;
  description: string;
  flag?: string;
  weblink?: string;
  regions: Region[];
}

type Region = {
  id: string;
  name: string;
  description?: string;
  weblink?: string;
  areas: Area[];
}

type Area = {
  id: string;
  name: string;
  description?: string;
  producers?: Producer[];
}

const Grid: React.FC<{ children: ReactNode }> = ({children}) => (
  <div className="px-3 sm:px-0 sm:ml-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
    {children}
  </div>
);

const DomainList = () => {
  const {data, loading} = useQuery(DOMAIN_QUERY, {client: domainClient});

  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [selectedProducerId, setSelectedProducerId] = useState<string | null>(null);

  const countries = useMemo(() => (data?.Domain?.countries as Country[]) ?? [], [
    data,
  ]);

  const selectedCountry = useMemo(() =>
      countries.find((c: Country) => c.id === selectedCountryId) ?? null,
    [countries, selectedCountryId]
  );

  const selectedRegion = useMemo(() =>
      selectedCountry?.regions.find((r: Region) => r.id === selectedRegionId) ?? null,
    [selectedCountry, selectedRegionId]
  );

  const selectedArea = useMemo(() =>
      selectedRegion?.areas.find((a: Area) => a.id === selectedAreaId) ?? null,
    [selectedRegion, selectedAreaId]
  );

  const selectedProducer = useMemo(() =>
      selectedArea?.producers?.find((p: Producer) => p.id === selectedProducerId) ?? null,
    [selectedArea, selectedProducerId]
  );

  const showCountries = !selectedCountry;
  const showRegions = !!selectedCountry && !selectedRegion;
  const showAreas = !!selectedRegion && !selectedArea;
  const showProducers = !!selectedArea && !selectedProducer;

  const resetToCountries = () => {
    setSelectedCountryId(null);
    setSelectedRegionId(null);
  };
  const resetToRegions = () => {
    setSelectedRegionId(null);
    setSelectedAreaId(null);
  };
  const resetToAreas = () => {
    setSelectedAreaId(null);
    setSelectedProducerId(null);
  }
  const resetToProducers = () => {
    setSelectedProducerId(null);
  }

  return (
    <>
      {loading ? (
        <div className="">Loading countries…</div>
      ) : (
        <>
          {/* Breadcrumbs */}
          <nav
            className="mb-4 flex items-center gap-2 text-sm"
            aria-label="Breadcrumb"
          >
            <CrumbButton onClick={resetToCountries} active={showCountries}>
              Countries
            </CrumbButton>
            {selectedCountry ? (
              <>
                <span className="text-gray-400">/</span>
                <CrumbButton onClick={resetToRegions} active={showRegions}>
                  {selectedCountry.name}
                </CrumbButton>
              </>
            ) : null}
            {selectedRegion ? (
              <>
                <span className="text-gray-400">/</span>
                <CrumbButton onClick={resetToAreas} active={showAreas}>
                  {selectedRegion.name}
                </CrumbButton>
              </>
            ) : null}
            {selectedArea ? (
              <>
                <span className="text-gray-400">/</span>
                <CrumbButton onClick={resetToProducers} active={showProducers}>
                  {selectedArea.name}
                </CrumbButton>
              </>
            ) : null}
            {selectedProducer ? (
              <>
                <span className="text-gray-400">/</span>
                <CrumbButton active={showProducers}>
                  {selectedProducer.name}
                </CrumbButton>
              </>
            ) : null}
          </nav>

          <Grid>
            {showCountries &&
              countries.map((c: Country) => (
                <DomainCard
                  key={c.id}
                  title={c.name}
                  desc={c.description}
                  button={`Explore ${c.name}`}
                  onClick={() => {
                    setSelectedCountryId(c.id);
                    setSelectedRegionId(null);
                  }}
                />
              ))}

            {showRegions &&
              selectedCountry?.regions.map((r: Region) => (
                <DomainCard
                  key={r.id}
                  title={r.name}
                  desc={r.description}
                  button={`Explore ${r.name}`}
                  onClick={() => setSelectedRegionId(r.id)}
                />
              ))}

            {showAreas &&
              selectedRegion?.areas.map((a: Area) => (
                <DomainCard
                  key={a.id}
                  title={a.name}
                  desc={a.description}
                  button={`Explore ${a.name}`}
                  onClick={() => setSelectedAreaId(a.id)}
                />
              ))}
            {showProducers &&
              selectedArea?.producers?.map((p: Producer) => (
                <DomainCard key={p.id} title={p.name} button={`Explore ${p.name} Wines`} onClick={() => setSelectedProducerId(p.id)}
                />
              ))}
          </Grid>
        </>
      )}
    </>
  );
};

export const DiscoverPage = () => {
  return (
    <>
      <div className="w-full mx-auto">
        <PageHeader
          title="Explore Wines"
          desc="Discover wines from around the world by region, varietal, or producer."
        />
      </div>
      <DomainList/>
    </>
  );
};
