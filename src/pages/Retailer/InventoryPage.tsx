import {useParams} from "react-router-dom";
import PageHeader from "../../components/common/PageHeader.tsx";
import {RETAILER_QUERY} from "../../queries/graphqlQueries.ts";
import {useQuery} from "@apollo/client";
import type {Retailer} from "../../types/Retailer.ts";
import {retailerClient} from "../../services/DomainClient.ts";
import React, {type ReactNode} from "react";
import {WineCard} from "../../components/WineCard.tsx";

const Grid: React.FC<{ children: ReactNode }> = ({children}) => (
  <div className="w-full px-3 sm:px-0 sm:ml-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 ">
    {children}
  </div>
);

export const InventoryPage = () => {
  const {retailerId} = useParams();
  const {data, loading, error} = useQuery(RETAILER_QUERY, {variables: {id: retailerId}, client: retailerClient});

  const retailer = data?.Retailer?.retailer as Retailer | undefined;
  const inventory = Array.isArray(retailer?.inventory) ? retailer!.inventory! : [];

  const totalItems = inventory.length;

  return (
    <div className="w-full px-3 sm:px-0 sm:ml-8 my-4 sm:my-8">
      <PageHeader title={`${retailer?.name}`} desc={`Current Inventory: ${totalItems}`}/>
      <>
        {loading ? (
          <div className="">Loading inventory…</div>
        ) : error ? (
          <div className="text-red-600">
            Error loading inventory: {error.message}
          </div>
        ) : (
          <>
            <Grid>
              {inventory.map((item) => (
                <WineCard name={item.name} producer={item.producer} vintage={item.vintage}
                          varietal={item.varietal}/>
              ))}
            </Grid>
          </>
        )}
      </>

    </div>)
}