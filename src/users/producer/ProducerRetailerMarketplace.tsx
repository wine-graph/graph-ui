import {useMemo, useState} from "react";
import {useQuery} from "@apollo/client";
import {PRODUCER_RETAILER_SOURCING_QUERY} from "../../services/retailer/retailerGraph.ts";
import {retailerClient} from "../../services/apolloClient.ts";
import {type Retailer} from "../retailer/retailer.ts";
import {RetailerCard} from "../retailer/RetailerCard.tsx";
import {Card, EmptyState, SectionTitle, StatePanel} from "../../components/ui";

export const ProducerRetailerMarketplace = () => {
  const {data, loading} = useQuery(PRODUCER_RETAILER_SOURCING_QUERY, {client: retailerClient});
  const retailers = useMemo(() => (data?.Retailer?.retailers as Retailer[]) ?? [], [data]);
  const [selectedState, setSelectedState] = useState("all");

  const stateOptions = useMemo(() => {
    const states = retailers
      .map((retailer) => retailer.location?.state)
      .filter((state): state is string => Boolean(state))
      .map((state) => state.trim())
      .filter(Boolean);
    return Array.from(new Set(states)).sort((a, b) => a.localeCompare(b));
  }, [retailers]);

  const filteredRetailers = useMemo(() => {
    if (selectedState === "all") return retailers;
    return retailers.filter((retailer) => retailer.location?.state === selectedState);
  }, [retailers, selectedState]);

  return (
    <div className="py-2 space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle
          eyebrow="Retailer sourcing"
          title="Find retail shops by market"
          desc="Browse retailer locations by state and scan contact details for new distribution conversations."
        />

        <label className="flex w-full flex-col gap-1 text-sm font-medium lg:w-56">
          State
          <select
            value={selectedState}
            onChange={(event) => setSelectedState(event.target.value)}
            className="h-10 rounded-[var(--radius-sm)] border border-token bg-[color:var(--color-panel)] px-3 text-sm text-token focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]"
          >
            <option value="all">All states</option>
            {stateOptions.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </label>
      </div>

      <Card className="p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <SectionTitle title="Retailers" titleClassName="text-[20px]" />
          <div className="text-sm text-fg-muted">
            {loading ? "Loading..." : `${filteredRetailers.length} shop${filteredRetailers.length === 1 ? "" : "s"}`}
          </div>
        </div>

        {loading ? (
          <StatePanel title="Loading retailers..." align="center" className="py-12" />
        ) : filteredRetailers.length === 0 ? (
          <EmptyState title="No retailers found for this market." className="py-12" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredRetailers.map((retailer) => (
              <RetailerCard key={retailer.id} {...retailer} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
