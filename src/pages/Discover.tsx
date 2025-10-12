import { WineDiscovery } from "../components/WineDiscovery.tsx";
import React, { type ReactNode } from "react";
import { DomainCard } from "../components/DomainCard.tsx";
import { gql, useQuery } from "@apollo/client";
import type { Country } from "../types/WineDomain.ts";

const Grid: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="w-full px-3 sm:px-0 sm:ml-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 ">
    {children}
  </div>
);

const COUNTRIES_QUERY = gql(`
    query {
        Domain {
            countries {
                id
                name
                description
            }
        }
    }
`);

const CountriesList: React.FC = () => {
  const { data, loading, error } = useQuery(COUNTRIES_QUERY);

  if (loading)
    return (
      <div className="w-full px-3 sm:px-0 sm:ml-8">Loading countries…</div>
    );
  if (error)
    return (
      <div className="text-red-600 w-full px-3 sm:px-0 sm:ml-8">
        Error loading countries: {error.message}
      </div>
    );

  const countries = data?.Domain?.countries
    ? (data.Domain.countries as Country[])
    : [];

  return (
    <Grid>
      {countries.map((c) => (
        <DomainCard key={c.id} title={c.name} desc={c.description} />
      ))}
    </Grid>
  );
};

export const DiscoverPage = () => {
  // const [searchParams] = useSearchParams();
  // const q = searchParams.get("q");
  // const tabs = ["Countries"];
  // const tabComponents: Record<string, ReactNode> = {
  //     countries: <CountriesList/>,
  // };

  return (
    <>
      <WineDiscovery />
      <CountriesList />
      {/*<SectionTab query={q} tabs={tabs} tabComponents={tabComponents}/>*/}
    </>
  );
};
