import React, { type ReactNode, useMemo, useState } from "react";
import { DomainCard } from "../components/DomainCard.tsx";
import { useQuery } from "@apollo/client";
import { DOMAIN_QUERY } from "../queries/graphqlQueries.ts";
import type { Country } from "../types/WineDomain.ts";
import PageHeader from "../components/common/PageHeader.tsx";
import CrumbButton from "../components/common/CrumbButton.tsx";

const Grid: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="w-full px-3 sm:px-0 sm:ml-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 ">
    {children}
  </div>
);

const DomainList: React.FC = () => {
  const { data, loading, error } = useQuery(DOMAIN_QUERY);

  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(
    null
  );
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  const countries = (data?.Domain?.countries as Country[]) ?? [];

  const selectedCountry = useMemo(
    () => countries.find((c) => c.id === selectedCountryId) ?? null,
    [countries, selectedCountryId]
  );

  const selectedRegion = useMemo(
    () =>
      selectedCountry?.regions.find((r) => r.id === selectedRegionId) ?? null,
    [selectedCountry, selectedRegionId]
  );

  const showCountries = !selectedCountry;
  const showRegions = !!selectedCountry && !selectedRegion;
  const showAreas = !!selectedRegion;

  const resetToCountries = () => {
    setSelectedCountryId(null);
    setSelectedRegionId(null);
  };
  const resetToRegions = () => {
    setSelectedRegionId(null);
  };

  return (
    <div className="px-3 sm:px-0 w-full sm:ml-8">
      {loading ? (
        <div className="">Loading countries…</div>
      ) : error ? (
        <div className="text-red-600">
          Error loading countries: {error.message}
        </div>
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
                <CrumbButton active={showAreas}>
                  {selectedRegion.name}
                </CrumbButton>
              </>
            ) : null}
          </nav>

          <Grid>
            {showCountries &&
              countries.map((c) => (
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
              selectedCountry?.regions.map((r) => (
                <DomainCard
                  key={r.id}
                  title={r.name}
                  desc={r.description}
                  onClick={() => setSelectedRegionId(r.id)}
                />
              ))}

            {showAreas &&
              selectedRegion?.areas.map((a) => (
                <DomainCard
                  key={a.id}
                  title={a.name}
                  desc={a.description}
                  onClick={() => {
                    /* Could navigate deeper in future */
                  }}
                />
              ))}
          </Grid>
        </>
      )}
    </div>
  );
};

export const DiscoverPage = () => {
  return (
    <>
      <div className="w-full px-3 sm:px-0 sm:ml-8 my-4 sm:my-8">
        <PageHeader
          title="Explore Wines"
          desc="Discover wines from around the world by region, varietal, or producer."
        />
      </div>
      <DomainList />
    </>
  );
};
