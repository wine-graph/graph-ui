import {useParams} from "react-router-dom";
import {RETAILER_QUERY} from "../../services/retailerGraph.ts";
import {useQuery} from "@apollo/client";
import {retailerClient} from "../../services/apolloClient.ts";
import RetailerInventoryTable from "./RetailerInventoryTable.tsx";
import {Globe, Mail, MapPin, Phone, Store} from "lucide-react";
import Spinner from "../../components/common/Spinner.tsx";

export const RetailerInventory = () => {
  const {retailerId} = useParams();
  const {data, loading} = useQuery(RETAILER_QUERY, {
    variables: {id: retailerId},
    client: retailerClient,
  });

  const retailer = data?.Retailer?.retailer;
  const inventory = Array.isArray(retailer?.inventory) ? retailer.inventory : [];

  if (loading) return <Spinner label="Loading retailer…"/>;

  if (!retailer) return <div className="p-8 text-center">Retailer not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Ultra-compact retailer header */}
      <div className="border-2 border-[color:var(--color-border)] bg-panel-token p-5 mb-8">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-black tracking-tight truncate">
              {retailer.name}
            </h1>
            <p className="text-sm text-[color:var(--color-fg-muted)] mt-1">
              {retailer.location?.city && `${retailer.location.city}, `}
              {retailer.location?.state}
              {retailer.location?.zipCode && ` ${retailer.location.zipCode}`}
            </p>
          </div>
          <Store className="w-8 h-8 text-[color:var(--color-primary)] shrink-0"/>
        </div>

        {/* Tight info row — only the essentials */}
        <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          {retailer.location?.address && (
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4.5 h-4.5 text-[color:var(--color-primary)]"/>
              <span className="text-[color:var(--color-fg-muted)]">
                {retailer.location.address}
              </span>
            </div>
          )}

          {retailer.location?.phone && (
            <a href={`tel:${retailer.location.phone}`}
               className="flex items-center gap-2.5 hover:text-[color:var(--color-primary)] transition">
              <Phone className="w-4.5 h-4.5 text-[color:var(--color-primary)]"/>
              <span>{retailer.location.phone}</span>
            </a>
          )}

          {retailer.location?.contactEmail && (
            <a href={`mailto:${retailer.location.contactEmail}`}
               className="flex items-center gap-2.5 hover:text-[color:var(--color-primary)] transition">
              <Mail className="w-4.5 h-4.5 text-[color:var(--color-primary)]"/>
              <span className="underline">Email</span>
            </a>
          )}

          {retailer.location?.website && (
            <a href={retailer.location.website} target="_blank" rel="noreferrer"
               className="flex items-center gap-2.5 hover:text-[color:var(--color-primary)] transition">
              <Globe className="w-4.5 h-4.5 text-[color:var(--color-primary)]"/>
              <span className="underline">Website</span>
            </a>
          )}
        </div>

      </div>

      {/* Inventory Table */}
      <div>
        <h2 className="text-2xl font-bold mb-6">{inventory.length} Wines Available</h2>

        {inventory.length === 0 ? (
          <div
            className="text-center py-16 text-[color:var(--color-fg-muted)] border-2 border-dashed border-[color:var(--color-border)]">
            No wines in inventory yet.
          </div>
        ) : (
          <RetailerInventoryTable wines={inventory}/>
        )}
      </div>
    </div>
  );
};