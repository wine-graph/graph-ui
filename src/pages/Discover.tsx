import React, {type ReactNode, useMemo, useState} from "react";
import {DomainCard} from "../components/DomainCard.tsx";
import {useQuery} from "@apollo/client";
import {DOMAIN_QUERY} from "../services/domainGraph.ts";
import PageHeader from "../components/common/PageHeader.tsx";
// CrumbButton removed in favor of text-label breadcrumbs per new design spec
import {domainClient} from "../services/apolloClient.ts";
import type {Producer} from "../users/producer/producer.ts";
import Spinner from "../components/common/Spinner.tsx";

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
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <div className="py-10">
          <Spinner label="Loading countries…" />
        </div>
      ) : (
        <>
          {/* Breadcrumbs */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-label">
              <li className={showCountries ? "text-foreground" : "text-fg-muted"}>
                <span onClick={resetToCountries} className="cursor-pointer underline-offset-4 hover:underline">
                  Countries
                </span>
              </li>
              {selectedCountry ? (
                <>
                  <li aria-hidden="true" className="text-fg-muted">/</li>
                  <li className={showRegions ? "text-foreground" : "text-fg-muted"}>
                    <span onClick={resetToRegions} className="cursor-pointer underline-offset-4 hover:underline">
                      {selectedCountry.name}
                    </span>
                  </li>
                </>
              ) : null}
              {selectedRegion ? (
                <>
                  <li aria-hidden="true" className="text-fg-muted">/</li>
                  <li className={showAreas ? "text-foreground" : "text-fg-muted"}>
                    <span onClick={resetToAreas} className="cursor-pointer underline-offset-4 hover:underline">
                      {selectedRegion.name}
                    </span>
                  </li>
                </>
              ) : null}
              {selectedArea ? (
                <>
                  <li aria-hidden="true" className="text-fg-muted">/</li>
                  <li className={showProducers ? "text-foreground" : "text-fg-muted"}>
                    <span onClick={resetToProducers} className="cursor-pointer underline-offset-4 hover:underline">
                      {selectedArea.name}
                    </span>
                  </li>
                </>
              ) : null}
              {selectedProducer ? (
                <>
                  <li aria-hidden="true" className="text-fg-muted">/</li>
                  <li className="text-foreground">
                    {selectedProducer.name}
                  </li>
                </>
              ) : null}
            </ol>
          </nav>

          <Grid>
            {showCountries &&
              countries.map((c: Country) => (
                <DomainCard
                  key={c.id}
                  title={c.name}
                  desc={c.description}
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
                  onClick={() => setSelectedRegionId(r.id)}
                />
              ))}

            {showAreas &&
              selectedRegion?.areas.map((a: Area) => (
                <DomainCard
                  key={a.id}
                  title={a.name}
                  desc={a.description}
                  onClick={() => setSelectedAreaId(a.id)}
                />
              ))}
            {showProducers &&
              selectedArea?.producers?.map((p: Producer) => (
                <DomainCard key={p.id} title={p.name} onClick={() => setSelectedProducerId(p.id)}
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
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <PageHeader
        title="Explore Wines"
        desc="Discover wines from around the world by region, varietal, or producer."
      />
      <div className="mt-8 sm:mt-12">
        <DomainList/>
      </div>
    </div>
  );
};
