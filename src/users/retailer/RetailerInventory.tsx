import {useParams} from "react-router-dom";
import {RETAILER_QUERY} from "../../services/retailerGraph.ts";
import {useQuery} from "@apollo/client";
import type {Retailer} from "./retailer.ts";
import {retailerClient} from "../../services/apolloClient.ts";
import React, {type ReactNode} from "react";
import {WineCard} from "../../components/WineCard.tsx";
import {FaConnectdevelop} from "../../assets/icons.ts";
import SectionCard from "../../components/common/SectionCard.tsx";

const Grid: React.FC<{ children: ReactNode }> = ({children}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {children}
  </div>
);

export const RetailerInventory = () => {
  const {retailerId} = useParams();
  const {data, loading} = useQuery(RETAILER_QUERY, {variables: {id: retailerId}, client: retailerClient});

  const retailer = data?.Retailer?.retailer as Retailer | undefined;
  const inventory = Array.isArray(retailer?.inventory) ? retailer!.inventory! : [];

  const totalItems = inventory.length;

  const addressLine = retailer?.location
    ? `${retailer.location.address}, ${retailer.location.city}, ${retailer.location.zipCode}`
    : "Not provided";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-4 sm:my-8">
      <>
        {loading ? (
          <div className="text-textSecondary">Loading inventory…</div>
        ) : (
          <>
            {retailer ? (
              <SectionCard className="mt-6" cardHeader={{icon: FaConnectdevelop, title: `${retailer.name}`}}>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-textSecondary">Total Inventory</div>
                    <div className="text-md text-textPrimary">{totalItems}</div>
                  </div>
                  <div>
                    <div className="text-sm text-textSecondary">POS Provider</div>
                    <div className="text-md text-textPrimary">{retailer.pos}</div>
                  </div>
                  <div>
                    <div className="text-sm text-textSecondary">Location</div>
                    <div className="text-md text-textPrimary">{addressLine}</div>
                  </div>
                </div>
              </SectionCard>
            ) : null}
            <div className="mt-6">
              {inventory.length === 0 ? (
                <div className="border border-dashed border-border rounded-xl p-8 text-center text-textSecondary">
                  No inventory items to display.
                </div>
              ) : (
                <Grid>
                  {inventory.map((item) => (
                    <WineCard
                      key={item.externalItemId || item.wineId || `${item.name}-${item.vintage}-${item.producer}`}
                      {...item}
                    />
                  ))}
                </Grid>
              )}
            </div>
          </>
        )}
      </>
    </div>)
}