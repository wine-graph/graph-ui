import PageHeader from "../../components/common/PageHeader.tsx";
import {ProducerCard} from "./ProducerCard.tsx";
import {useQuery} from "@apollo/client";
import {PRODUCERS_QUERY} from "../../services/producerGraph.ts";
import {producerClient} from "../../services/apolloClient.ts";
import React, {type ReactNode, useMemo} from "react";
import type {Producer} from "./producer.ts";

const Grid: React.FC<{ children: ReactNode }> = ({children}) => (
  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
    {children}
  </div>
);

export const ProducerMarketplace = () => {

  const {data, loading} = useQuery(PRODUCERS_QUERY, {client: producerClient});
  const producers = useMemo(() => (data?.Producer?.producers as Producer[]) ?? [], [data]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-4 sm:my-8">
      <PageHeader title="Producer Marketplace" desc="Source new wines from 'our' producers"/>
      {loading ? (
        <div className="text-textSecondary">Loading producers...</div>
      ) : (
        <div className="mt-6">
          {producers.length === 0 ? (
            <div className="border border-dashed border-border rounded-xl p-8 text-center text-textSecondary">
              No producers to display.
            </div>
          ) : (
            <Grid>
              {producers.map((producer) => (
                <ProducerCard
                  key={producer.id}
                  {...producer}
                />
              ))}
            </Grid>
          )}
        </div>
      )}
    </div>
  )
}